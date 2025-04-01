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
  theme,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
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

  const { token } = theme.useToken();
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
    <div
      style={{
        background: token.colorBgLayout,
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      {contextHolder}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <Row align="middle" style={{ marginBottom: 32 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dtdd")}
            style={{
              marginRight: 16,
              fontSize: 16,
              color: token.colorPrimary,
              padding: 0,
            }}
          >
            Tiếp tục mua hàng
          </Button>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            <ShoppingCartOutlined style={{ marginRight: 16 }} />
            Giỏ hàng của bạn
            <Text style={{ fontSize: 18, fontWeight: 400, marginLeft: 12 }}>
              ({items.length} sản phẩm)
            </Text>
          </Title>
        </Row>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card
              className="cart-items-card"
              style={{
                borderRadius: 16,
                boxShadow: token.boxShadowTertiary,
                border: "none",
              }}
            >
              {isLoading ? (
                <div style={{ padding: "20px" }}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton
                      key={item}
                      active
                      avatar
                      paragraph={{ rows: 3 }}
                      style={{ marginBottom: 24 }}
                    />
                  ))}
                </div>
              ) : cartItems.length > 0 ? (
                <>
                  <Row
                    style={{
                      marginBottom: 24,
                      padding: "16px 24px",
                      background: token.colorPrimaryBg,
                      borderRadius: 12,
                    }}
                    align="middle"
                  >
                    <Checkbox
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{ marginRight: 12 }}
                    />
                    <Text strong style={{ fontSize: 16 }}>
                      Chọn tất cả (
                      {cartItems.filter((item) => item.stock > 0).length} sản
                      phẩm)
                    </Text>
                  </Row>
                  <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                      <Badge.Ribbon
                        placement="start"
                        text={item.stock === 0 ? "Hết hàng" : ""}
                        color={
                          item.stock === 0 ? token.colorError : "transparent"
                        }
                        style={{
                          display: item.stock === 0 ? "block" : "none",
                          padding: "0 15px",
                        }}
                      >
                        <List.Item
                          className="cart-item"
                          style={{
                            padding: "24px",
                            margin: "0 0 16px",
                            background: item.selected
                              ? token.colorPrimaryBg
                              : token.colorBgContainer,
                            borderRadius: 12,
                            transition: "all 0.3s ease",
                            opacity: item.stock > 0 ? 1 : 0.6,
                            border: item.selected
                              ? `1px solid ${token.colorPrimary}`
                              : `1px solid ${token.colorBorderSecondary}`,
                          }}
                        >
                          <Row
                            gutter={[24, 16]}
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
                                style={{ transform: "scale(1.2)" }}
                              />
                            </Col>
                            <Col xs={24} sm={8} md={6} lg={5}>
                              <Image
                                src={item.image}
                                alt={item.product_name}
                                width={120}
                                height={120}
                                preview={false}
                                style={{
                                  objectFit: "contain",
                                  background: token.colorBgContainer,
                                  borderRadius: 12,
                                  padding: 8,
                                  border: `1px solid ${token.colorBorderSecondary}`,
                                  boxShadow: token.boxShadowTertiary,
                                }}
                              />
                            </Col>
                            <Col xs={24} sm={16} md={18} lg={19}>
                              <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                  <Space
                                    direction="vertical"
                                    size={12}
                                    style={{ width: "100%" }}
                                  >
                                    <Text strong style={{ fontSize: 18 }}>
                                      {item.product_name}
                                    </Text>
                                    <Space size={8} wrap>
                                      <Tag
                                        color={token.colorPrimary}
                                        style={{
                                          borderRadius: 20,
                                          padding: "4px 12px",
                                        }}
                                      >
                                        {item.color}
                                      </Tag>
                                      <Tag
                                        color={token.colorInfo}
                                        style={{
                                          borderRadius: 20,
                                          padding: "4px 12px",
                                        }}
                                      >
                                        {item.storage}
                                      </Tag>
                                      <Tag
                                        color={token.colorSuccess}
                                        style={{
                                          borderRadius: 20,
                                          padding: "4px 12px",
                                        }}
                                      >
                                        {item.ram}
                                      </Tag>
                                    </Space>
                                    <Text type="secondary">
                                      {item.stock > 0
                                        ? `Còn ${item.stock} sản phẩm`
                                        : "Hết hàng"}
                                    </Text>
                                  </Space>
                                </Col>
                                <Col xs={12} md={6}>
                                  <Space
                                    direction="vertical"
                                    size={8}
                                    align="start"
                                  >
                                    <Text type="secondary">Đơn giá</Text>
                                    <Text
                                      type="danger"
                                      strong
                                      style={{ fontSize: 18 }}
                                    >
                                      {item.salePrice.toLocaleString() + " đ"}
                                    </Text>
                                  </Space>
                                </Col>
                                <Col xs={12} md={6}>
                                  <Space
                                    direction="vertical"
                                    size={8}
                                    align="end"
                                    style={{ width: "100%" }}
                                  >
                                    <Text type="secondary">Thành tiền</Text>
                                    <Text
                                      type="danger"
                                      strong
                                      style={{ fontSize: 18 }}
                                    >
                                      {(
                                        item.salePrice * item.quantity
                                      ).toLocaleString() + " đ"}
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
                                        style={{
                                          width: 60,
                                          borderRadius: 8,
                                        }}
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
                                          style={{ borderRadius: 8 }}
                                        />
                                      </Popconfirm>
                                    </Space>
                                  </Space>
                                </Col>
                              </Row>
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
                  description={
                    <Text style={{ fontSize: 16 }}>
                      Giỏ hàng của bạn đang trống
                    </Text>
                  }
                  style={{ padding: "60px 0" }}
                >
                  <Button
                    type="primary"
                    onClick={() => navigate("/dtdd")}
                    size="large"
                    style={{
                      borderRadius: 30,
                      height: 48,
                      padding: "0 32px",
                      fontSize: 16,
                      marginTop: 16,
                    }}
                  >
                    Mua sắm ngay
                  </Button>
                </Empty>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              className="cart-summary-card"
              style={{
                borderRadius: 16,
                boxShadow: token.boxShadowTertiary,
                border: "none",
                position: "sticky",
                top: 24,
              }}
            >
              <Title level={4} style={{ marginBottom: 24, fontWeight: 600 }}>
                Tổng tiền giỏ hàng
              </Title>
              <Divider style={{ margin: "16px 0" }} />
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Row justify="space-between">
                  <Text style={{ fontSize: 16 }}>Sản phẩm đã chọn:</Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {selectedItems.length}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text style={{ fontSize: 16 }}>Tạm tính:</Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {totalAmount.toLocaleString()} đ
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text style={{ fontSize: 16 }}>Giảm giá:</Text>
                  <Text
                    strong
                    style={{ fontSize: 16, color: token.colorSuccess }}
                  >
                    0 đ
                  </Text>
                </Row>
                <Divider style={{ margin: "16px 0" }} />
                <Row justify="space-between" align="middle">
                  <Text style={{ fontSize: 18 }}>Tổng tiền:</Text>
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
                    height: 54,
                    fontSize: 18,
                    borderRadius: 30,
                    marginTop: 24,
                    fontWeight: 600,
                    background:
                      selectedItems.length === 0
                        ? ""
                        : `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
                    border: "none",
                    boxShadow: `0 8px 16px ${token.colorPrimaryBg}`,
                  }}
                >
                  Đặt hàng ngay
                </Button>

                <div style={{ marginTop: 24 }}>
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    <Card
                      size="small"
                      style={{
                        borderRadius: 12,
                        background: token.colorSuccessBg,
                        border: `1px solid ${token.colorSuccessBorder}`,
                      }}
                    >
                      <Space>
                        <SafetyCertificateOutlined
                          style={{ color: token.colorSuccess, fontSize: 18 }}
                        />
                        <Text style={{ color: token.colorSuccess }}>
                          Bảo hành chính hãng 12 tháng
                        </Text>
                      </Space>
                    </Card>
                    <Card
                      size="small"
                      style={{
                        borderRadius: 12,
                        background: token.colorInfoBg,
                        border: `1px solid ${token.colorInfoBorder}`,
                      }}
                    >
                      <Space>
                        <GiftOutlined
                          style={{ color: token.colorInfo, fontSize: 18 }}
                        />
                        <Text style={{ color: token.colorInfo }}>
                          Miễn phí giao hàng cho đơn từ 2 triệu
                        </Text>
                      </Space>
                    </Card>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
