import { useState } from "react";
import { useParams } from "react-router-dom";
import { Product, ProductVariant, RAM, Storage } from "../../../../types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  InputNumber,
  Button,
  Space,
  Typography,
  DatePicker,
  message,
  Table,
  Tag,
  Spin,
  Popconfirm,
} from "antd";
import AddProductStep from "../../../../components/product/AddProductStep";
import dayjs from "dayjs";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EditProductVariants = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      setVariants(response.data.variants);
      return response.data;
    },
  });

  const handleSaveAllVariants = async () => {
    for (const variant of variants) {
      await axios.put(
        `http://localhost:8080/api/v1/products/variants/${variant.variant_id}`,
        {
          original_price: variant.original_price,
          sale_price: variant.sale_price,
          promotional_price: variant.promotional_price,
          promotion_start: variant.promotion_start,
          promotion_end: variant.promotion_end,
          stock: variant.stock,
        }
      );
    }
    messageApi.success("Cập nhật biến thể thành công");
  };

  const handleDeleteVariant = async (variantId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/products/variants/${variantId}`
      );
      setVariants((prev) => prev.filter((v) => v.variant_id !== variantId));
      messageApi.success("Xóa biến thể thành công");
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi xóa biến thể");
    }
  };

  const handleVariantChange = (
    variantId: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.variant_id === variantId ? { ...v, [field]: value } : v
      )
    );
  };

  const columns = [
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
      title: "RAM",
      dataIndex: ["ram", "capacity"],
      key: "ram",
      render: (text: string) => <Tag color="green">{text}GB</Tag>,
    },
    {
      title: "Bộ nhớ trong",
      dataIndex: ["storage", "storage_capacity"],
      key: "storage",
      render: (text: string) => <Tag color="purple">{text}GB</Tag>,
    },
    {
      title: "Giá gốc",
      dataIndex: "original_price",
      key: "original_price",
      render: (value: number, record: ProductVariant) => (
        <InputNumber
          value={value}
          onChange={(val) =>
            handleVariantChange(record.variant_id, "original_price", val)
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "sale_price",
      key: "sale_price",
      render: (value: number, record: ProductVariant) => (
        <InputNumber
          value={value}
          onChange={(val) =>
            handleVariantChange(record.variant_id, "sale_price", val)
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "promotional_price",
      key: "promotional_price",
      render: (value: number, record: ProductVariant) => (
        <InputNumber
          value={value}
          onChange={(val) =>
            handleVariantChange(record.variant_id, "promotional_price", val)
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: "Thời gian khuyến mãi",
      key: "promotion_time",
      render: (_: any, record: ProductVariant) => (
        <DatePicker.RangePicker
          value={[
            record.promotion_start ? dayjs(record.promotion_start) : null,
            record.promotion_end ? dayjs(record.promotion_end) : null,
          ]}
          onChange={(dates) => {
            handleVariantChange(
              record.variant_id,
              "promotion_start",
              dates?.[0]?.toISOString()
            );
            handleVariantChange(
              record.variant_id,
              "promotion_end",
              dates?.[1]?.toISOString()
            );
          }}
        />
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (value: number, record: ProductVariant) => (
        <InputNumber
          value={value}
          onChange={(val) =>
            handleVariantChange(record.variant_id, "stock", val)
          }
          min={0}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ProductVariant) => (
        <Popconfirm
          title="Xóa biến thể"
          description="Bạn có chắc chắn muốn xóa biến thể này?"
          onConfirm={() => handleDeleteVariant(record.variant_id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

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
              Quản lý biến thể
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveAllVariants}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Space>

          <AddProductStep current={2} />

          <Card title="Danh sách biến thể">
            <Table
              loading={isLoading}
              columns={columns}
              dataSource={variants}
              rowKey="variant_id"
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Space>
      </Card>
    </>
  );
};

export default EditProductVariants;
