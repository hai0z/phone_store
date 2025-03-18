import {
  Table,
  Space,
  Button,
  Typography,
  Card,
  message,
  Input,
  Avatar,
  Tag,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Title, Text } = Typography;

interface Customer {
  customer_id: number;
  full_name: string;
  email: string;
  phone: string;
  addresses?: Array<{
    address_id: number;
    address: string;
    is_default: boolean;
  }>;
}

const CustomerList = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/customers"
      );
      return response.data;
    },
  });

  const handleTableChange: TableProps<Customer>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Table params:", { pagination, filters, sorter });
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "ID",
      dataIndex: "customer_id",
      key: "customer_id",
      sorter: (a, b) => a.customer_id - b.customer_id,
      render: (id) => (
        <Tag color="blue" style={{ borderRadius: "12px", fontWeight: "bold" }}>
          #{id.toString().padStart(3, "0")}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      render: (text, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<UserOutlined />}
          />
          <div>
            <Text strong style={{ fontSize: "14px", display: "block" }}>
              {text}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined style={{ marginRight: "5px" }} />
              {record.email}
            </Text>
          </div>
        </Space>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm khách hàng"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.full_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: "#52c41a" }} />
          <Text>{phone}</Text>
        </Space>
      ),
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "addresses",
      render: (addresses) => {
        const defaultAddress =
          addresses?.find((addr: any) => addr.is_default)?.address ||
          addresses?.[0]?.address ||
          "Chưa có địa chỉ";
        return (
          <Space>
            <HomeOutlined style={{ color: "#faad14" }} />
            <Text ellipsis={{ tooltip: defaultAddress }}>{defaultAddress}</Text>
          </Space>
        );
      },
      width: 200,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/customers/${record.customer_id}`)}
            shape="round"
          >
            Chi tiết
          </Button>
        </Tooltip>
      ),
      width: 120,
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <UserOutlined style={{ marginRight: "12px", color: "#1890ff" }} />
            Quản lý khách hàng
          </Title>
          <Input
            placeholder="Tìm kiếm nhanh..."
            prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
            style={{ width: 250, borderRadius: "6px" }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="customer_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} khách hàng`,
            style: { marginTop: "16px" },
          }}
          onChange={handleTableChange}
          bordered={false}
          size="middle"
          rowClassName={() => "table-row-hover"}
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;
