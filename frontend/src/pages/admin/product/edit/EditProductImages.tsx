import React from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  message,
  Table,
  Image,
  Popconfirm,
  Spin,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ProductImage } from "../../../../types";
import AddProductStep from "../../../../components/product/AddProductStep";

const { Title } = Typography;

const EditProductImages: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      return response.data;
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: number) => {
      await axios.delete(
        `http://localhost:8080/api/v1/products/images/${imageId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      messageApi.success("Xóa ảnh thành công");
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi xóa ảnh");
    },
  });

  const columns = [
    {
      title: "Hình ảnh",
      key: "image",
      render: (_: any, record: ProductImage) => (
        <Image
          src={record.image_url}
          alt="product"
          width={100}
          style={{ objectFit: "contain" }}
        />
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: any) => (
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: color.hex,
              border: "1px solid #ddd",
            }}
          />
          <span>{color.color_name}</span>
        </Space>
      ),
    },

    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ProductImage) => (
        <Space size="middle">
          <Popconfirm
            title="Xóa ảnh"
            description="Bạn có chắc chắn muốn xóa ảnh này?"
            onConfirm={() => deleteImageMutation.mutate(record.image_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteImageMutation.isPending}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleNext = () => {
    navigate(`/admin/products/${id}/variants/edit`);
  };

  if (loadingProduct) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Quản lý hình ảnh
            </Title>
          </Space>

          <AddProductStep current={1} />

          <Card title="Danh sách hình ảnh">
            <Table
              columns={columns}
              dataSource={product?.images}
              rowKey="image_id"
            />
          </Card>
        </Space>
      </Card>
    </>
  );
};

export default EditProductImages;
