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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ShoppingCartOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

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

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (id) => <Text strong>#{id.toString().padStart(5, "0")}</Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <Space direction="vertical" size="small">
          <Text strong>{customer.full_name}</Text>
          <Text type="secondary">{customer.phone}</Text>
        </Space>
      ),
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "orderDetails",
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
        <Text strong type="danger">
          {amount.toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color="blue">
          {method === "cod" ? "Thanh toán khi nhận hàng" : "VNPay"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => <Text>{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/orders/${record.order_id}`}>
              <Button type="primary" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Link to={`/admin/orders/edit/${record.order_id}`}>
              <Button
                type="default"
                icon={<EditOutlined />}
                style={{ backgroundColor: "#52c41a", color: "white" }}
              />
            </Link>
          </Tooltip>
        </Space>
      ),
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

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card style={{ borderRadius: "8px" }}>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <ShoppingCartOutlined style={{ marginRight: "8px" }} />
            Quản lý đơn hàng
          </Title>
        </div>

        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={12}>
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc số điện thoại"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12}>
            <Select
              placeholder="Lọc theo trạng thái đơn hàng"
              style={{ width: "100%" }}
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
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="order_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} đơn hàng`,
          }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OrderList;
