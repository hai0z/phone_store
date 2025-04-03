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
  Table,
  Tooltip,
  Progress,
} from "antd";
import {
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarFilled,
  EyeOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

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
          background: "#f0f2f5",
        }}
      >
        <Card style={{ padding: "20px", textAlign: "center", width: "300px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "20px" }}>Đang tải thông tin khách hàng...</p>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          background: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: "400px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Empty
            description="Không tìm thấy thông tin khách hàng"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/customers")}
            style={{ marginTop: "20px" }}
          >
            Quay lại danh sách
          </Button>
        </Card>
      </div>
    );
  }

  // Tính tổng giá trị đơn hàng
  const totalSpent = orders.reduce(
    (sum: number, order: any) => sum + parseFloat(order.total_amount || 0),
    0
  );

  // Tính tỷ lệ đơn hàng theo trạng thái
  const orderStatusCounts = orders.reduce((acc: any, order: any) => {
    const status = order.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Chuẩn bị dữ liệu cho thống kê
  const completedOrders = orderStatusCounts["da_giao_hang"] || 0;
  const completionRate =
    orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;

  // Define table columns for orders
  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (text: string) => <Text strong>#{text}</Text>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <Text>
            {new Date(date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Space>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderDetails",
      key: "products",
      render: (orderDetails: any[]) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          {orderDetails?.slice(0, 2).map((detail: any) => (
            <div
              key={detail.order_detail_id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 0",
              }}
            >
              <Avatar
                shape="square"
                size={48}
                src={detail.variant.product.images?.[0]?.image_url}
                style={{
                  marginRight: 12,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              />
              <div>
                <Text
                  ellipsis
                  style={{ width: 170, display: "block", fontWeight: 500 }}
                  title={detail.variant.product.product_name}
                >
                  {detail.variant.product.product_name}
                </Text>
                <Space size={4} style={{ marginTop: 2 }}>
                  {detail.variant.color?.color_name && (
                    <Tag color="cyan" style={{ margin: 0 }}>
                      {detail.variant.color?.color_name}
                    </Tag>
                  )}
                  {detail.variant.ram?.capacity && (
                    <Tag color="blue" style={{ margin: 0 }}>
                      {detail.variant.ram?.capacity}
                    </Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {detail.quantity} x{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(detail.price)}
                  </Text>
                </Space>
              </div>
            </div>
          ))}
          {orderDetails?.length > 2 && (
            <Text
              type="secondary"
              style={{ fontSize: "13px", fontStyle: "italic" }}
            >
              {`+${orderDetails.length - 2} sản phẩm khác`}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => (
        <Text strong style={{ color: "#1890ff", fontSize: "15px" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          style={{ padding: "4px 8px", borderRadius: "4px" }}
        >
          {getOrderStatus(status)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/orders/${record.order_id}`)}
            style={{ borderRadius: "6px" }}
          />
        </Tooltip>
      ),
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
                  {dayjs(rating.created_at).format("DD/MM/YYYY HH:mm")}
                </Text>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Đánh giá: </Text>
                  {[...Array(5)].map((_, i) => (
                    <StarFilled
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
                    {rating.content || (
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
        style={{
          marginBottom: 24,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
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
            <Card
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#1890ff",
                    marginRight: 16,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                    {customer.full_name}
                  </Title>
                  <Space direction="vertical" size={8}>
                    <Space>
                      <MailOutlined style={{ color: "#1890ff" }} />
                      <Text>{customer.email}</Text>
                    </Space>
                    <Space>
                      <PhoneOutlined style={{ color: "#1890ff" }} />
                      <Text>{customer.phone}</Text>
                    </Space>
                    <Space align="start">
                      <EnvironmentOutlined style={{ color: "#1890ff" }} />
                      <Text>
                        {customer.addresses.find(
                          (address: any) => address.is_default
                        )?.address || "Chưa có địa chỉ"}
                      </Text>
                    </Space>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <Statistic
                    title={<Text strong>Tổng đơn hàng</Text>}
                    value={orders.length}
                    prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<Text strong>Tổng chi tiêu</Text>}
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
                <Col span={24}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Đơn hoàn thành:</Text>
                    <Text style={{ float: "right" }}>{`${completedOrders}/${
                      orders.length
                    } (${completionRate.toFixed(0)}%)`}</Text>
                  </div>
                  <Progress
                    percent={completionRate}
                    status="active"
                    strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    showInfo={false}
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
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                {orders.length > 0 ? (
                  <Table
                    dataSource={orders}
                    columns={orderColumns}
                    rowKey="order_id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                      showTotal: (total) => `Tổng ${total} đơn hàng`,
                    }}
                    style={{ overflowX: "auto" }}
                    className="order-table"
                  />
                ) : (
                  <Empty
                    description="Khách hàng chưa có đơn hàng nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ padding: "40px 0" }}
                  />
                )}
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
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Timeline
                  items={ratingTimelineItems}
                  mode="left"
                  style={{ padding: "20px 0" }}
                />
              </Card>
            ),
          },
        ]}
        style={{ marginBottom: 24 }}
      />

      <style>
        {`
        .order-table .ant-table-tbody > tr:hover > td {
          background-color: #f5f9ff;
          transition: all 0.3s;
        }
        .order-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        .ant-card {
          overflow: hidden;
        }
        .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
          border-radius: 8px 8px 0 0;
          transition: all 0.3s;
        }
        .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
          background-color: white;
          border-bottom-color: white;
          font-weight: 500;
        }
        `}
      </style>
    </div>
  );
};

export default CustomerDetail;
