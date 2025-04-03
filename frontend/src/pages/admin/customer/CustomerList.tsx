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
  Badge,
  Divider,
  theme,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

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
  const [searchText, setSearchText] = useState("");
  const { token } = theme.useToken();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/customers"
      );
      return response.data;
    },
  });

  const filteredCustomers = customers?.filter(
    (customer: Customer) =>
      customer.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phone.includes(searchText)
  );

  const handleTableChange: TableProps<Customer>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Table params:", { pagination, filters, sorter });
  };

  const getRandomColor = (id: number) => {
    const colors = [
      token.colorPrimary,
      token.colorSuccess,
      token.colorWarning,
      token.colorError,
      token.colorInfo,
      token.purple,
    ];
    return colors[id % colors.length];
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Khách hàng",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      render: (text, record) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: getRandomColor(record.customer_id),
              boxShadow: `0 3px 6px ${token.colorBgTextHover}`,
            }}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <Text strong style={{ fontSize: "15px", display: "block" }}>
              {text}
            </Text>
            <Text type="secondary" style={{ fontSize: "13px" }}>
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
            autoFocus
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
        <SearchOutlined
          style={{ color: filtered ? token.colorPrimary : undefined }}
        />
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
          <PhoneOutlined
            style={{ color: token.colorSuccess, fontSize: "16px" }}
          />
          <Text copyable>{phone}</Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: "Địa chỉ",
      dataIndex: "addresses",
      render: (addresses) => {
        const defaultAddress =
          addresses?.find((addr: any) => addr.is_default)?.address ||
          addresses?.[0]?.address ||
          "Chưa có địa chỉ";
        const isDefault = addresses?.some((addr: any) => addr.is_default);

        return (
          <Space>
            <HomeOutlined
              style={{ color: token.colorWarning, fontSize: "16px" }}
            />
            <Tooltip title={defaultAddress}>
              <Text
                ellipsis={{ tooltip: defaultAddress }}
                style={{ maxWidth: 180 }}
              >
                {defaultAddress}
                {isDefault && (
                  <Tag
                    color="success"
                    style={{ marginLeft: 5, fontSize: "10px" }}
                  >
                    Mặc định
                  </Tag>
                )}
              </Text>
            </Tooltip>
          </Space>
        );
      },
      width: 250,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/customers/${record.customer_id}`)}
              shape="round"
              style={{
                background: `linear-gradient(to right, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                boxShadow: `0 2px 6px ${token.colorPrimaryBg}`,
                transition: "all 0.3s",
              }}
            >
              Chi tiết
            </Button>
          </Tooltip>
        </Space>
      ),
      width: 130,
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: `0 8px 24px ${token.colorBgElevated}`,
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: token.colorBgLayout,
            padding: "16px 20px",
            borderRadius: "12px",
          }}
        >
          <div>
            <Title
              level={3}
              style={{ margin: 0, color: token.colorPrimaryActive }}
            >
              <UserSwitchOutlined style={{ marginRight: "12px" }} />
              Quản lý khách hàng
            </Title>
            <Text type="secondary">
              Quản lý thông tin và hoạt động của tất cả khách hàng
            </Text>
          </div>
          <Input
            placeholder="Tìm kiếm nhanh..."
            prefix={<SearchOutlined style={{ color: token.colorPrimary }} />}
            style={{
              width: 300,
              borderRadius: "8px",
              boxShadow: `0 2px 6px ${token.colorBorderSecondary}`,
            }}
            size="large"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>

        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: `0 2px 12px ${token.colorFillAlter}`,
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredCustomers || []}
            rowKey="customer_id"
            loading={isLoading}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} khách hàng`,
              style: { marginTop: "16px" },
            }}
            onChange={handleTableChange}
            bordered={false}
            size="middle"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Card>

      <style>{`
        .table-row-light {
          background-color: ${token.colorBgContainer};
        }
        .table-row-dark {
          background-color: ${token.colorFillAlter};
        }
        .table-row-light:hover td, .table-row-dark:hover td {
          background-color: ${token.colorPrimaryBg} !important;
          transition: background-color 0.3s;
        }
        .ant-table-thead > tr > th {
          background-color: ${token.colorBgContainer};
          font-weight: 600;
          border-bottom: 2px solid ${token.colorBorderSecondary};
        }
        .ant-pagination-item-active {
          border-color: ${token.colorPrimary};
          font-weight: 600;
        }
        .ant-pagination-item-active a {
          color: ${token.colorPrimary};
        }
        .ant-table {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CustomerList;
