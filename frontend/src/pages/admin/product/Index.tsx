import { useEffect, useState } from "react";
import { Table, Space, Button, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

interface ProductVariant {
  variant_id: number;
  original_price: number;
  promotional_price: number | null;
  stock: number;
  image_url: string | null;
  color: { color_name: string };
  storage: { storage_capacity: string };
}

interface Product {
  product_id: number;
  product_name: string;
  description: string | null;
  brand: { brand_name: string };
  category: { category_name: string };
  variants: ProductVariant[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProducts([]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <Image
          width={50}
          src={record.variants[0]?.image_url || "/placeholder.png"}
          alt={record.product_name}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Brand",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: ["category", "category_name"],
      key: "category",
    },
    {
      title: "Variants",
      key: "variants",
      render: (_, record) => (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {record.variants.map((variant) => (
            <li key={variant.variant_id}>
              {variant.color.color_name} - {variant.storage.storage_capacity}:
              {variant.promotional_price ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      marginRight: "8px",
                    }}
                  >
                    ${variant.original_price}
                  </span>
                  <span style={{ color: "red" }}>
                    ${variant.promotional_price}
                  </span>
                </>
              ) : (
                <span>${variant.original_price}</span>
              )}
              (Stock: {variant.stock})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Products</h1>
        <Button
          type="primary"
          onClick={() => navigation("/admin/products/add")}
        >
          Add New Product
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="product_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductList;
