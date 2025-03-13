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
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  FolderOutlined,
  FolderAddOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface Category {
  category_id: number;
  category_name: string;
  image_url?: string;
}

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      return response.data;
    },
  });

  const handleDelete = async (categoryId: number) => {
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
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "category_id",
      key: "category_id",
      render: (text: any) => (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
      render: (text: any) => (
        <Space>
          <FolderOutlined style={{ color: "#52c41a" }} />
          {text}
        </Space>
      ),
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa danh mục">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/admin/categories/edit/${record.category_id}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.category_id)}
            okText="Có"
            cancelText="Không"
            icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
          >
            <Tooltip title="Xóa danh mục">
              <Button type="default" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Space
          style={{
            marginBottom: 16,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <FolderOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              Danh mục
            </Title>
          </Space>
          <Tooltip title="Thêm danh mục mới">
            <Link to="/admin/categories/add">
              <Button type="primary" icon={<FolderAddOutlined />}>
                Thêm danh mục
              </Button>
            </Link>
          </Tooltip>
        </Space>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="category_id"
          loading={!categories}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} danh mục`,
          }}
        />
      </Card>
    </div>
  );
};

export default CategoryList;
