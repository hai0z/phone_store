import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  Card,
  Typography,
  Row,
  Col,
  message,
  Tag,
  Tooltip,
  Tabs,
  Alert,
  Statistic,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  StockOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../../../api/api";
import { ProductVariant, Product } from "../../../types";

// Extended interface for ProductVariant with product_name
interface ProductVariantWithName extends ProductVariant {
  product_name?: string;
}

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<ProductVariantWithName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [bulkModalVisible, setBulkModalVisible] = useState<boolean>(false);
  const [currentVariant, setCurrentVariant] =
    useState<ProductVariantWithName | null>(null);
  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>("all");

  // Fetch all product variants for inventory
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      const products = response.data;

      // Get all variants from all products
      let allVariants: ProductVariantWithName[] = [];
      for (const product of products) {
        const variantsResponse = await api.get(
          `/products/${product.product_id}/variants`
        );
        const variants = variantsResponse.data.map(
          (variant: ProductVariant) => ({
            ...variant,
            product_name: product.product_name,
          })
        );
        allVariants = [...allVariants, ...variants];
      }

      setInventory(allVariants);
      setProducts(products);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      message.error("Không thể tải dữ liệu kho hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle editing a variant's inventory
  const handleEdit = (variant: ProductVariantWithName) => {
    setCurrentVariant(variant);
    editForm.setFieldsValue({
      stock: variant.stock,
    });
    setEditModalVisible(true);
  };

  // Update product variant stock
  const handleUpdateStock = async () => {
    try {
      const values = await editForm.validateFields();

      if (!currentVariant) return;

      await api.put(`/products/variants/${currentVariant.variant_id}`, {
        stock: values.stock,
      });

      message.success("Cập nhật số lượng tồn kho thành công");
      setEditModalVisible(false);
      fetchInventory();
    } catch (error) {
      console.error("Error updating stock:", error);
      message.error("Không thể cập nhật số lượng tồn kho");
    }
  };

  // Handle bulk update
  const handleBulkUpdate = async () => {
    try {
      const values = await bulkForm.validateFields();
      const { action, amount } = values;

      if (selectedRowKeys.length === 0) {
        message.warning("Vui lòng chọn ít nhất một sản phẩm");
        return;
      }

      const updatePromises = selectedRowKeys.map(async (key) => {
        const variant = inventory.find((item) => item.variant_id === key);
        if (!variant) return;

        let newStock = variant.stock;
        if (action === "add") {
          newStock += amount;
        } else if (action === "subtract") {
          newStock = Math.max(0, newStock - amount);
        } else if (action === "set") {
          newStock = amount;
        }

        return api.put(`/products/variants/${key}`, {
          stock: newStock,
        });
      });

      await Promise.all(updatePromises);

      message.success("Cập nhật hàng loạt thành công");
      setBulkModalVisible(false);
      setSelectedRowKeys([]);
      fetchInventory();
    } catch (error) {
      console.error("Error updating stock in bulk:", error);
      message.error("Không thể cập nhật số lượng tồn kho hàng loạt");
    }
  };

  // Filter inventory based on search input and active tab
  const getFilteredInventory = () => {
    let filtered = inventory.filter((variant) => {
      const productNameMatch = variant.product_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      return productNameMatch;
    });

    if (activeTabKey === "lowStock") {
      filtered = filtered.filter(
        (variant) => variant.stock < 20 && variant.stock > 0
      );
    } else if (activeTabKey === "outOfStock") {
      filtered = filtered.filter((variant) => variant.stock <= 0);
    }

    return filtered;
  };

  const filteredInventory = getFilteredInventory();

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Statistics
  const getTotalProducts = () => inventory.length;
  const getLowStockCount = () =>
    inventory.filter((variant) => variant.stock < 5 && variant.stock > 0)
      .length;
  const getOutOfStockCount = () =>
    inventory.filter((variant) => variant.stock <= 0).length;

  // Table columns
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a: any, b: any) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: "Màu sắc",
      dataIndex: ["color", "color_name"],
      key: "color",
      render: (text: string, record: ProductVariantWithName) => (
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: record.color?.hex,
            borderRadius: "50%",
            border: "1px solid #ccc",
          }}
        ></div>
      ),
    },
    {
      title: "Bộ nhớ",
      dataIndex: ["storage", "storage_capacity"],
      key: "storage",
    },
    {
      title: "RAM",
      dataIndex: ["ram", "capacity"],
      key: "ram",
    },
    {
      title: "Giá",
      dataIndex: "sale_price",
      key: "price",
      render: (price: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
      sorter: (a: any, b: any) => a.sale_price - b.sale_price,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => {
        if (stock <= 0) {
          return <Tag color="red">Hết hàng</Tag>;
        } else if (stock < 5) {
          return (
            <Tooltip title="Sắp hết hàng">
              <Tag color="orange" icon={<WarningOutlined />}>
                {stock}
              </Tag>
            </Tooltip>
          );
        } else {
          return <Tag color="green">{stock}</Tag>;
        }
      },
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ProductVariantWithName) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>
              <StockOutlined /> Quản lý kho hàng
            </Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 300 }}
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchInventory}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng số biến thể sản phẩm"
                value={getTotalProducts()}
                prefix={<StockOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Sản phẩm sắp hết hàng"
                value={getLowStockCount()}
                valueStyle={{ color: "#faad14" }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Sản phẩm hết hàng"
                value={getOutOfStockCount()}
                valueStyle={{ color: "#f5222d" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Alert for low stock items */}
        {getLowStockCount() > 0 && (
          <Alert
            message="Cảnh báo tồn kho"
            description={`Có ${getLowStockCount()} sản phẩm sắp hết hàng và ${getOutOfStockCount()} sản phẩm đã hết hàng. Vui lòng kiểm tra tab "Sắp hết hàng" và "Hết hàng" để xem chi tiết.`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Bulk update button */}
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              onClick={() => setBulkModalVisible(true)}
              disabled={selectedRowKeys.length === 0}
            >
              Cập nhật hàng loạt ({selectedRowKeys.length} sản phẩm)
            </Button>
          </Col>
        </Row>

        {/* Tabs for different inventory views */}
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} type="card">
          <TabPane tab="Tất cả sản phẩm" key="all" />
          <TabPane
            tab={
              <span>
                <WarningOutlined />
                Sắp hết hàng ({getLowStockCount()})
              </span>
            }
            key="lowStock"
          />
          <TabPane
            tab={
              <span>
                <ExclamationCircleOutlined />
                Hết hàng ({getOutOfStockCount()})
              </span>
            }
            key="outOfStock"
          />
        </Tabs>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredInventory}
          rowKey="variant_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal for editing stock */}
      <Modal
        title="Cập nhật số lượng tồn kho"
        open={editModalVisible}
        onOk={handleUpdateStock}
        onCancel={() => setEditModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="stock"
            label="Số lượng tồn kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng tồn kho" },
              {
                type: "number",
                min: 0,
                message: "Số lượng tồn kho không được âm",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for bulk updating stock */}
      <Modal
        title="Cập nhật hàng loạt"
        open={bulkModalVisible}
        onOk={handleBulkUpdate}
        onCancel={() => setBulkModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Text>Đang cập nhật {selectedRowKeys.length} sản phẩm</Text>
        <Form form={bulkForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="action"
            label="Hành động"
            rules={[{ required: true, message: "Vui lòng chọn hành động" }]}
            initialValue="add"
          >
            <Select>
              <Option value="add">Thêm số lượng</Option>
              <Option value="subtract">Giảm số lượng</Option>
              <Option value="set">Đặt số lượng cố định</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              {
                type: "number",
                min: 0,
                message: "Số lượng không được âm",
              },
            ]}
            initialValue={1}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
