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
  message,
  Row,
  Col,
  Input,
  Divider,
  Statistic,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product, ProductImage } from "../../../types";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PictureOutlined,
  AppstoreAddOutlined,
  DashboardOutlined,
  SearchOutlined,
  EyeOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

const ProductList = () => {
  const queryClient = useQueryClient();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/products");
      return response.json();
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      messageApi.success("Xóa sản phẩm thành công");
    },
  });

  const filteredData = data?.filter(
    (product: Product & { images: ProductImage[] }) =>
      product.product_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Product & { images: ProductImage[] }> = [
    {
      title: "Hình ảnh",
      key: "image",
      width: 100,
      render: (_, record) => (
        <Image
          width={80}
          height={80}
          style={{
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
          src={record?.images?.[0]?.image_url || ""}
          alt={record.product_name}
          fallback="https://placehold.co/80x80?text=No+Image"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => (
        <Text strong style={{ fontSize: "15px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
      render: (text) => (
        <Tag color="blue" style={{ fontSize: "14px", padding: "2px 10px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "category_name"],
      key: "category",
      render: (text) => (
        <Tag color="green" style={{ fontSize: "14px", padding: "2px 10px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/dtdd/${record.product_id}`}>
              <Button
                type="default"
                icon={<EyeOutlined />}
                size="middle"
                style={{
                  backgroundColor: "#faad14",
                  color: "white",
                  border: "none",
                }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/products/edit/${record.product_id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="middle"
                style={{ backgroundColor: "#1890ff", border: "none" }}
              />
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
                style={{
                  backgroundColor: "#13c2c2",
                  color: "white",
                  border: "none",
                }}
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
                style={{
                  backgroundColor: "#722ed1",
                  color: "white",
                  border: "none",
                }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
              onConfirm={() => deleteProduct(record.product_id)}
              okText="Xóa"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                size="middle"
                style={{ border: "none" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {messageContextHolder}

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ borderRadius: "12px", height: "100%" }}>
            <Statistic
              title="Tổng sản phẩm"
              value={data?.length || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: "12px", height: "100%" }}>
            <Statistic
              title="Danh mục"
              value={
                data
                  ? [
                      ...new Set(
                        data.map(
                          (item: Product) => item.category?.category_name
                        )
                      ),
                    ].length
                  : 0
              }
              prefix={<TagsOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: "12px", height: "100%" }}>
            <Statistic
              title="Thương hiệu"
              value={
                data
                  ? [
                      ...new Set(
                        data.map((item: Product) => item.brand?.brand_name)
                      ),
                    ].length
                  : 0
              }
              prefix={<TagsOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: "12px",
          marginTop: "16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
        title={
          <Space align="center" size="middle">
            <DashboardOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý sản phẩm
            </Title>
          </Space>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm sản phẩm"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate("/admin/products/add")}
              style={{ backgroundColor: "#52c41a", border: "none" }}
            >
              Thêm sản phẩm mới
            </Button>
          </Space>
        }
      >
        <Divider style={{ margin: "16px 0" }} />

        {data?.length === 0 ? (
          <Empty
            description="Không có sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: "40px 0" }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="product_id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
              position: ["bottomCenter"],
            }}
            size="middle"
            scroll={{ x: "max-content" }}
            rowClassName={() => "product-table-row"}
          />
        )}
      </Card>
    </div>
  );
};

export default ProductList;
