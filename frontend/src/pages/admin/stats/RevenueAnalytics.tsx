import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Typography,
  Statistic,
  Space,
  Spin,
  Table,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import {
  ShoppingOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Thêm interface cho TopSellingProduct
interface TopSellingProduct {
  product_id: number;
  product_name: string;
  quantity_sold: number;
  revenue: number;
  profit: number;
}

// Cập nhật interface RevenueData
interface RevenueData {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  averageProfit: number;
  totalProducts: number;
  topSellingProducts: TopSellingProduct[];
  revenueByDay: { date: string; revenue: number; profit: number }[];
  revenueByMonth: { month: string; revenue: number; profit: number }[];
  revenueByWeek: { week: string; revenue: number; profit: number }[];
}

interface RevenueAnalyticsProps {
  showTopProducts?: boolean;
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  showTopProducts = true,
}) => {
  const [period, setPeriod] = useState<string>("weekly");

  const { data, isLoading } = useQuery<RevenueData>({
    queryKey: ["revenueStatistics", period],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/statistics/${period}`
      );
      return response.data;
    },
  });

  const chartData = useMemo(() => {
    if (!data) return null;

    let categories = [];
    let revenueSeries = [];
    let profitSeries = [];

    if (period === "daily") {
      categories = data.revenueByDay.map((item) => item.date);
      revenueSeries = data.revenueByDay.map((item) => item.revenue);
      profitSeries = data.revenueByDay.map((item) => item.profit);
    } else if (period === "weekly") {
      categories = data.revenueByWeek.map((item) => item.week);
      revenueSeries = data.revenueByWeek.map((item) => item.revenue);
      profitSeries = data.revenueByWeek.map((item) => item.profit);
    } else {
      categories = data.revenueByMonth.map((item) => item.month);
      revenueSeries = data.revenueByMonth.map((item) => item.revenue);
      profitSeries = data.revenueByMonth.map((item) => item.profit);
    }

    return {
      categories,
      series: [
        {
          name: "Doanh thu",
          type: "column",
          data: revenueSeries,
        },
        {
          name: "Lợi nhuận",
          type: "line",
          data: profitSeries,
        },
      ],
    };
  }, [data, period]);

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [0, 3],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 5,
        },
      },
      xaxis: {
        categories: chartData?.categories || [],
        title: {
          text: "Thời gian",
        },
      },
      yaxis: [
        {
          title: {
            text: "Doanh thu (VNĐ)",
          },
          labels: {
            formatter: (value: number) => {
              return new Intl.NumberFormat("vi-VN", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value);
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Lợi nhuận (VNĐ)",
          },
          labels: {
            formatter: (value: number) => {
              return new Intl.NumberFormat("vi-VN", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value);
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: (value: number) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
      colors: ["#1890ff", "#52c41a"],
      fill: {
        type: ["solid", "gradient"],
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div style={{ padding: "24px" }}>
        <Card>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  // Thêm columns cho bảng top sản phẩm
  const topProductColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Số lượng bán",
      dataIndex: "quantity_sold",
      key: "quantity_sold",
      render: (value: number) => (
        <Text strong>{value.toLocaleString("vi-VN")}</Text>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => (
        <Text strong type="success">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value)}
        </Text>
      ),
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      render: (value: number) => (
        <Text strong type="warning">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value)}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 24 }}
              >
                <Col>
                  <Title level={4}>Phân tích doanh thu</Title>
                </Col>
                <Col>
                  <Select
                    value={period}
                    onChange={setPeriod}
                    style={{ width: 200 }}
                    options={[
                      { value: "daily", label: "Theo ngày" },
                      { value: "weekly", label: "Theo tuần" },
                      { value: "monthly", label: "Theo tháng" },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Tổng doanh thu"
                    value={data?.totalRevenue}
                    precision={0}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value as number)
                    }
                    prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Tổng lợi nhuận"
                    value={data?.totalProfit}
                    precision={0}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value as number)
                    }
                    prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Số đơn hàng"
                    value={data?.totalOrders}
                    prefix={
                      <ShoppingCartOutlined style={{ color: "#faad14" }} />
                    }
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Giá trị đơn hàng trung bình"
                    value={data?.averageOrderValue}
                    precision={0}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value as number)
                    }
                    prefix={<ShoppingOutlined style={{ color: "#722ed1" }} />}
                  />
                </Col>
              </Row>

              {chartData && (
                <div style={{ marginTop: 24 }}>
                  <ReactApexChart
                    options={chartOptions as any}
                    series={chartData.series}
                    type="bar"
                    height={350}
                  />
                </div>
              )}
            </Card>
          </Col>

          {showTopProducts && (
            <>
              <Col span={24}>
                <Card title={<Title level={5}>Top Sản phẩm bán chạy</Title>}>
                  <Table
                    columns={topProductColumns}
                    dataSource={data?.topSellingProducts}
                    pagination={false}
                    rowKey="product_id"
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <Statistic
                        title="Tổng số sản phẩm bán ra"
                        value={data?.totalProducts}
                        prefix={
                          <ShoppingOutlined style={{ color: "#1890ff" }} />
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Statistic
                        title="Lợi nhuận trung bình/đơn hàng"
                        value={data?.averageProfit}
                        precision={0}
                        formatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(value as number)
                        }
                        prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Statistic
                        title="Tỷ suất lợi nhuận"
                        value={(data?.totalProfit! / data?.totalRevenue!) * 100}
                        precision={2}
                        suffix="%"
                        prefix={<RiseOutlined style={{ color: "#faad14" }} />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Space>
    </div>
  );
};

export default RevenueAnalytics;
