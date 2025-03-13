import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product, ProductVariant, RAM, Storage } from "../../../../types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Row,
  Col,
  DatePicker,
  message,
  Divider,
  Table,
  Tag,
  Tooltip,
  Flex,
  Spin,
} from "antd";
import AddProductStep from "../../../../components/product/AddProductStep";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  ShoppingOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const AddProductVariants = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRams, setSelectedRams] = useState<number[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<number[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const navigate = useNavigate();

  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      return response.data;
    },
  });

  const colors = [
    ...new Map(
      product?.images?.map((img) => [img?.color?.color_id, img.color])
    ).values(),
  ];

  const { data: rams = [] } = useQuery<RAM[]>({
    queryKey: ["rams"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/rams");
      return response.data;
    },
  });

  const { data: storages = [] } = useQuery<Storage[]>({
    queryKey: ["storages"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/storages");
      return response.data;
    },
  });

  const generateVariants = () => {
    if (selectedRams.length === 0 || selectedStorages.length === 0) {
      message.error("Vui lòng chọn cả RAM và Bộ nhớ trong");
      return;
    }

    const newVariants: ProductVariant[] = [];

    colors.forEach((color) => {
      selectedRams.forEach((ramId) => {
        selectedStorages.forEach((storageId) => {
          const ram = rams.find((r) => r.ram_id === ramId);
          const storage = storages.find((s) => s.storage_id === storageId);

          newVariants.push({
            variant_id: Date.now() + Math.random(),
            product_id: Number(id),
            color_id: color!.color_id,
            storage_id: storageId,
            ram_id: ramId,
            original_price: 0,
            sale_price: 0,
            promotional_price: 0,
            promotion_start: undefined,
            promotion_end: undefined,
            stock: 0,
            color,
            storage,
            ram,
          });
        });
      });
    });

    setVariants(newVariants);
  };

  const handleSaveVariants = async () => {
    try {
      const invalidVariants = variants.filter(
        (v) =>
          v.original_price <= 0 ||
          v.sale_price <= 0 ||
          v.stock <= 0 ||
          (v.promotional_price && v.promotional_price > v.sale_price) ||
          (v.promotional_price && (!v.promotion_start || !v.promotion_end)) ||
          (v.promotion_start &&
            v.promotion_end &&
            dayjs(v.promotion_start).isAfter(v.promotion_end))
      );

      if (invalidVariants.length > 0) {
        messageApi.error({
          content:
            "Vui lòng kiểm tra lại:" +
            "\n- Giá và số lượng tồn kho phải lớn hơn 0" +
            "\n- Giá khuyến mãi phải nhỏ hơn giá bán" +
            "\n- Nếu có khuyến mãi phải có thời gian bắt đầu và kết thúc hợp lệ",
          duration: 5,
        });
        return;
      }

      const variantsToSave = variants.map((v) => {
        return {
          variant_id: Math.floor(Math.random() * 99_9999_999),
          product_id: v.product_id,
          color_id: v.color_id,
          storage_id: v.storage_id,
          ram_id: v.ram_id,
          original_price: v.original_price,
          sale_price: v.sale_price,
          promotional_price: v.promotional_price,
          promotion_start: v.promotion_start,
          promotion_end: v.promotion_end,
          stock: v.stock,
        };
      });
      await axios.post(
        `http://localhost:8080/api/v1/products/variants`,
        variantsToSave
      );
      messageApi.success("Lưu biến thể thành công!", 1, () => {
        navigate(`/admin/products`);
      });
    } catch (error) {
      console.error("Lỗi khi lưu biến thể:", error);
      messageApi.error("Lưu biến thể thất bại");
    }
  };

  const handleVariantChange = (
    variantId: number,
    field: string,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.variant_id === variantId) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: any) => (
        <Form.Item>
          <Space>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                backgroundColor: color.hex,
                border: "1px solid #ddd",
              }}
            />
            <span>{color.color_name}</span>
          </Space>
        </Form.Item>
      ),
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
      render: (ram: any) => (
        <Form.Item>
          <Tag color="blue">{ram.capacity}</Tag>
        </Form.Item>
      ),
    },
    {
      title: "Bộ nhớ",
      dataIndex: "storage",
      key: "storage",
      render: (storage: any) => (
        <Form.Item>
          <Tag color="purple">{storage.storage_capacity}</Tag>
        </Form.Item>
      ),
    },
    {
      title: "Giá gốc",
      dataIndex: "original_price",
      key: "original_price",
      render: (price: number, record: ProductVariant) => (
        <Form.Item
          validateStatus={price <= 0 ? "error" : ""}
          help={price <= 0 ? "Giá phải lớn hơn 0" : ""}
        >
          <InputNumber
            disabled
            value={price}
            onChange={(value) =>
              handleVariantChange(record.variant_id, "original_price", value)
            }
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "sale_price",
      key: "sale_price",
      render: (price: number, record: ProductVariant) => (
        <Form.Item
          validateStatus={price <= 0 ? "error" : ""}
          help={price <= 0 ? "Giá phải lớn hơn 0" : ""}
        >
          <InputNumber
            disabled
            value={price}
            onChange={(value) =>
              handleVariantChange(record.variant_id, "sale_price", value)
            }
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "promotional_price",
      key: "promotional_price",
      render: (price: number, record: ProductVariant) => (
        <Form.Item
          validateStatus={price > record.sale_price ? "error" : ""}
          help={price > record.sale_price ? "Giá KM phải nhỏ hơn giá bán" : ""}
        >
          <InputNumber
            disabled
            value={price}
            onChange={(value) =>
              handleVariantChange(record.variant_id, "promotional_price", value)
            }
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Thời gian KM",
      key: "promotion_time",
      render: (_: any, record: ProductVariant) => (
        <Form.Item>
          <DatePicker.RangePicker
            disabled
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
        </Form.Item>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number, record: ProductVariant) => (
        <Form.Item
          validateStatus={stock <= 0 ? "error" : ""}
          help={stock <= 0 ? "Số lượng phải lớn hơn 0" : ""}
        >
          <InputNumber
            value={stock}
            onChange={(value) =>
              handleVariantChange(record.variant_id, "stock", value)
            }
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
  ];

  if (isLoadingProduct) return <Spin />;

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {contextHolder}
      <AddProductStep current={2} />

      <Card>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {product?.product_name}
        </Typography.Title>
        <Typography.Text type="secondary">
          Thêm biến thể sản phẩm
        </Typography.Text>

        <Divider />

        {product?.variants?.length && product?.variants?.length > 0 && (
          <>
            <Typography.Title level={5}>Biến thể hiện có</Typography.Title>
            <Table
              columns={columns}
              dataSource={product?.variants}
              rowKey="variant_id"
              pagination={false}
              scroll={{ x: "max-content" }}
              style={{ marginBottom: 24 }}
            />
            <Divider>Thêm biến thể mới</Divider>
          </>
        )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item>
              <Typography.Text strong>Màu sắc hiện có</Typography.Text>
              <Flex gap="4px 0">
                {colors.map((color) => (
                  <Tooltip title={color?.color_name} key={color?.color_id}>
                    <Tag
                      style={{
                        margin: 8,
                        borderColor: "#ccc",
                        width: 32,
                        height: 24,
                      }}
                      color={color?.hex}
                    ></Tag>
                  </Tooltip>
                ))}
              </Flex>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="RAM"
              required
              tooltip="Chọn ít nhất một tùy chọn RAM"
            >
              <Select
                mode="multiple"
                placeholder="Chọn RAM"
                value={selectedRams}
                onChange={setSelectedRams}
                style={{ width: "100%" }}
                optionLabelProp="label"
              >
                {rams.map((ram) => (
                  <Select.Option
                    key={ram.ram_id}
                    value={ram.ram_id}
                    label={ram.capacity}
                  >
                    <Space>
                      <ShoppingOutlined />
                      {ram.capacity}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Bộ nhớ trong"
              required
              tooltip="Chọn ít nhất một tùy chọn bộ nhớ trong"
            >
              <Select
                mode="multiple"
                placeholder="Chọn bộ nhớ trong"
                value={selectedStorages}
                onChange={setSelectedStorages}
                style={{ width: "100%" }}
                optionLabelProp="label"
              >
                {storages.map((storage) => (
                  <Select.Option
                    key={storage.storage_id}
                    value={storage.storage_id}
                    label={storage.storage_capacity}
                  >
                    <Space>
                      <ShoppingOutlined />
                      {storage.storage_capacity}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={generateVariants}
          >
            Tạo biến thể
          </Button>

          {variants.length > 0 && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveVariants}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Lưu biến thể
            </Button>
          )}

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/admin/products/`)}
          >
            Huỷ
          </Button>
        </Space>

        {variants.length > 0 && (
          <Table
            columns={columns}
            dataSource={variants}
            rowKey="variant_id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </div>
  );
};

export default AddProductVariants;
