import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  Typography,
  Space,
  Tag,
  Steps,
  Button,
  message,
  Popconfirm,
  Descriptions,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/orders/${id}`
      );
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return axios.patch(
        `http://localhost:8080/api/v1/orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => {
      messageApi.success("Cập nhật trạng thái đơn hàng thành công");
      refetch();
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    },
  });

  const getStatusStep = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return 0;
      case "da_xac_nhan":
        return 1;
      case "dang_giao_hang":
        return 2;
      case "da_giao_hang":
        return 3;
      case "da_huy":
        return -1;
      default:
        return 0;
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return <Card loading={true} />;
  }

  if (!order) {
    return (
      <Card>
        <Title level={4}>Không tìm thấy đơn hàng</Title>
      </Card>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Space align="center" style={{ marginBottom: "24px" }}>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", color: "#1890ff" }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Cập nhật trạng thái đơn hàng #{order.order_id}
          </Title>
        </Space>

        <Card
          title={
            <Space>
              <UserOutlined />
              Thông tin cơ bản
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Descriptions column={2}>
            <Descriptions.Item label="Khách hàng">
              {order.customer.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {order.customer.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <Text strong type="danger">
                {order.total_amount.toLocaleString("vi-VN")}đ
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              <Tag color="blue">
                {order.payment_method === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "VNPay"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: "24px" }}>
          <Steps
            current={currentStep}
            status={order.status === "da_huy" ? "error" : "process"}
            items={[
              {
                title: "Chờ xác nhận",
                icon: <ShoppingCartOutlined />,
              },
              {
                title: "Đã xác nhận",
                icon: <CheckCircleOutlined />,
              },
              {
                title: "Đang giao hàng",
                icon: <CarOutlined />,
              },
              {
                title: "Đã giao hàng",
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        </Card>

        <div style={{ textAlign: "right" }}>
          <Space>
            {order.status === "cho_xac_nhan" && (
              <>
                <Popconfirm
                  title="Xác nhận đơn hàng"
                  description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                  onConfirm={() => handleUpdateStatus("da_xac_nhan")}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button type="primary">Xác nhận đơn hàng</Button>
                </Popconfirm>
                <Popconfirm
                  title="Hủy đơn hàng"
                  description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                  onConfirm={() => handleUpdateStatus("da_huy")}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button danger>Hủy đơn hàng</Button>
                </Popconfirm>
              </>
            )}
            {order.status === "da_xac_nhan" && (
              <Popconfirm
                title="Bắt đầu giao hàng"
                description="Xác nhận bắt đầu giao hàng?"
                onConfirm={() => handleUpdateStatus("dang_giao_hang")}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button type="primary">Bắt đầu giao hàng</Button>
              </Popconfirm>
            )}
            {order.status === "dang_giao_hang" && (
              <Popconfirm
                title="Xác nhận đã giao hàng"
                description="Xác nhận đơn hàng đã được giao thành công?"
                onConfirm={() => handleUpdateStatus("da_giao_hang")}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button type="primary">Xác nhận đã giao hàng</Button>
              </Popconfirm>
            )}
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default OrderEdit;
