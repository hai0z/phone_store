import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Tooltip,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  Badge,
  Statistic,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ShoppingCartOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Order {
  order_id: number;
  customer: {
    full_name: string;
    email: string;
    phone: string;
  };
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
}

const OrderList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/orders");
      return response.data;
    },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return <ClockCircleOutlined />;
      case "da_xac_nhan":
        return <CheckCircleOutlined />;
      case "dang_giao_hang":
        return <InboxOutlined />;
      case "da_giao_hang":
        return <CheckCircleOutlined />;
      case "da_huy":
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (id) => <Text strong>#{id.toString().padStart(5, "0")}</Text>,
      width: 120,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <Space direction="vertical" size="small" style={{ marginLeft: 0 }}>
          <Text strong style={{ fontSize: "14px" }}>
            {customer.full_name}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {customer.phone}
          </Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "orderDetails",
      ellipsis: true,
      render: (orderDetails: any) => {
        return orderDetails
          .map((detail: any) => detail.variant.product.product_name)
          .join(", ");
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => (
        <Text strong type="danger" style={{ fontSize: "14px" }}>
          {amount.toLocaleString("vi-VN")}đ
        </Text>
      ),
      width: 130,
      align: "right",
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color="blue" style={{ borderRadius: "4px" }}>
          {method === "cod" ? "COD" : "VNPay"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStatusIcon(status)} {getStatusText(status)}
            </span>
          }
        />
      ),
      width: 150,
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => <Text>{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>,
      width: 150,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/orders/${record.order_id}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="middle"
                style={{ borderRadius: "4px" }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Link to={`/admin/orders/edit/${record.order_id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="middle"
                style={{ backgroundColor: "#52c41a", borderRadius: "4px" }}
              />
            </Link>
          </Tooltip>
        </Space>
      ),
      width: 100,
      align: "center",
    },
  ];

  const filteredOrders = orders
    ? orders.filter((order: Order) => {
        const matchesSearch =
          searchText === "" ||
          order.order_id.toString().includes(searchText) ||
          order.customer.full_name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.customer.phone.includes(searchText);

        const matchesStatus =
          statusFilter === null || order.status === statusFilter;

        const matchesDateRange =
          !dateRange ||
          !dateRange[0] ||
          !dateRange[1] ||
          (dayjs(order.created_at).isAfter(dateRange[0].startOf("day")) &&
            dayjs(order.created_at).isBefore(dateRange[1].endOf("day")));

        return matchesSearch && matchesStatus && matchesDateRange;
      })
    : [];

  // Calculate statistics
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(
    (order: Order) => order.status === "cho_xac_nhan"
  ).length;
  const shippingOrders = filteredOrders.filter(
    (order: Order) => order.status === "dang_giao_hang"
  ).length;
  const completedOrders = filteredOrders.filter(
    (order: Order) => order.status === "da_giao_hang"
  ).length;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {contextHolder}
      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <ShoppingCartOutlined style={{ marginRight: "8px" }} />
            Quản lý đơn hàng
          </Title>
          <Space>
            <Button icon={<FilterOutlined />}>Xuất Excel</Button>
          </Space>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col span={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Statistic
              title="Chờ xác nhận"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Statistic
              title="Đang giao hàng"
              value={shippingOrders}
              prefix={<InboxOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Statistic
              title="Đã giao hàng"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hoặc SĐT"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ borderRadius: "6px" }}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Lọc theo trạng thái đơn hàng"
              style={{ width: "100%", borderRadius: "6px" }}
              allowClear
              onChange={(value) =>
                setStatusFilter(value === "all" ? null : value)
              }
              value={statusFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="cho_xac_nhan">Chờ xác nhận</Option>
              <Option value="da_xac_nhan">Đã xác nhận</Option>
              <Option value="dang_giao_hang">Đang giao hàng</Option>
              <Option value="da_giao_hang">Đã giao hàng</Option>
              <Option value="da_huy">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: "100%", borderRadius: "6px" }}
              onChange={(dates) => setDateRange(dates)}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>
        </Row>

        <Divider style={{ margin: "8px 0 16px" }} />

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="order_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} đơn hàng`,
            position: ["bottomRight"],
            style: { marginTop: "16px" },
          }}
          size="middle"
          style={{ marginTop: "8px" }}
          rowClassName={() => "order-table-row"}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default OrderList;
