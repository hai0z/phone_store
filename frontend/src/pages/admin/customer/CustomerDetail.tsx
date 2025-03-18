import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Timeline,
  Descriptions,
  Spin,
  Tag,
  Typography,
  Tabs,
  Avatar,
  Button,
  Empty,
  Divider,
  Badge,
  Space,
  Statistic,
  Row,
  Col,
  Image,
} from "antd";
import {
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Title, Text } = Typography;

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "da_giao_hang":
      return "green";
    case "cho_xac_nhan":
      return "gold";
    case "da_xac_nhan":
      return "purple";
    case "dang_giao_hang":
      return "blue";
    case "da_huy":
      return "red";
    default:
      return "default";
  }
};

const getOrderStatus = (status: string) => {
  switch (status.toLowerCase()) {
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
  }
};

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = parseInt(id!);

  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/customers/${customerId}`
      );
      return response.data;
    },
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/customers/${customerId}/orders`
      );
      return response.data;
    },
  });

  const { data: ratings = [], isLoading: isLoadingRatings } = useQuery({
    queryKey: ["customerRatings", customerId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/customers/${customerId}/ratings`
      );
      return response.data;
    },
  });

  if (isLoadingCustomer || isLoadingOrders || isLoadingRatings) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin khách hàng..." />
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Empty description="Không tìm thấy thông tin khách hàng" />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/customers")}
          style={{ marginTop: "20px" }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Tính tổng giá trị đơn hàng
  const totalSpent = orders.reduce(
    (sum: number, order: any) => sum + parseFloat(order.total_amount || 0),
    0
  );

  const orderTimelineItems =
    orders.length > 0
      ? orders.map((order: any) => ({
          color: getStatusColor(order.status),
          dot: <ShoppingOutlined style={{ fontSize: "16px" }} />,
          children: (
            <Card
              onClick={() => navigate(`/admin/orders/${order.order_id}`)}
              hoverable
              size="small"
              title={
                <Space>
                  <Badge status={getStatusColor(order.status) as any} />
                  <Text strong>Đơn hàng #{order.order_id}</Text>
                </Space>
              }
              style={{
                marginBottom: 16,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
              }}
              extra={
                <Tag color={getStatusColor(order.status)}>
                  {getOrderStatus(order.status)}
                </Tag>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                  <CalendarOutlined />
                  <Text>
                    {new Date(order.order_date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Space>

                <Space>
                  <DollarOutlined />
                  <Text strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total_amount)}
                  </Text>
                </Space>

                <Divider style={{ margin: "8px 0" }} />

                <div>
                  {order.orderDetails?.map((detail: any) => (
                    <div
                      key={detail.order_detail_id}
                      style={{
                        padding: "8px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "80%",
                        }}
                      >
                        <Image
                          width={64}
                          height={64}
                          src={detail.variant.product.images?.[0]?.image_url}
                        />
                        <div style={{ overflow: "hidden", marginLeft: 10 }}>
                          <Text strong ellipsis style={{ fontSize: "14px" }}>
                            {detail.variant.product.product_name}
                          </Text>
                          <div style={{ marginTop: "4px" }}>
                            {detail.variant.ram?.capacity && (
                              <Tag color="blue" style={{ marginRight: "4px" }}>
                                RAM {detail.variant.ram?.capacity}
                              </Tag>
                            )}
                            {detail.variant.storage?.capacity && (
                              <Tag
                                color="purple"
                                style={{ marginRight: "4px" }}
                              >
                                {detail.variant.storage?.capacity}
                              </Tag>
                            )}
                            {detail.variant.color?.color_name && (
                              <Tag color="cyan">
                                {detail.variant.color?.color_name}
                              </Tag>
                            )}
                          </div>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "12px",
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detail.price)}{" "}
                            x {detail.quantity}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Space>
            </Card>
          ),
        }))
      : [
          {
            dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
            children: <Empty description="Khách hàng chưa có đơn hàng nào" />,
          },
        ];

  const ratingTimelineItems =
    ratings.length > 0
      ? ratings.map((rating: any) => ({
          color: "gold",
          dot: <StarOutlined style={{ fontSize: "16px" }} />,
          children: (
            <Card
              hoverable
              size="small"
              title={`Đánh giá sản phẩm: ${rating.product.product_name}`}
              style={{
                marginBottom: 16,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
              }}
              extra={
                <Text>
                  {new Date(rating.rating_date).toLocaleDateString("vi-VN")}
                </Text>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Đánh giá: </Text>
                  {[...Array(5)].map((_, i) => (
                    <StarOutlined
                      key={i}
                      style={{
                        color: i < rating.rating ? "#FADB14" : "#D9D9D9",
                        marginRight: 4,
                      }}
                    />
                  ))}
                </div>

                <div>
                  <Text strong>Nhận xét: </Text>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "8px",
                      borderRadius: "4px",
                      marginTop: "4px",
                    }}
                  >
                    {rating.comment || (
                      <Text type="secondary">Không có nhận xét</Text>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
          ),
        }))
      : [
          {
            dot: <StarOutlined style={{ fontSize: "16px" }} />,
            children: <Empty description="Khách hàng chưa có đánh giá nào" />,
          },
        ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        style={{ marginBottom: 24, borderRadius: "8px" }}
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/customers")}
              type="text"
            />
            <Title level={4} style={{ margin: 0 }}>
              Thông tin khách hàng
            </Title>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
              <Descriptions.Item label="Họ và tên" span={2}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{customer.full_name}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {customer.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {
                  customer.addresses.find((address: any) => address.is_default)
                    ?.address
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tổng đơn hàng"
                    value={orders.length}
                    prefix={<ShoppingOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Tổng chi tiêu"
                    value={totalSpent}
                    precision={0}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value as number)}`
                    }
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="orders"
        type="card"
        items={[
          {
            key: "orders",
            label: (
              <span>
                <ShoppingOutlined /> Đơn hàng ({orders.length})
              </span>
            ),
            children: (
              <Card style={{ borderRadius: "8px" }}>
                <Timeline
                  items={orderTimelineItems}
                  mode="alternate"
                  style={{ padding: "20px 0" }}
                />
              </Card>
            ),
          },
          {
            key: "ratings",
            label: (
              <span>
                <StarOutlined /> Đánh giá ({ratings.length})
              </span>
            ),
            children: (
              <Card style={{ borderRadius: "8px" }}>
                <Timeline
                  items={ratingTimelineItems}
                  mode="left"
                  style={{ padding: "20px 0" }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CustomerDetail;
