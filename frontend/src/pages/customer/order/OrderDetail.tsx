import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Tag,
  Image,
  Space,
  Spin,
  Divider,
  theme,
  Button,
  Flex,
  Modal,
} from "antd";
import dayjs from "dayjs";
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { order_id } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const token = theme.useToken().token;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/orders/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order_id]);

  const handleCancelOrder = async () => {
    setConfirmLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/v1/orders/${order_id}/status`,
        { status: "da_huy" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedResponse = await fetch(
          `http://localhost:8080/api/v1/orders/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        setOrderData(updatedData);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setTimeout(() => {
        setConfirmLoading(false);
        navigate("/profile?tab=2");
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <Title level={3}>Không tìm thấy đơn hàng</Title>
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "variant",
      key: "product",
      render: (variant: any) => (
        <Space size="large">
          <Image
            src={variant.product.images[0]?.image_url}
            alt={variant.product.product_name}
            width={100}
            height={100}
            preview={false}
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
          <div>
            <Text strong>{variant.product.product_name}</Text>
            <div style={{ color: "#666", marginTop: "8px" }}>
              <Tag color="blue">
                {variant.ram.capacity} - {variant.storage.storage_capacity}
              </Tag>
              <Tag color="gold">{variant.color.color_name}</Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <Text strong>{price.toLocaleString("vi-VN")}đ</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <Text strong>{quantity}</Text>,
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (record: any) => (
        <Text strong type="danger">
          {(record.price * record.quantity).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "gold";
      case "da_xac_nhan":
        return "blue";
      case "dang_giao_hang":
        return "blue";
      case "da_giao_hang":
        return "green";
      default:
        return "red";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "Chờ xác nhận";
      case "da_xac_nhan":
        return "Đã xác nhận";
      case "dang_giao_hang":
        return "Đang giao hàng";
      case "da_giao_hang":
        return "Hoàn thành";
      default:
        return "Đã hủy";
    }
  };

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space align="center" style={{ marginBottom: "24px" }}>
          <ShoppingOutlined
            style={{ fontSize: "24px", color: token.colorPrimary }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết đơn hàng #{orderData.order_id}
          </Title>
        </Space>

        <Descriptions
          bordered
          column={1}
          labelStyle={{ width: "200px", background: "#fafafa" }}
          contentStyle={{ background: "#fff" }}
        >
          <Descriptions.Item label="Trạng thái">
            <Tag
              color={getStatusColor(orderData.status)}
              style={{ padding: "4px 12px", fontSize: "14px" }}
            >
              {getStatusText(orderData.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">
            {dayjs(orderData.order_date).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Space>
              <DollarOutlined />
              {orderData.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán online qua VNPay"}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Space align="center" style={{ marginBottom: "16px" }}>
          <UserOutlined
            style={{ fontSize: "20px", color: token.colorPrimary }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Thông tin người nhận
          </Title>
        </Space>

        <Descriptions
          bordered
          column={1}
          labelStyle={{ width: "200px", background: "#fafafa" }}
          contentStyle={{ background: "#fff" }}
        >
          <Descriptions.Item label="Họ tên">
            {orderData.customer.full_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {orderData.customer.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {orderData.customer.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ nhận hàng">
            {orderData.address}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={4} style={{ marginBottom: "24px" }}>
          Chi tiết sản phẩm
        </Title>
        <Table
          columns={columns}
          dataSource={orderData.orderDetails}
          pagination={false}
          rowKey="order_detail_id"
          bordered
          style={{ background: "#fff" }}
        />

        <div
          style={{
            textAlign: "right",
            marginTop: "32px",
            background: "#f6f6f6",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Title level={3} style={{ color: token.colorError }}></Title>
          <Title level={3} style={{ color: token.colorError }}>
            Tổng tiền: {orderData.total_amount.toLocaleString("vi-VN")}đ
          </Title>
        </div>
        <Divider />
        <Flex justify="end" gap="middle">
          {orderData.status === "cho_xac_nhan" && (
            <Button type="primary" danger onClick={() => setIsModalOpen(true)}>
              Hủy đơn hàng
            </Button>
          )}

          <Button type="primary" onClick={() => navigate("/profile?tab=2")}>
            Quay lại
          </Button>
        </Flex>
      </Card>

      <Modal
        title="Xác nhận hủy đơn hàng"
        centered
        open={isModalOpen}
        confirmLoading={confirmLoading}
        onOk={handleCancelOrder}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
      </Modal>
    </div>
  );
};

export default OrderDetail;
