import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Card,
  Typography,
  Tooltip,
  Input,
  Avatar,
  Tag,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
  Badge,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  FolderOutlined,
  FolderAddOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

interface Category {
  category_id: number;
  category_name: string;
  image_url?: string;
}

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    data: categories,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      return response.data;
    },
  });

  const handleDelete = async (categoryId: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/categories/${categoryId}`
      );
      messageApi.success({
        content: "Xóa danh mục thành công",
        icon: <InfoCircleOutlined style={{ color: "#52c41a" }} />,
      });
      refetch();
    } catch (error: any) {
      messageApi.error({
        content: error.response?.data?.message || "Lỗi khi xóa danh mục",
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredCategories = categories?.filter((category) =>
    category.category_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
      render: (text: any) => (
        <Text strong style={{ fontSize: 16 }}>
          <FolderOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          {text}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      align: "center" as const,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa danh mục">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/admin/categories/edit/${record.category_id}`)
              }
              shape="circle"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.category_id)}
            okText="Có"
            cancelText="Không"
            placement="left"
            icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
          >
            <Tooltip title="Xóa danh mục">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                shape="circle"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card bordered={false} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: 24 }}>
          <Row gutter={24} align="middle" justify="space-between">
            <Col>
              <Space>
                <Badge count={filteredCategories?.length || 0}>
                  <FolderOutlined
                    style={{ fontSize: "28px", color: "#1890ff" }}
                  />
                </Badge>
                <Title level={2} style={{ margin: 0 }}>
                  Quản lý danh mục
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetch()}
                    loading={isLoading}
                  />
                </Tooltip>
                <Search
                  placeholder="Tìm kiếm danh mục..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 250 }}
                />
                <Tooltip title="Thêm danh mục mới">
                  <Link to="/admin/categories/add">
                    <Button type="primary" icon={<FolderAddOutlined />}>
                      Thêm danh mục
                    </Button>
                  </Link>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: "0 0 16px 0" }} />

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card bordered={false} style={{ background: "#e6f7ff" }}>
              <Statistic
                title="Tổng số danh mục"
                value={categories?.length || 0}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="category_id"
          loading={isLoading || loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} danh mục`,
            showQuickJumper: true,
          }}
          bordered
          size="middle"
          locale={{
            emptyText: <Empty description="Không có danh mục nào" />,
          }}
          rowClassName={() => "category-table-row"}
        />
      </Card>
    </div>
  );
};

export default CategoryList;
