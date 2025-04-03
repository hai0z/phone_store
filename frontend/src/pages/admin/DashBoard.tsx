import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Table,
  Tag,
  Spin,
  Alert,
  Avatar,
  Badge,
  List,
  Tooltip,
  Button,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  ProductOutlined,
  DashboardOutlined,
  CalendarOutlined,
  WarningOutlined,
  RightOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { theme } from "antd";
import RevenueAnalytics from "./stats/RevenueAnalytics";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { useToken } = theme;

interface DashboardData {
  statistics: {
    totalProducts: number;
    totalCustomers: number;
    monthlyRevenue: number;
  };
  recentOrders: {
    order_id: number;
    order_date: string;
    total_amount: number;
    status: string;
    customer: {
      full_name: string;
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          background: token.colorBgContainer,
        }}
      >
        <Spin size="large" />
        <Typography.Title level={4} style={{ marginTop: 24 }}>
          Đang tải dữ liệu...
        </Typography.Title>
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
        action={
          <Button size="small" danger>
            Tải lại
          </Button>
        }
      />
    );
  }

  const formattedOrders =
    dashboardData?.recentOrders.map((order) => ({
      key: order?.order_id.toString(),
      orderId: `#ĐH${order.order_id.toString().padStart(3, "0")}`,
      customer: order.customer.full_name,
      product: order.orderDetails[0]?.variant.product.product_name || "N/A",
      amount: order.total_amount,
      status: order.status,
      date: order.order_date,
    })) || [];

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
          da_giao_hang: { color: "green", text: "Hoàn thành" },
          cho_xac_nhan: { color: "gold", text: "Chờ xác nhận" },
          dang_giao_hang: { color: "blue", text: "Chờ xác nhận" },
          da_huy: { color: "red", text: "Đã hủy" },
          da_xac_nhan: { color: "purple", text: "Đã xác nhận" },
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
          <Text>{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>
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
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 5,
          left: 0,
          top: 0,
        },
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
        fontWeight: 500,
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
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
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#fff"],
        },
        dropShadow: {
          enabled: true,
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
      tooltip: {
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "14px",
        },
      },
    } as ApexOptions,
  };

  // Card hover styles
  const cardHoverStyle = {
    transition: "all 0.3s",
    ":hover": {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-5px)",
    },
  };

  return (
    <div
      style={{
        padding: "24px",
        background: token.colorBgContainer,
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space size="middle">
          <DashboardOutlined
            style={{ fontSize: 28, color: token.colorPrimary }}
          />
          <Title level={2} style={{ margin: 0 }}>
            Bảng Điều Khiển
          </Title>
        </Space>
        <Tooltip title="Làm mới dữ liệu">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Tooltip>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              height: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              border: "none",
            }}
          >
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                  padding: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarCircleOutlined
                  style={{ fontSize: "32px", color: "#1890ff" }}
                />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Doanh thu tháng
                </Text>
                <Statistic
                  value={dashboardData?.statistics.monthlyRevenue || 0}
                  suffix="₫"
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              height: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              border: "none",
            }}
          >
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(82, 196, 26, 0.1)",
                  padding: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: "32px", color: "#52c41a" }}
                />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Đơn hàng gần đây
                </Text>
                <Statistic
                  value={dashboardData?.recentOrders.length || 0}
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
                <div style={{ marginTop: 5 }}>
                  <Badge
                    status="processing"
                    color="#52c41a"
                    text={
                      <Text style={{ fontSize: "12px" }}>
                        Cập nhật liên tục
                      </Text>
                    }
                  />
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              height: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              border: "none",
            }}
          >
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(114, 46, 209, 0.1)",
                  padding: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ fontSize: "32px", color: "#722ed1" }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Tổng khách hàng
                </Text>
                <Statistic
                  value={dashboardData?.statistics.totalCustomers || 0}
                  valueStyle={{ color: "#722ed1", fontWeight: "bold" }}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              height: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              border: "none",
            }}
          >
            <Space direction="horizontal" size="large" align="center">
              <div
                style={{
                  backgroundColor: "rgba(250, 140, 22, 0.1)",
                  padding: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProductOutlined
                  style={{ fontSize: "32px", color: "#fa8c16" }}
                />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Tổng sản phẩm
                </Text>
                <Statistic
                  value={dashboardData?.statistics.totalProducts || 0}
                  valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                />
                <div style={{ marginTop: 5 }}>
                  <Badge
                    status="success"
                    text={<Text style={{ fontSize: "12px" }}>Đã cập nhật</Text>}
                  />
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <RevenueAnalytics showTopProducts={false} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <ReactApexChart
              options={phoneModelsData.options}
              series={phoneModelsData.series}
              type="pie"
              height={350}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined
                  style={{ color: token.colorPrimary, fontSize: 20 }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  Đơn hàng gần đây
                </Title>
              </Space>
            }
            extra={
              <Tooltip title="Xem tất cả đơn hàng">
                <Button type="link" icon={<RightOutlined />}>
                  Xem tất cả
                </Button>
              </Tooltip>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <Table
              columns={orderColumns}
              dataSource={formattedOrders}
              pagination={{
                pageSize: 5,
                showTotal: (total) => `Tổng ${total} đơn hàng`,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
              }}
              size="middle"
              style={{ marginTop: 16 }}
              rowClassName={() => "table-row-hover"}
              className="custom-table"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: "#faad14", fontSize: 20 }} />
                <Title level={4} style={{ margin: 0 }}>
                  Sản phẩm sắp hết hàng
                </Title>
              </Space>
            }
            extra={
              <Tooltip title="Quản lý kho">
                <Button type="link" icon={<RightOutlined />}>
                  Quản lý kho
                </Button>
              </Tooltip>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <List
              dataSource={dashboardData?.lowStockProducts}
              renderItem={(item) => (
                <List.Item className="list-item-hover">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="large"
                        style={{
                          backgroundColor: "#f5222d",
                          boxShadow: "0 2px 8px rgba(245, 34, 45, 0.2)",
                        }}
                        icon={<PhoneOutlined />}
                      />
                    }
                    title={
                      <span style={{ fontWeight: 500 }}>
                        {item.product.product_name}
                      </span>
                    }
                    description={
                      <Space>
                        <Tag color="error">Còn {item.stock} sản phẩm</Tag>
                        {item.stock <= 5 && (
                          <Badge
                            status="error"
                            text={
                              <Text type="danger" style={{ fontSize: "12px" }}>
                                Cần nhập thêm hàng
                              </Text>
                            }
                          />
                        )}
                      </Space>
                    }
                  />
                  <Button type="text" size="small">
                    Chi tiết
                  </Button>
                </List.Item>
              )}
              pagination={{
                pageSize: 5,
                size: "small",
                total: dashboardData?.lowStockProducts.length,
                showTotal: (total) => `${total} sản phẩm`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .table-row-hover:hover {
          background-color: ${token.colorBgTextHover} !important;
          transition: background-color 0.3s;
        }
        
        .list-item-hover:hover {
          background-color: ${token.colorBgTextHover};
          transition: background-color 0.3s;
        }
        
        .custom-table .ant-table-thead > tr > th {
          background-color: ${token.colorBgContainer};
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default DashBoard;
