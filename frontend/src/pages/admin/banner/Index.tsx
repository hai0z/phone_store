import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Switch,
  Popconfirm,
  message,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const { Title } = Typography;

interface Banner {
  banner_id: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  images: BannerImage[];
}

interface BannerImage {
  image_id: number;
  banner_id: number;
  image_url: string;
  title: string;
  description: string | null;
  position: number;
  link_url: string | null;
  created_at: string;
}

const BannerList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch banners
  const { data: banners, isLoading } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/banners");
      return response.data;
    },
  });

  // Delete banner mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:8080/api/v1/banners/${id}`),
    onSuccess: () => {
      messageApi.success("Banner đã được xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi xóa banner");
    },
  });

  // Update banner status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      axios.put(`http://localhost:8080/api/v1/banners/${id}`, {
        is_active: status,
      }),
    onSuccess: () => {
      messageApi.success("Trạng thái banner đã được cập nhật");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (checked: boolean, id: number) => {
    updateStatusMutation.mutate({ id, status: checked });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "banner_id",
      key: "banner_id",
      width: 80,
    },
    {
      title: "Hình ảnh",
      key: "image",
      render: (record: Banner) => (
        <div style={{ display: "flex", gap: "4px" }}>
          {record.images && record.images.length > 0 ? (
            <img
              src={record.images[0].image_url}
              alt="Ảnh banner"
              style={{ width: "80px", height: "50px", objectFit: "cover" }}
            />
          ) : (
            <div>Không có ảnh</div>
          )}
          {record.images && record.images.length > 1 && (
            <Tag color="processing">+{record.images.length - 1}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng ảnh",
      key: "imageCount",
      render: (record: Banner) => <span>{record.images?.length || 0}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record: Banner) => (
        <Switch
          checked={record.is_active}
          onChange={(checked) => handleStatusChange(checked, record.banner_id)}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thời gian hiển thị",
      key: "display_time",
      render: (record: Banner) => {
        if (!record.start_date && !record.end_date) return "Không giới hạn";

        const start = record.start_date
          ? new Date(record.start_date).toLocaleDateString("vi-VN")
          : "Không giới hạn";

        const end = record.end_date
          ? new Date(record.end_date).toLocaleDateString("vi-VN")
          : "Không giới hạn";

        return `${start} - ${end}`;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: Banner) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/banners/edit/${record.banner_id}`)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa banner này?"
            onConfirm={() => handleDelete(record.banner_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Title level={3}>Quản lý Banner</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/banners/add")}
          >
            Thêm Banner mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={banners}
          rowKey="banner_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default BannerList;
