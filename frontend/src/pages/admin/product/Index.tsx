import {
  Table,
  Space,
  Button,
  Image,
  Typography,
  Card,
  Tag,
  Tooltip,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductImage } from "../../../types";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PictureOutlined,
  AppstoreAddOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/products");
      return response.json();
    },
  });

  const navigation = useNavigate();

  const columns: ColumnsType<Product & { images: ProductImage[] }> = [
    {
      title: "Hình ảnh",
      key: "image",
      render: (_, record) => (
        <Image
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          src={record?.images?.[0]?.image_url || ""}
          alt={record.product_name}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "category_name"],
      key: "category",
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/products/edit/${record.product_id}`}>
              <Button type="primary" icon={<EditOutlined />} size="middle" />
            </Link>
          </Tooltip>
          <Tooltip title="Thêm ảnh và màu sắc">
            <Link
              to={`/admin/products/add/product-color-image/${record.product_id}`}
            >
              <Button
                type="default"
                icon={<PictureOutlined />}
                size="middle"
                style={{ backgroundColor: "#13c2c2", color: "white" }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Thêm biến thể">
            <Link
              to={`/admin/products/add/product-variants/${record.product_id}`}
            >
              <Button
                type="default"
                icon={<AppstoreAddOutlined />}
                size="middle"
                style={{ backgroundColor: "#722ed1", color: "white" }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
              onConfirm={() => {}}
            >
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                size="middle"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ borderRadius: "8px", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Space align="center">
            <DashboardOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý sản phẩm
            </Title>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigation("/admin/products/add")}
          >
            Thêm sản phẩm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="product_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
          }}
          bordered
          size="middle"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default ProductList;
