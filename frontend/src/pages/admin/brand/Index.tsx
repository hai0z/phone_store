import {
  Table,
  Space,
  Button,
  Image,
  Popconfirm,
  message,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Statistic,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  TagOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { theme } from "antd";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

interface Brand {
  brand_id: number;
  brand_name: string;
  image_url?: string;
}

const BrandList = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = useToken();
  const [searchText, setSearchText] = useState<string>("");

  const {
    data: brands,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/brands");
      return response.data;
    },
  });

  const handleDelete = async (brandId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/brands/${brandId}`);
      refetch();
      messageApi.success("Xóa thương hiệu thành công");
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Lỗi khi xóa thương hiệu"
      );
    }
  };

  const handleTableChange: TableProps<Brand>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Table params:", { pagination, filters, sorter });
  };

  const filteredBrands = searchText
    ? brands?.filter((brand: Brand) =>
        brand.brand_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : brands;

  const columns: ColumnsType<Brand> = [
    {
      title: "ID",
      dataIndex: "brand_id",
      key: "brand_id",
      sorter: (a, b) => a.brand_id - b.brand_id,
      render: (id) => (
        <Badge
          count={id}
          style={{
            backgroundColor: token.colorPrimary,
            fontSize: "12px",
            fontWeight: "bold",
          }}
          overflowCount={999}
        />
      ),
      width: 80,
      align: "center",
    },
    {
      title: "Logo thương hiệu",
      key: "image",
      render: (_, record) => (
        <Avatar
          shape="square"
          size={64}
          src={record.image_url}
          icon={<FileImageOutlined />}
          style={{
            objectFit: "contain",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#f0f0f0",
          }}
        />
      ),
      width: 120,
      align: "center",
    },
    {
      title: (
        <Space>
          <TagOutlined />
          <span>Tên thương hiệu</span>
        </Space>
      ),
      dataIndex: "brand_name",
      key: "brand_name",
      sorter: (a, b) => a.brand_name.localeCompare(b.brand_name),
      render: (text) => (
        <Text strong style={{ fontSize: "16px" }}>
          {text}
        </Text>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm thương hiệu"
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
        record.brand_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: (
        <Space>
          <InfoCircleOutlined />
          <span>Hành động</span>
        </Space>
      ),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa thương hiệu">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/brands/edit/${record.brand_id}`)}
              style={{ borderRadius: "4px" }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa thương hiệu"
            description="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(record.brand_id)}
            okText="Đồng ý"
            cancelText="Hủy"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            placement="left"
          >
            <Tooltip title="Xóa thương hiệu">
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: "4px" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 120,
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            style={{
              borderRadius: "8px",
            }}
          >
            <Row
              align="middle"
              justify="space-between"
              style={{ marginBottom: "24px" }}
            >
              <Col>
                <Space direction="vertical" size={0}>
                  <Space align="center">
                    <Avatar
                      icon={<TagOutlined />}
                      style={{
                        backgroundColor: token.colorPrimary,
                        marginRight: "8px",
                      }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      Quản lý thương hiệu
                    </Title>
                  </Space>
                  <Paragraph
                    style={{
                      color: token.colorTextSecondary,
                      marginLeft: "40px",
                    }}
                  >
                    Quản lý danh sách các thương hiệu điện thoại
                  </Paragraph>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Input
                    placeholder="Tìm kiếm thương hiệu"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250, borderRadius: "6px" }}
                    allowClear
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/brands/add")}
                    style={{
                      borderRadius: "6px",
                      boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
                    }}
                  >
                    Thêm thương hiệu mới
                  </Button>
                </Space>
              </Col>
            </Row>

            <Divider style={{ margin: "0 0 24px 0" }} />

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={filteredBrands}
                rowKey="brand_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} thương hiệu`,
                  showQuickJumper: true,
                  style: { marginTop: "16px" },
                }}
                onChange={handleTableChange}
                bordered={false}
                size="middle"
                rowClassName={() => "table-row-hover"}
                style={{ overflowX: "auto" }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BrandList;
