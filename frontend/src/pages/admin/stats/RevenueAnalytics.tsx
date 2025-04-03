import React, { useState } from "react";
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
  DatePicker,
  Button,
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
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
  const [periodType, setPeriodType] = useState<string>("week");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs());
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  // Create URL and parameters based on selected period type
  const getQueryParams = () => {
    switch (periodType) {
      case "day":
        return {
          url: "daily",
          params: { date: selectedDate.format("YYYY-MM-DD") },
        };
      case "week":
        return {
          url: "weekly",
          params: { date: selectedDate.format("YYYY-MM-DD") },
        };
      case "month":
        return {
          url: "monthly",
          params: {
            year: selectedMonth.year(),
            month: selectedMonth.month() + 1,
          },
        };
      case "year":
        return {
          url: "yearly",
          params: { year: selectedYear },
        };
      case "custom":
        return {
          url: "custom",
          params: {
            startDate: dateRange[0].format("YYYY-MM-DD"),
            endDate: dateRange[1].format("YYYY-MM-DD"),
          },
        };
      default:
        return {
          url: "weekly",
          params: {},
        };
    }
  };

  const { url, params } = getQueryParams();

  const { data, isLoading, refetch } = useQuery<RevenueData>({
    queryKey: ["revenueStatistics", periodType, params],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/statistics/${url}`,
        { params }
      );
      return response.data;
    },
  });

  const getChartData = () => {
    if (!data) return null;

    let categories: string[] = [];
    let revenueSeries: number[] = [];

    if (periodType === "day") {
      // For a single day, just show hourly revenue if available, or just a single bar
      categories = ["Doanh thu trong ngày"];
      revenueSeries = [data.totalRevenue];
    } else if (periodType === "week" || periodType === "custom") {
      // For week view, show daily revenue
      categories = data.revenueByDay.map((item) => item.date);
      revenueSeries = data.revenueByDay.map((item) => item.revenue);
    } else if (periodType === "month") {
      // For month view, show daily revenue within that month
      categories = data.revenueByDay.map((item) => {
        const date = new Date(item.date);
        return date.getDate().toString(); // Just show the day number (1-31)
      });
      revenueSeries = data.revenueByDay.map((item) => item.revenue);
    } else if (periodType === "year") {
      // For year view, show monthly revenue
      categories = data.revenueByMonth.map((item) => {
        const [year, month] = item.month.split("-");
        const monthNames = [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ];
        return monthNames[parseInt(month) - 1];
      });
      revenueSeries = data.revenueByMonth.map((item) => item.revenue);
    }

    return {
      categories,
      series: [
        {
          name: "Doanh thu",
          data: revenueSeries,
        },
      ],
    };
  };

  const chartData = getChartData();

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: chartData?.categories || [],
      title: {
        text: "Thời gian",
      },
    },
    yaxis: {
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
    fill: {
      opacity: 1,
      colors: ["#1890ff"],
    },
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
  };

  const renderTimeSelector = () => {
    switch (periodType) {
      case "day":
        return (
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            style={{ width: 200 }}
            format="DD/MM/YYYY"
          />
        );
      case "week":
        return (
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            style={{ width: 200 }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày trong tuần"
          />
        );
      case "month":
        return (
          <DatePicker
            value={selectedMonth}
            onChange={(date) => date && setSelectedMonth(date)}
            picker="month"
            style={{ width: 200 }}
            format="MM/YYYY"
          />
        );
      case "year":
        return (
          <DatePicker
            value={dayjs().year(selectedYear)}
            onChange={(date) => date && setSelectedYear(date.year())}
            picker="year"
            style={{ width: 200 }}
            format="YYYY"
          />
        );
      case "custom":
        return (
          <RangePicker
            value={[dateRange[0], dateRange[1]]}
            onChange={(dates) =>
              dates &&
              setDateRange([dates[0], dates[1]] as [dayjs.Dayjs, dayjs.Dayjs])
            }
            style={{ width: 350 }}
            format="DD/MM/YYYY"
          />
        );
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (periodType) {
      case "day":
        return `Doanh thu ngày ${selectedDate.format("DD/MM/YYYY")}`;
      case "week":
        return "Doanh thu theo ngày trong tuần";
      case "month":
        return `Doanh thu theo ngày trong tháng ${selectedMonth.format(
          "MM/YYYY"
        )}`;
      case "year":
        return `Doanh thu theo tháng trong năm ${selectedYear}`;
      case "custom":
        return `Doanh thu từ ${dateRange[0].format(
          "DD/MM/YYYY"
        )} đến ${dateRange[1].format("DD/MM/YYYY")}`;
      default:
        return "Phân tích doanh thu";
    }
  };

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
              <Space>
                <Select
                  value={periodType}
                  onChange={setPeriodType}
                  style={{ width: 150 }}
                  options={[
                    { value: "day", label: "Theo ngày" },
                    { value: "week", label: "Theo tuần" },
                    { value: "month", label: "Theo tháng" },
                    { value: "year", label: "Theo năm" },
                    { value: "custom", label: "Tùy chọn" },
                  ]}
                />
                {renderTimeSelector()}
                <Button type="primary" onClick={() => refetch()}>
                  Xem
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Tổng doanh thu"
                value={data?.totalRevenue || 0}
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
                value={data?.totalProfit || 0}
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
                value={data?.totalOrders || 0}
                prefix={<ShoppingCartOutlined style={{ color: "#faad14" }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Giá trị đơn hàng trung bình"
                value={data?.averageOrderValue || 0}
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
              <Title level={5}>{getChartTitle()}</Title>
              <ReactApexChart
                options={chartOptions as any}
                series={chartData.series}
                type="bar"
                height={350}
              />
            </div>
          )}
        </Card>

        {showTopProducts && (
          <>
            <Card title={<Title level={5}>Top Sản phẩm bán chạy</Title>}>
              <Table
                columns={topProductColumns}
                dataSource={data?.topSellingProducts}
                pagination={false}
                rowKey="product_id"
              />
            </Card>

            <Card>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Statistic
                    title="Tổng số sản phẩm bán ra"
                    value={data?.totalProducts || 0}
                    prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Statistic
                    title="Lợi nhuận trung bình/đơn hàng"
                    value={data?.averageProfit || 0}
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
                    value={
                      data ? (data.totalProfit / data.totalRevenue) * 100 : 0
                    }
                    precision={2}
                    suffix="%"
                    prefix={<RiseOutlined style={{ color: "#faad14" }} />}
                  />
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Space>
    </div>
  );
};

export default RevenueAnalytics;
