import React, { useState } from "react";
import {
  Card,
  Button,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Checkbox,
  Empty,
  Image,
  Tag,
  List,
  Skeleton,
  Badge,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;

interface CartItem {
  variant_id: number;
  quantity: number;
  product_id: number;
  product_name: string;
  image: string;
  ram: string;
  color: string;
  storage: string;
  salePrice: number;
  selected: boolean;
  stock: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { items, removeItem, updateQuantity, setOrder } = useCartStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const cartData = await axios.post(
        `http://localhost:8080/api/v1/cart/sync`,
        items
      );
      setCartItems(cartData.data);
      cartItems.forEach((element) => {
        updateQuantity(element.variant_id, element.quantity);
      });
    },
  });

  const handleQuantityChange = (id: number, value: number | null) => {
    if (!value) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.variant_id === id ? { ...item, quantity: value } : item
      )
    );
    updateQuantity(id, value);
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.variant_id !== id));
    removeItem(id);
    messageApi.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleSelectItem = (id: number, selected: boolean) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.variant_id === id ? { ...item, selected } : item
      )
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: item.stock > 0 ? selected : false,
      }))
    );
  };

  const isAllSelected =
    cartItems?.length > 0 &&
    cartItems.filter((item) => item.stock > 0).every((item) => item.selected);

  const selectedItems = cartItems.filter((item) => item.selected);

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );

  const handleOrder = () => {
    setOrder({
      items: selectedItems.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      total: totalAmount,
      shipping_address: "",
      payment_method: "",
      voucher_code: "",
    });
    navigate("/checkout");
  };
  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {contextHolder}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dtdd")}
          style={{ marginRight: 16 }}
        >
          Tiếp tục mua hàng
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          <ShoppingCartOutlined style={{ marginRight: 12 }} />
          Giỏ hàng ({items.length})
        </Title>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="cart-items-card">
            {isLoading ? (
              <div style={{ padding: "20px" }}>
                {[1, 2].map((item) => (
                  <Skeleton key={item} active avatar paragraph={{ rows: 2 }} />
                ))}
              </div>
            ) : cartItems.length > 0 ? (
              <>
                <Row
                  style={{
                    marginBottom: 16,
                    padding: "12px 24px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                  }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    <Text strong>
                      Chọn tất cả (
                      {cartItems.filter((item) => item.stock > 0).length} sản
                      phẩm)
                    </Text>
                  </Checkbox>
                </Row>
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <Badge.Ribbon
                      placement="start"
                      text={item.stock === 0 ? "Hết hàng" : ""}
                      color={item.stock === 0 ? "red" : "transparent"}
                    >
                      <List.Item
                        className="cart-item"
                        style={{
                          padding: "24px",
                          margin: "0 0 16px",
                          background: item.selected ? "#f0f7ff" : "#fff",
                          borderRadius: 12,
                          transition: "all 0.3s ease",
                          opacity: item.stock > 0 ? 1 : 0.6,
                        }}
                      >
                        <Row
                          gutter={[16, 16]}
                          align="middle"
                          style={{ width: "100%" }}
                        >
                          <Col flex="none">
                            <Checkbox
                              disabled={item.stock === 0}
                              checked={item.selected}
                              onChange={(e) =>
                                handleSelectItem(
                                  item.variant_id,
                                  e.target.checked
                                )
                              }
                            />
                          </Col>
                          <Col flex="auto">
                            <Space size={16} align="start">
                              <Image
                                src={item.image}
                                alt={item.product_name}
                                width={100}
                                height={100}
                                preview={false}
                                style={{
                                  objectFit: "contain",
                                  background: "#fff",
                                  borderRadius: 8,
                                  padding: 8,
                                  border: "1px solid #f0f0f0",
                                }}
                              />
                              <Space direction="vertical" size={8}>
                                <Text strong style={{ fontSize: 16 }}>
                                  {item.product_name}
                                </Text>
                                <Space size={8}>
                                  <Tag color="cyan">{item.color}</Tag>
                                  <Tag color="purple">{item.storage}</Tag>
                                  <Tag color="blue">{item.ram}</Tag>
                                </Space>
                                <Space size={24}>
                                  <Text
                                    type="danger"
                                    strong
                                    style={{ fontSize: 18 }}
                                  >
                                    {item.salePrice.toLocaleString() + " đ"}
                                  </Text>
                                  <Space>
                                    <InputNumber
                                      disabled={item.stock === 0}
                                      min={1}
                                      max={item.stock <= 5 ? item.stock : 5}
                                      value={item.quantity}
                                      onChange={(value) =>
                                        handleQuantityChange(
                                          item.variant_id,
                                          value
                                        )
                                      }
                                      style={{ width: 60 }}
                                    />
                                    <Popconfirm
                                      title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                      onConfirm={() =>
                                        handleRemoveItem(item.variant_id)
                                      }
                                      okText="Xóa"
                                      cancelText="Hủy"
                                    >
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                      />
                                    </Popconfirm>
                                  </Space>
                                </Space>
                              </Space>
                            </Space>
                          </Col>
                          <Col>
                            <Text type="danger" strong style={{ fontSize: 20 }}>
                              {(
                                item.salePrice * item.quantity
                              ).toLocaleString() + " đ"}
                            </Text>
                          </Col>
                        </Row>
                      </List.Item>
                    </Badge.Ribbon>
                  )}
                />
              </>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Giỏ hàng của bạn đang trống"
              >
                <Button type="primary" onClick={() => navigate("/dtdd")}>
                  Mua sắm ngay
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="cart-summary-card">
            <Title level={4}>Tổng tiền giỏ hàng</Title>
            <Divider />
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Row justify="space-between">
                <Text>Sản phẩm đã chọn:</Text>
                <Text strong>{selectedItems.length}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text strong>{totalAmount.toLocaleString()} đ</Text>
              </Row>
              <Row justify="space-between">
                <Text>Giảm giá:</Text>
                <Text strong>0 đ</Text>
              </Row>
              <Divider />
              <Row justify="space-between" align="middle">
                <Text>Tổng tiền:</Text>
                <Text style={{ fontSize: 24 }} type="danger" strong>
                  {totalAmount.toLocaleString() + " đ"}
                </Text>
              </Row>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                block
                onClick={handleOrder}
                disabled={selectedItems.length === 0}
                style={{
                  height: 50,
                  fontSize: 16,
                  borderRadius: 8,
                  marginTop: 16,
                }}
              >
                Đặt hàng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
