import React, { useState } from "react";
import {
  Card,
  Space,
  Typography,
  Tabs,
  message,
  Spin,
} from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditProduct from "./EditProduct";
import EditProductImages from "./EditProductImages";
import EditProductVariants from "./EditProductVariants";
import {
  TagOutlined,
  PictureOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      return response.data;
    },
  });

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <TagOutlined /> Thông tin cơ bản
        </span>
      ),
      children: <EditProduct />,
    },
    {
      key: "2",
      label: (
        <span>
          <PictureOutlined /> Hình ảnh & Màu sắc
        </span>
      ),
      children: <EditProductImages />,
    },
    {
      key: "3",
      label: (
        <span>
          <AppstoreOutlined /> Biến thể sản phẩm
        </span>
      ),
      children: <EditProductVariants />,
    },
  ];

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
          <Title level={2} style={{ margin: 0 }}>
            Chỉnh sửa sản phẩm: {product?.product_name}
          </Title>
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            style={{ marginTop: 24 }}
          />
        </Space>
      </Card>
    </>
  );
};

export default ProductEdit;