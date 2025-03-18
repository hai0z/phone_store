import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Table,
  Typography,
  Space,
  Tag,
  Image,
  Divider,
  Button,
  message,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const printRef = useRef(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/orders/${id}`
      );
      return response.data;
    },
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "gold";
      case "da_xac_nhan":
        return "blue";
      case "dang_giao_hang":
        return "processing";
      case "da_giao_hang":
        return "success";
      case "da_huy":
        return "error";
      default:
        return "default";
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
        return "Đã giao hàng";
      case "da_huy":
        return "Đã hủy";
      default:
        return status;
    }
  };

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
            width={80}
            height={80}
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
          <div>
            <Text strong>{variant.product.product_name}</Text>
            <div style={{ marginTop: "8px" }}>
              <Tag color="blue">
                {variant.ram.capacity} - {variant.storage.storage_capacity}
              </Tag>
              <Tag color="cyan">{variant.color.color_name}</Tag>
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
      render: (_: any, record: any) => (
        <Text strong type="danger">
          {(record.price * record.quantity).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
  ];

  const printColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "variant",
      key: "product",
      render: (variant: any) => (
        <div>
          <Text strong>{variant.product.product_name}</Text>
          <div>
            {variant.ram.capacity}GB - {variant.storage.storage_capacity}GB,{" "}
            {variant.color.color_name}
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <Text>{price.toLocaleString("vi-VN")}đ</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: any, record: any) => (
        <Text>{(record.price * record.quantity).toLocaleString("vi-VN")}đ</Text>
      ),
    },
  ];

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

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Space align="center" style={{ marginBottom: "24px" }}>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", color: "#1890ff" }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết đơn hàng #{order.order_id}
          </Title>
        </Space>

        <Card
          title={
            <Space>
              <UserOutlined />
              Thông tin khách hàng
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Descriptions column={2}>
            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  Họ tên
                </Space>
              }
            >
              {order.customer.full_name}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <PhoneOutlined />
                  Số điện thoại
                </Space>
              }
            >
              {order.customer.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              }
            >
              {order.customer.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <EnvironmentOutlined />
                  Địa chỉ giao hàng
                </Space>
              }
            >
              {order.address}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={
            <Space>
              <ShoppingCartOutlined />
              Thông tin đơn hàng
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Descriptions column={2}>
            <Descriptions.Item label="Mã đơn hàng">
              #{order.order_id.toString().padStart(5, "0")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              <Tag color="blue">
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "VNPay"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Table
            columns={columns}
            dataSource={order.orderDetails}
            pagination={false}
            rowKey="order_detail_id"
          />

          <div
            style={{
              marginTop: "24px",
              textAlign: "right",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "24px",
            }}
          >
            <Space direction="vertical" align="end">
              <Text>
                Tổng tiền hàng:{" "}
                <Text strong>
                  {order.total_amount.toLocaleString("vi-VN")}đ
                </Text>
              </Text>
              {order.voucher && (
                <Text>
                  Giảm giá:{" "}
                  <Text strong type="success">
                    -{order.discount?.toLocaleString("vi-VN")}đ
                  </Text>
                </Text>
              )}

              <Text strong style={{ fontSize: "16px" }}>
                Tổng thanh toán:{" "}
                <Text strong type="danger" style={{ fontSize: "18px" }}>
                  {order.total_amount.toLocaleString("vi-VN")}đ
                </Text>
              </Text>
            </Space>
          </div>
        </Card>

        <div style={{ textAlign: "right" }}>
          <Space>
            {order.status !== "da_huy" && (
              <>
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(`/admin/orders/edit/${order.order_id}`)
                  }
                >
                  Cập nhật trạng thái
                </Button>
                <Button
                  type="default"
                  variant="outlined"
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint()}
                >
                  In hóa đơn
                </Button>
              </>
            )}
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </Space>
        </div>
      </Card>

      {/* Phần giao diện in hóa đơn (ẩn) */}
      <div style={{ display: "none" }}>
        <div ref={printRef} style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ margin: "0" }}>HÓA ĐƠN BÁN HÀNG</h1>
            <p>Mã đơn hàng: #{order.order_id.toString().padStart(5, "0")}</p>
            <p>
              Ngày đặt: {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2>Thông tin khách hàng</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "150px" }}>Họ tên:</td>
                  <td>{order.customer.full_name}</td>
                </tr>
                <tr>
                  <td>Số điện thoại:</td>
                  <td>{order.customer.phone}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{order.customer.email}</td>
                </tr>
                <tr>
                  <td>Địa chỉ giao hàng:</td>
                  <td>{order.address}</td>
                </tr>
                <tr>
                  <td>Phương thức thanh toán:</td>
                  <td>
                    {order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "VNPay"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2>Chi tiết đơn hàng</h2>
            <Table
              columns={printColumns}
              dataSource={order.orderDetails}
              pagination={false}
              rowKey="order_detail_id"
              bordered
              style={{ marginBottom: "20px" }}
            />

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <p>
                <strong>Tổng tiền hàng:</strong>{" "}
                {order.total_amount.toLocaleString("vi-VN")}đ
              </p>
              {order.voucher && (
                <p>
                  <strong>Giảm giá:</strong> -
                  {order.discount?.toLocaleString("vi-VN")}đ
                </p>
              )}
              <p style={{ fontSize: "18px" }}>
                <strong>Tổng thanh toán:</strong>{" "}
                {order.total_amount.toLocaleString("vi-VN")}đ
              </p>
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ textAlign: "center", width: "200px" }}>
                <p>
                  <strong>Người mua hàng</strong>
                </p>
                <p style={{ marginTop: "60px" }}>(Ký, ghi rõ họ tên)</p>
              </div>
              <div style={{ textAlign: "center", width: "200px" }}>
                <p>
                  <strong>Người bán hàng</strong>
                </p>
                <p style={{ marginTop: "60px" }}>(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
