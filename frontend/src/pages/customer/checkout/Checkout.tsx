import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Radio,
  message,
  Modal,
  Tag,
  Steps,
  theme,
  Badge,
  Image,
  List,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  TagOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import { useCartStore } from "../../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useToken } = theme;

interface CheckoutFormData {
  address_id: number;
  paymentMethod: string;
  note?: string;
}

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

interface Address {
  address_id: number;
  address: string;
  is_default: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutFormData>();
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = useToken();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const { order, clearOrder, removeItem } = useCartStore();

  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const cartData = await axios.post(
        `http://localhost:8080/api/v1/cart/sync`,
        order?.items
      );
      setCartItems(cartData.data);
    },
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.customer_id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/customer/${user?.customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const defaultAddress = data.addresses?.find(
        (addr: Address) => addr.is_default
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.address_id);
        form.setFieldValue("address_id", defaultAddress.address_id);
      }

      return data;
    },
    enabled: !!user?.customer_id,
  });

  const [orderLoading, setOrderLoading] = useState(false);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (values: CheckoutFormData) => {
    const orderId = Math.floor(Math.random() * 1000000);

    const orderData = {
      order_id: orderId,
      customer_id: user?.customer_id,
      address: userData?.addresses.find(
        (addr: Address) => addr.address_id === values.address_id
      ).address,
      paymentMethod: values.paymentMethod,
      note: values.note,
      order_date: new Date(),
      total_amount: totalPrice,
      status: "cho_xac_nhan",
    };
    const orderDetails = cartItems.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.salePrice,
    }));

    try {
      setOrderLoading(true);
      await axios.post(
        `http://localhost:8080/api/v1/orders`,
        {
          orderData,
          orderDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (values.paymentMethod === "vn_pay") {
        const vnPayUrl = await axios.post(
          `http://localhost:8080/api/v1/orders/${orderId}/payment/vnpay`,
          {
            amount: totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        await wait(1500).then(() => {
          window.location.href = vnPayUrl.data.paymentUrl;
        });
      } else {
        await wait(1500).then(() => {
          messageApi.success("Đặt hàng thành công", 1.5);
          clearOrder();
          cartItems.forEach((item) => {
            removeItem(item.variant_id);
          });
        });
      }
      await wait(1500).then(() => {
        setOrderLoading(false);
      });
    } catch (error) {
      messageApi.error("Có lỗi xảy ra, vui lòng thử lại");
      await wait(1500).then(() => {
        setOrderLoading(false);
      });
    }
  };

  const handleApplyVoucher = () => {};

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setDiscount(0);
    messageApi.info("Đã xóa mã giảm giá");
  };

  const handleSelectAddress = (addressId: number) => {
    setSelectedAddress(addressId);
    form.setFieldValue("address_id", addressId);
  };

  const steps = [
    {
      title: "Thông tin",
      icon: <UserOutlined />,
    },
    {
      title: "Thanh toán",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Xác nhận",
      icon: <CheckCircleFilled />,
    },
  ];

  const nextStep = () => {
    refetch();
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0
  );

  if (isLoading || isUserLoading || isRefetching) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin />
        <div style={{ marginTop: "20px" }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto",
        backgroundColor: token.colorBgContainer,
      }}
    >
      {contextHolder}

      <Row align="middle" style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate("/cart")}
          style={{ marginRight: 16 }}
        />
        <Title level={2} style={{ margin: 0 }}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Thanh toán
        </Title>
      </Row>

      <Steps
        current={currentStep}
        items={steps.map((item) => ({
          title: item.title,
          icon: item.icon,
        }))}
        style={{ marginBottom: 32 }}
      />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: currentStep === 0 ? "block" : "none",
            }}
          >
            <Title level={4}>
              <UserOutlined style={{ marginRight: 8 }} />
              Thông tin giao hàng
            </Title>
            <Divider />

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                paymentMethod: "cod",
              }}
            >
              <Form.Item
                name="address_id"
                label="Địa chỉ giao hàng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn địa chỉ giao hàng",
                  },
                ]}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {userData?.addresses?.map((address: any) => (
                    <Card
                      key={address.id}
                      style={{
                        marginBottom: 16,
                        borderRadius: 8,
                        background:
                          selectedAddress === address.address_id
                            ? "#e6f7ff"
                            : "#f5f5f5",
                        border:
                          selectedAddress === address.address_id
                            ? `1px solid ${token.colorPrimary}`
                            : "1px solid #e8e8e8",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectAddress(address.address_id)}
                    >
                      <Row align="middle" gutter={16}>
                        <Col>
                          <EnvironmentOutlined
                            style={{
                              fontSize: 24,
                              color:
                                selectedAddress === address.address_id
                                  ? token.colorPrimary
                                  : token.colorTextSecondary,
                            }}
                          />
                        </Col>
                        <Col flex="auto">
                          <Row>
                            <Col span={24}>
                              <Typography.Text strong style={{ fontSize: 16 }}>
                                {userData.full_name}
                                {address.is_default && (
                                  <Tag color="blue" style={{ marginLeft: 8 }}>
                                    Địa chỉ mặc định
                                  </Tag>
                                )}
                              </Typography.Text>
                            </Col>
                            <Col span={24}>
                              <Typography.Text type="secondary">
                                <PhoneOutlined style={{ marginRight: 8 }} />
                                {userData.phone}
                              </Typography.Text>
                            </Col>
                            <Col span={24}>
                              <Typography.Text type="secondary">
                                <EnvironmentOutlined
                                  style={{ marginRight: 8 }}
                                />
                                {address.address}
                              </Typography.Text>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Form.Item>

              <Form.Item name="note" label="Ghi chú">
                <TextArea
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  rows={4}
                />
              </Form.Item>
            </Form>

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Button type="primary" size="large" onClick={nextStep}>
                Tiếp tục
              </Button>
            </div>
          </Card>
          {/* Payment Method */}
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: currentStep === 1 ? "block" : "none",
            }}
          >
            <Title level={4}>
              <CreditCardOutlined style={{ marginRight: 8 }} />
              Phương thức thanh toán
            </Title>
            <Divider />

            <Form form={form} layout="vertical">
              <Form.Item
                name="paymentMethod"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phương thức thanh toán",
                  },
                ]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Card style={{ marginBottom: 8 }}>
                      <Radio value="cod">
                        <Space>
                          <ShoppingOutlined
                            style={{ fontSize: 20, color: token.colorPrimary }}
                          />
                          <div>
                            <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                            <br />
                            <Text type="secondary">
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </Text>
                          </div>
                        </Space>
                      </Radio>
                    </Card>

                    <Card style={{ marginBottom: 8 }}>
                      <Radio value="vn_pay">
                        <Space>
                          <BankOutlined
                            style={{ fontSize: 20, color: token.colorPrimary }}
                          />
                          <div>
                            <Text strong>Thanh toán qua VNPay</Text>
                            <br />
                            <Text type="secondary">
                              Thanh toán qua VNPay, chỉ hỗ trợ thanh toán online
                            </Text>
                          </div>
                        </Space>
                      </Radio>
                    </Card>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Button size="large" onClick={prevStep}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={nextStep}>
                Tiếp tục
              </Button>
            </div>
          </Card>
          {/* Confirm Order */}
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: currentStep === 2 ? "block" : "none",
            }}
          >
            <Title level={4}>
              <CheckCircleFilled
                style={{ marginRight: 8, color: token.colorPrimary }}
              />
              Xác nhận đơn hàng
            </Title>
            <Divider />

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={5}>
                  <UserOutlined
                    style={{ marginRight: 8, color: token.colorPrimary }}
                  />
                  Thông tin giao hàng
                </Title>
                {userData?.addresses?.find(
                  (addr: any) =>
                    addr.address_id === form.getFieldValue("address_id")
                ) && (
                  <div style={{ marginLeft: 24 }}>
                    <Space direction="vertical" size="small">
                      <div>
                        <Text type="secondary">Người nhận: </Text>
                        <Text strong>{userData?.full_name}</Text>
                      </div>
                      <div>
                        <Text type="secondary">Số điện thoại: </Text>
                        <Text strong>{userData?.phone}</Text>
                      </div>
                      <div>
                        <Text type="secondary">Địa chỉ: </Text>
                        <Text strong>
                          {
                            userData?.addresses?.find(
                              (addr: any) =>
                                addr.address_id ===
                                form.getFieldValue("address_id")
                            )?.address
                          }
                        </Text>
                      </div>
                    </Space>
                  </div>
                )}
              </div>

              <div>
                <Title level={5}>
                  <CreditCardOutlined
                    style={{ marginRight: 8, color: token.colorPrimary }}
                  />
                  Phương thức thanh toán
                </Title>
                <div style={{ marginLeft: 24 }}>
                  <Text strong>
                    {form.getFieldValue("paymentMethod") === "cod" &&
                      "Thanh toán khi nhận hàng (COD)"}
                    {form.getFieldValue("paymentMethod") === "bank" &&
                      "Chuyển khoản ngân hàng"}
                    {form.getFieldValue("paymentMethod") === "momo" &&
                      "Ví điện tử MoMo"}
                  </Text>
                </div>
              </div>

              <div>
                <Title level={5}>
                  <ShoppingOutlined
                    style={{ marginRight: 8, color: token.colorPrimary }}
                  />
                  Sản phẩm
                </Title>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item key={item.variant_id}>
                      <Row align="middle" style={{ width: "100%" }}>
                        <Col xs={4} sm={2}>
                          <Image
                            src={item.image}
                            alt={item.product_name}
                            width={50}
                            height={50}
                            preview={false}
                            style={{
                              objectFit: "contain",
                              background: "#f0f2f5",
                              borderRadius: 8,
                            }}
                          />
                        </Col>
                        <Col xs={14} sm={16}>
                          <Text strong>{item.product_name}</Text>
                          <br />
                          <Space>
                            <Tag color="blue">{item.color}</Tag>
                            <Tag color="purple">{item.storage}</Tag>
                          </Space>
                        </Col>
                        <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                          <Text type="secondary">
                            {item.quantity} x ${item.salePrice.toLocaleString()}
                          </Text>
                          <br />
                          <Text strong>
                            ${(item.quantity * item.salePrice).toLocaleString()}
                          </Text>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </div>
            </Space>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 24,
                gap: 16,
              }}
            >
              <Button
                size="large"
                onClick={prevStep}
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => handleSubmit(form.getFieldsValue())}
                icon={<CheckCircleFilled />}
                loading={orderLoading}
              >
                Đặt hàng
              </Button>
            </div>
          </Card>
        </Col>
        {/* Summary */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 24,
              background: "#FAFAFA",
            }}
          >
            <Title level={4} style={{ display: "flex", alignItems: "center" }}>
              <ShoppingOutlined
                style={{ marginRight: 12, color: token.colorPrimary }}
              />
              Tóm tắt đơn hàng
            </Title>
            <Divider style={{ margin: "12px 0 16px" }} />

            {cartItems.map((item) => (
              <Row
                key={item.variant_id}
                style={{ marginBottom: 16, padding: "8px 0" }}
                gutter={8}
                align="middle"
              >
                <Col span={4}>
                  <Badge
                    count={item.quantity}
                    color={token.colorPrimary}
                    offset={[-5, 5]}
                  >
                    <Image
                      src={item.image}
                      alt={item.product_name}
                      width={40}
                      height={40}
                      preview={false}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  </Badge>
                </Col>
                <Col span={12}>
                  <Text strong style={{ fontSize: "14px" }}>
                    {item.product_name}
                  </Text>
                  <Row>
                    <Space>
                      <Tag color="blue">{item.color}</Tag>
                      <Tag color="purple">
                        {item.ram}/{item.storage}
                      </Tag>
                    </Space>
                  </Row>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text strong style={{ color: token.colorError }}>
                    {(item.salePrice * item.quantity).toLocaleString() + " đ"}
                  </Text>
                </Col>
              </Row>
            ))}

            <Divider style={{ margin: "8px 0 16px" }} />

            <div
              style={{
                background: "#F0F2F5",
                padding: "16px",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Row style={{ marginBottom: 12 }}>
                <Col span={16}>
                  <Text>Tạm tính</Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text strong style={{ color: token.colorError }}>
                    {totalPrice.toLocaleString()} đ
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginBottom: 12 }}>
                <Col span={16}>
                  <Space>
                    <Text>Giảm giá</Text>
                    {appliedVoucher && (
                      <Tag
                        color="success"
                        closable
                        onClose={removeVoucher}
                        style={{ marginLeft: 4 }}
                      >
                        {appliedVoucher}
                      </Tag>
                    )}
                  </Space>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text type="success">
                    {discount > 0 ? `-$${discount.toLocaleString()}` : "$0"}
                  </Text>
                </Col>
              </Row>
            </div>

            <Button
              block
              icon={<TagOutlined />}
              onClick={() => setVoucherModalVisible(true)}
              style={{
                marginBottom: 16,
                borderRadius: 8,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {appliedVoucher ? "Thay đổi mã giảm giá" : "Thêm mã giảm giá"}
            </Button>

            <Divider style={{ margin: "16px 0" }} />

            <Row style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>
                  Tổng thanh toán
                </Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text
                  strong
                  style={{ fontSize: 20, color: token.colorPrimary }}
                ></Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Nhập mã giảm giá"
        open={voucherModalVisible}
        onCancel={() => setVoucherModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVoucherModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="apply" type="primary" onClick={handleApplyVoucher}>
            Áp dụng
          </Button>,
        ]}
      >
        <Input
          placeholder="Nhập mã giảm giá"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
          style={{ marginBottom: 16 }}
          prefix={<TagOutlined style={{ color: token.colorTextSecondary }} />}
          allowClear
        />
        <Text type="secondary">
          Mã giảm giá mẫu: DISCOUNT10 (giảm 10%), FREESHIP (miễn phí vận chuyển)
        </Text>
      </Modal>

      <Modal
        title="Đang xử lý đơn hàng"
        open={orderLoading}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Vui lòng đợi trong giây lát...</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
