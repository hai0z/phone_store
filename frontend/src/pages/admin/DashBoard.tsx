import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Table,
  Progress,
  Tag,
  Spin,
  Alert,
  Avatar,
  Divider,
  Badge,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  StarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ProductOutlined,
  DashboardOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { theme } from "antd";

const { Title, Text } = Typography;
const { useToken } = theme;

interface DashboardData {
  statistics: {
    totalProducts: number;
    totalCustomers: number;
    monthlyRevenue: number;
  };
  recentOrders: {
    id: number;
    order_date: string;
    total_amount: number;
    status: string;
    customer: {
      name: string;
    };
    orderDetails: Array<{
      variant: {
        product: {
          product_name: string;
        };
      };
    }>;
  }[];
  lowStockProducts: Array<{
    product: {
      product_name: string;
    };
    stock: number;
  }>;
  phoneDistribution: {
    labels: string[];
    series: number[];
  };
}

const DashBoard: React.FC = () => {
  const { token } = useToken();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard"
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu bảng điều khiển"
        type="error"
        showIcon
      />
    );
  }

  // const formattedOrders =
  //   dashboardData?.recentOrders.map((order) => ({
  //     key: order?.id.toString(),
  //     orderId: `#ĐH${order.id.toString().padStart(3, "0")}`,
  //     customer: order.customer.name,
  //     product: order.orderDetails[0]?.variant.product.product_name || "N/A",
  //     amount: order.total_amount,
  //     status: order.status,
  //     date: new Date(order.order_date).toLocaleDateString("vi-VN"),
  //   })) || [];

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (name: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: token.colorPrimary }}>
            {name.charAt(0)}
          </Avatar>
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span style={{ color: "#52c41a", fontWeight: "bold" }}>
          {amount.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          Completed: { color: "success", text: "Hoàn thành" },
          Processing: { color: "processing", text: "Đang xử lý" },
          Pending: { color: "warning", text: "Chờ xác nhận" },
        };
        const statusInfo = statusMap[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: token.colorTextSecondary }} />
          <Text>{date}</Text>
        </Space>
      ),
    },
  ];

  const phoneModelsData = {
    series: dashboardData?.phoneDistribution.series,
    options: {
      chart: {
        type: "pie",
        height: 350,
        fontFamily: "Roboto, sans-serif",
      },
      labels: dashboardData?.phoneDistribution.labels,
      colors: [
        token.colorPrimary,
        token.colorSuccess,
        token.colorWarning,
        token.colorError,
        "#722ed1",
        "#13c2c2",
      ],
      legend: {
        position: "bottom",
        fontSize: "14px",
      },
      title: {
        text: "Phân bổ thị phần điện thoại",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "Roboto, sans-serif",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + "%";
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    } as ApexOptions,
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
        <DashboardOutlined
          style={{ fontSize: 24, marginRight: 12, color: token.colorPrimary }}
        />
        <Title level={2} style={{ margin: 0 }}>
          Bảng Điều Khiển
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 8, height: "100%" }}>
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                  padding: 12,
                  borderRadius: "50%",
                }}
              >
                <DollarCircleOutlined
                  style={{ fontSize: "28px", color: "#1890ff" }}
                />
              </div>
              <div>
                <Text type="secondary">Doanh thu tháng</Text>
                <Statistic
                  value={dashboardData?.statistics.monthlyRevenue || 0}
                  suffix="₫"
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
                <Text type="success">
                  <ArrowUpOutlined /> 12% so với tháng trước
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 8, height: "100%" }}>
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(82, 196, 26, 0.1)",
                  padding: 12,
                  borderRadius: "50%",
                }}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: "28px", color: "#52c41a" }}
                />
              </div>
              <div>
                <Text type="secondary">Đơn hàng gần đây</Text>
                <Statistic
                  value={dashboardData?.recentOrders.length || 0}
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
                <Badge status="processing" text="Cập nhật liên tục" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 8, height: "100%" }}>
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(114, 46, 209, 0.1)",
                  padding: 12,
                  borderRadius: "50%",
                }}
              >
                <UserOutlined style={{ fontSize: "28px", color: "#722ed1" }} />
              </div>
              <div>
                <Text type="secondary">Tổng khách hàng</Text>
                <Statistic
                  value={dashboardData?.statistics.totalCustomers || 0}
                  valueStyle={{ color: "#722ed1", fontWeight: "bold" }}
                />
                <Text type="success">
                  <ArrowUpOutlined /> 5% so với tháng trước
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 8, height: "100%" }}>
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(250, 140, 22, 0.1)",
                  padding: 12,
                  borderRadius: "50%",
                }}
              >
                <ProductOutlined
                  style={{ fontSize: "28px", color: "#fa8c16" }}
                />
              </div>
              <div>
                <Text type="secondary">Tổng sản phẩm</Text>
                <Statistic
                  value={dashboardData?.statistics.totalProducts || 0}
                  valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                />
                <Badge status="success" text="Đã cập nhật" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card
            hoverable
            title={<Title level={4}>Phân tích doanh thu</Title>}
            style={{ borderRadius: 8 }}
          >
            <div
              style={{
                height: 350,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text type="secondary">
                Biểu đồ phân tích doanh thu sẽ hiển thị ở đây
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card hoverable style={{ borderRadius: 8 }}>
            <ReactApexChart
              options={phoneModelsData.options}
              series={phoneModelsData.series}
              type="pie"
              height={350}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Card
            hoverable
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: token.colorPrimary }} />
                <Title level={4} style={{ margin: 0 }}>
                  Đơn hàng gần đây
                </Title>
              </Space>
            }
            style={{ borderRadius: 8 }}
            extra={<Text type="secondary">Xem tất cả</Text>}
          >
            <Table
              columns={orderColumns}
              dataSource={[]}
              pagination={{ pageSize: 5 }}
              size="middle"
              style={{ marginTop: 16 }}
              rowClassName="hover-row"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
