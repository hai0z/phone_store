import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Table,
  Progress,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  StarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const { Title } = Typography;

const DashBoard: React.FC = () => {
  // Sample data for recent orders
  const recentOrders = [
    {
      key: "1",
      orderId: "#ORD001",
      customer: "John Doe",
      product: "iPhone 14 Pro Max",
      amount: 1299,
      status: "Completed",
      date: "2024-03-15",
    },
    {
      key: "2",
      orderId: "#ORD002",
      customer: "Jane Smith",
      product: "Samsung Galaxy S23",
      amount: 999,
      status: "Processing",
      date: "2024-03-14",
    },
    {
      key: "3",
      orderId: "#ORD003",
      customer: "Mike Johnson",
      product: "Xiaomi 13 Pro",
      amount: 899,
      status: "Pending",
      date: "2024-03-14",
    },
  ];

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // Sample data for charts
  const salesData = {
    series: [
      {
        name: "Doanh số",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "Doanh số bán hàng theo tháng",
        align: "left",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
        ],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
    } as ApexOptions,
  };

  const phoneModelsData = {
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: ["iPhone", "Samsung", "Xiaomi", "Oppo", "Khác"],
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
      <Title level={2}>Tổng quan</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <DollarCircleOutlined
                style={{ fontSize: "24px", color: "#1890ff" }}
              />
              <Statistic title="Tổng doanh thu" value={112893} prefix="$" />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <ShoppingCartOutlined
                style={{ fontSize: "24px", color: "#52c41a" }}
              />
              <Statistic title="Tổng đơn hàng" value={1528} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <UserOutlined style={{ fontSize: "24px", color: "#722ed1" }} />
              <Statistic title="Tổng khách hàng" value={892} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <PhoneOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />
              <Statistic title="Số mẫu điện thoại" value={156} />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <StarOutlined style={{ fontSize: "24px", color: "#eb2f96" }} />
              <Statistic
                title="Đánh giá trung bình"
                value={4.8}
                suffix="/5"
                precision={1}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <RiseOutlined style={{ fontSize: "24px", color: "#13c2c2" }} />
              <Statistic title="Giá trị đơn hàng TB" value={299} prefix="$" />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal">
              <ClockCircleOutlined
                style={{ fontSize: "24px", color: "#faad14" }}
              />
              <div>
                <div style={{ marginBottom: 6 }}>Tỷ lệ giao hàng đúng hẹn</div>
                <Progress percent={95} size="small" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card>
            <ReactApexChart
              options={salesData.options}
              series={salesData.series}
              type="area"
              height={350}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
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
          <Card title="Đơn hàng gần đây">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
