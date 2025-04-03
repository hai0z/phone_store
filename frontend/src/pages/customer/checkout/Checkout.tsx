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
  Empty,
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
  QuestionCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useCartStore } from "../../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import AddAddressModal from "../profile/components/AddAddressModal";
import dayjs from "dayjs";

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

interface OrderData {
  order_id: number;
  customer_id: number | undefined;
  address: string;
  paymentMethod: string;
  note?: string;
  order_date: Date;
  total_amount: number;
  status: string;
  voucher_id?: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutFormData>();
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = useToken();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cod");
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const [confirmOrderModalVisible, setConfirmOrderModalVisible] =
    useState(false);

  const { order, clearOrder, removeItem } = useCartStore();

  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

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
        `http://localhost:8080/api/v1/customers/${user?.customer_id}`,
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
    try {
      setOrderLoading(true);
      const orderId = Math.floor(Math.random() * 1000000);

      // If a voucher is applied, validate it again before order submission
      if (appliedVoucher) {
        try {
          // First validate the voucher with the current total
          const validationResponse = await validateVoucher(
            appliedVoucher,
            totalPrice
          );

          if (!validationResponse) {
            setOrderLoading(false);
            messageApi.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
            return;
          }

          const voucherResponse = await axios.get(
            `http://localhost:8080/api/v1/vouchers/code/${appliedVoucher}`
          );

          if (voucherResponse.data && voucherResponse.data.voucher_id) {
            const orderData: OrderData = {
              order_id: orderId,
              customer_id: user?.customer_id,
              address: userData?.addresses.find(
                (addr: Address) => addr.address_id === values.address_id
              ).address,
              paymentMethod: values.paymentMethod,
              note: values.note,
              order_date: new Date(),
              total_amount: finalPrice,
              status:
                values.paymentMethod === "cod" ? "cho_xac_nhan" : "da_huy",
              voucher_id: voucherResponse.data.voucher_id,
            };

            await processOrder(orderData, values);
          }
        } catch (error) {
          console.error("Error with voucher:", error);
          setOrderLoading(false);
          messageApi.error("Có lỗi xảy ra khi xử lý mã giảm giá");
          return;
        }
      } else {
        const orderData: OrderData = {
          order_id: orderId,
          customer_id: user?.customer_id,
          address: userData?.addresses.find(
            (addr: Address) => addr.address_id === values.address_id
          ).address,
          paymentMethod: values.paymentMethod,
          note: values.note,
          order_date: new Date(),
          total_amount: finalPrice,
          status: values.paymentMethod === "cod" ? "cho_xac_nhan" : "da_huy",
        };

        await processOrder(orderData, values).then((err) => console.log(err));
      }
    } catch (error) {
      messageApi.error("Có lỗi xảy ra, vui lòng thử lại");
      await wait(1500).then(() => {
        setOrderLoading(false);
      });
    }
  };

  // Function to process the order after voucher validation
  const processOrder = async (
    orderData: OrderData,
    values: CheckoutFormData
  ) => {
    const orderDetails = cartItems.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.salePrice,
    }));

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
        `http://localhost:8080/api/v1/orders/${orderData.order_id}/payment/vnpay`,
        {
          amount: finalPrice,
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
      await axios
        .post("http://localhost:8080/api/v1/email/send-order-confirmation", {
          orderNumber: orderData.order_id,
          to: user?.email,
          totalAmount: finalPrice,
          discount: discount > 0 ? discount : 0,
          voucher: appliedVoucher || null,
        })
        .then(() => {
          clearOrder();
          cartItems.forEach((item) => {
            removeItem(item.variant_id);
          });
          navigate("/checkout/result?type=normal");
        });
    }
    await wait(1500).then(() => {
      setOrderLoading(false);
    });
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      messageApi.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      // Find voucher in available vouchers first to pre-validate
      const voucher = availableVouchers.find((v) => v.code === voucherCode);

      // Check if voucher exists and has valid conditions before making API call
      if (voucher) {
        // Check minimum order value
        if (voucher.min_order_value && totalPrice < voucher.min_order_value) {
          messageApi.error(
            `Đơn hàng phải có giá trị tối thiểu ${voucher.min_order_value.toLocaleString()}đ để sử dụng mã này`
          );
          return;
        }
      }

      // Validate with backend
      const response = await validateVoucher(voucherCode, totalPrice);

      if (response) {
        setAppliedVoucher(voucherCode);
        setDiscount(response.calculated_discount);
        setVoucherModalVisible(false);
        messageApi.success("Áp dụng mã giảm giá thành công");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        messageApi.error(error.response.data.message);
      } else if (error.message) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Mã giảm giá không hợp lệ");
      }
    }
  };

  // Function to validate a voucher
  const validateVoucher = async (code: string, amount: number) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/vouchers/validate",
        {
          code,
          orderAmount: amount,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Function to fetch available vouchers
  const fetchAvailableVouchers = async () => {
    setLoadingVouchers(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/vouchers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Filter only active vouchers (not expired and not reached max usage)
      const now = new Date();
      const activeVouchers = response.data.filter((voucher: any) => {
        const isNotExpired =
          !voucher.expiry_date || new Date(voucher.expiry_date) > now;
        const hasNotStarted =
          voucher.start_date && new Date(voucher.start_date) > now;
        const hasUsesLeft =
          !voucher.max_uses || voucher.used_count < voucher.max_uses;

        return isNotExpired && !hasNotStarted && hasUsesLeft;
      });

      // Sort vouchers: first by applicability, then by benefit
      const sortedVouchers = activeVouchers.sort((a: any, b: any) => {
        // First priority: can the voucher be applied to the current order?
        const aApplicable =
          !a.min_order_value || a.min_order_value <= totalPrice;
        const bApplicable =
          !b.min_order_value || b.min_order_value <= totalPrice;

        if (aApplicable && !bApplicable) return -1;
        if (!aApplicable && bApplicable) return 1;

        // Second priority: calculate potential discount (approximate)
        const aValue =
          a.discount_type === "PERCENTAGE"
            ? Math.min(
                totalPrice * (a.discount_value / 100),
                a.max_discount_value || Infinity
              )
            : a.discount_value;

        const bValue =
          b.discount_type === "PERCENTAGE"
            ? Math.min(
                totalPrice * (b.discount_value / 100),
                b.max_discount_value || Infinity
              )
            : b.discount_value;

        // Higher discount first
        return bValue - aValue;
      });

      setAvailableVouchers(sortedVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoadingVouchers(false);
    }
  };

  // Button to open voucher modal
  const openVoucherModal = () => {
    fetchAvailableVouchers();
    setVoucherModalVisible(true);
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

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0
  );

  const finalPrice = totalPrice - discount;

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
        maxWidth: 1400,
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

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              paymentMethod: "cod",
            }}
          >
            {/* Địa chỉ giao hàng */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <EnvironmentOutlined
                    style={{
                      fontSize: 20,
                      color: token.colorPrimary,
                      marginRight: 8,
                    }}
                  />
                  <span>Địa chỉ giao hàng</span>
                </div>
              }
              style={{ marginBottom: 16, borderRadius: 8 }}
            >
              <Form.Item
                name="address_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn địa chỉ giao hàng",
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {userData?.addresses?.length === 0 ? (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setIsModalVisible(true)}
                      style={{ width: "100%", height: 100 }}
                    >
                      Thêm địa chỉ mới
                    </Button>
                  ) : (
                    <>
                      <Radio.Group
                        value={selectedAddress}
                        onChange={(e) => handleSelectAddress(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        {userData?.addresses?.map((address: any) => (
                          <div
                            key={address.address_id}
                            style={{
                              marginBottom: 8,
                              border:
                                selectedAddress === address.address_id
                                  ? `1px solid ${token.colorPrimary}`
                                  : "1px solid #f0f0f0",
                              borderRadius: 8,
                              padding: "12px 16px",
                              backgroundColor:
                                selectedAddress === address.address_id
                                  ? "rgba(24, 144, 255, 0.05)"
                                  : "#fff",
                              transition: "all 0.3s",
                            }}
                          >
                            <Radio
                              value={address.address_id}
                              style={{ width: "100%" }}
                            >
                              <div style={{ marginLeft: 8 }}>
                                <Space align="baseline">
                                  <Typography.Text strong>
                                    {userData.full_name}
                                  </Typography.Text>
                                  {address.is_default && (
                                    <Tag color="blue">Mặc định</Tag>
                                  )}
                                </Space>
                                <div>
                                  <Typography.Text type="secondary">
                                    <PhoneOutlined style={{ marginRight: 8 }} />
                                    {userData.phone}
                                  </Typography.Text>
                                </div>
                                <div>
                                  <Typography.Text type="secondary">
                                    <EnvironmentOutlined
                                      style={{ marginRight: 8 }}
                                    />
                                    {address.address}
                                  </Typography.Text>
                                </div>
                              </div>
                            </Radio>
                          </div>
                        ))}
                      </Radio.Group>

                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        style={{ width: "100%", height: 44 }}
                      >
                        Thêm địa chỉ mới
                      </Button>
                    </>
                  )}
                </Space>
              </Form.Item>
            </Card>

            {/* Phương thức thanh toán */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CreditCardOutlined
                    style={{
                      fontSize: 20,
                      color: token.colorPrimary,
                      marginRight: 8,
                    }}
                  />
                  <span>Phương thức thanh toán</span>
                </div>
              }
              style={{ marginBottom: 16, borderRadius: 8 }}
            >
              <Form.Item
                name="paymentMethod"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phương thức thanh toán",
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div
                      style={{
                        border:
                          selectedPaymentMethod === "cod"
                            ? `1px solid ${token.colorPrimary}`
                            : "1px solid #f0f0f0",
                        borderRadius: 8,
                        padding: "12px 16px",
                        backgroundColor:
                          selectedPaymentMethod === "cod"
                            ? "rgba(24, 144, 255, 0.05)"
                            : "#fff",
                        marginBottom: 8,
                        transition: "all 0.3s",
                      }}
                    >
                      <Radio
                        value="cod"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                      >
                        <div
                          style={{
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ShoppingOutlined
                            style={{
                              fontSize: 18,
                              color: token.colorPrimary,
                              marginRight: 12,
                            }}
                          />
                          <div>
                            <Typography.Text strong>
                              Thanh toán khi nhận hàng (COD)
                            </Typography.Text>
                            <div>
                              <Typography.Text
                                type="secondary"
                                style={{ fontSize: 13 }}
                              >
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </Typography.Text>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </div>

                    <div
                      style={{
                        border:
                          selectedPaymentMethod === "vn_pay"
                            ? `1px solid ${token.colorPrimary}`
                            : "1px solid #f0f0f0",
                        borderRadius: 8,
                        padding: "12px 16px",
                        backgroundColor:
                          selectedPaymentMethod === "vn_pay"
                            ? "rgba(24, 144, 255, 0.05)"
                            : "#fff",
                        transition: "all 0.3s",
                      }}
                    >
                      <Radio
                        value="vn_pay"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                      >
                        <div
                          style={{
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <BankOutlined
                            style={{
                              fontSize: 18,
                              color: token.colorPrimary,
                              marginRight: 12,
                            }}
                          />
                          <div>
                            <Typography.Text strong>
                              Thanh toán qua VNPay
                            </Typography.Text>
                            <div>
                              <Typography.Text
                                type="secondary"
                                style={{ fontSize: 13 }}
                              >
                                Thanh toán qua VNPay, hỗ trợ thanh toán online
                              </Typography.Text>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </div>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Card>

            {/* Ghi chú */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FileTextOutlined
                    style={{
                      fontSize: 20,
                      color: token.colorPrimary,
                      marginRight: 8,
                    }}
                  />
                  <span>Ghi chú đơn hàng</span>
                </div>
              }
              style={{ marginBottom: 16, borderRadius: 8 }}
            >
              <Form.Item name="note" style={{ marginBottom: 0 }}>
                <TextArea
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  rows={4}
                />
              </Form.Item>
            </Card>

            {/* Sản phẩm */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ShoppingOutlined
                    style={{
                      fontSize: 20,
                      color: token.colorPrimary,
                      marginRight: 8,
                    }}
                  />
                  <span>Sản phẩm ({cartItems.length})</span>
                </div>
              }
              style={{ marginBottom: 16, borderRadius: 8 }}
            >
              <List
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item
                    key={item.variant_id}
                    style={{ padding: "12px 0" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{ marginRight: 12, width: 50, flexShrink: 0 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          width={50}
                          height={50}
                          preview={false}
                          style={{
                            objectFit: "contain",
                            background: "#f9f9f9",
                            borderRadius: 6,
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: 14 }}>
                          {item.product_name}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Tag color="blue" style={{ marginRight: 4 }}>
                            {item.color}
                          </Tag>
                          <Tag color="purple">
                            {item.ram}/{item.storage}
                          </Tag>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: 8 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.quantity} x {item.salePrice.toLocaleString()} đ
                        </Text>
                        <div>
                          <Text strong>
                            {(item.quantity * item.salePrice).toLocaleString()}{" "}
                            đ
                          </Text>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  form
                    .validateFields()
                    .then(() => {
                      setConfirmOrderModalVisible(true);
                    })
                    .catch((error) => {
                      if (
                        error.errorFields.some((field: { name: string[] }) =>
                          field.name.includes("address_id")
                        )
                      ) {
                        messageApi.error("Vui lòng chọn địa chỉ giao hàng");
                      }
                    });
                }}
                icon={<CheckCircleFilled />}
                loading={orderLoading}
                style={{
                  borderRadius: 8,
                  height: 50,
                  fontSize: 16,
                  padding: "0 32px",
                }}
              >
                Đặt hàng
              </Button>
            </div>
          </Form>
        </Col>

        {/* Tóm tắt đơn hàng */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <ShoppingOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorPrimary,
                    marginRight: 8,
                  }}
                />
                <span>Tóm tắt đơn hàng</span>
              </div>
            }
            style={{
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 64,
            }}
          >
            <div className="order-summary">
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: 16,
                  paddingRight: 4,
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.variant_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <Badge
                      count={item.quantity}
                      size="small"
                      offset={[-2, 2]}
                      color={token.colorPrimary}
                    >
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        width={40}
                        height={40}
                        preview={false}
                        style={{
                          objectFit: "contain",
                          background: "#f9f9f9",
                          borderRadius: 4,
                        }}
                      />
                    </Badge>
                    <div
                      style={{ flex: 1, marginLeft: 12, overflow: "hidden" }}
                    >
                      <Typography.Text
                        style={{ fontSize: 13, display: "block" }}
                        ellipsis={{ tooltip: item.product_name }}
                      >
                        {item.product_name}
                      </Typography.Text>
                      <div>
                        <Tag
                          color="blue"
                          style={{
                            fontSize: 11,
                            marginRight: 4,
                            padding: "0 4px",
                          }}
                        >
                          {item.color}
                        </Tag>
                        <Tag
                          color="purple"
                          style={{ fontSize: 11, padding: "0 4px" }}
                        >
                          {item.ram}/{item.storage}
                        </Tag>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 80 }}>
                      <Typography.Text
                        strong
                        style={{ color: token.colorError, fontSize: 13 }}
                      >
                        {(item.quantity * item.salePrice).toLocaleString()} đ
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text>Tạm tính</Text>
                  <Text>{totalPrice.toLocaleString()} đ</Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <Text>Giảm giá</Text>
                    {appliedVoucher && (
                      <Tag color="success" style={{ marginLeft: 4 }}>
                        {appliedVoucher}
                      </Tag>
                    )}
                  </div>
                  <Text type="success" strong>
                    {discount > 0 ? `-${discount.toLocaleString()} đ` : "0 đ"}
                  </Text>
                </div>
              </div>

              <Button
                block
                icon={<TagOutlined />}
                onClick={openVoucherModal}
                style={{
                  marginTop: 8,
                  marginBottom: 16,
                  borderRadius: 6,
                  height: 38,
                }}
              >
                {appliedVoucher ? "Thay đổi mã giảm giá" : "Thêm mã giảm giá"}
              </Button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(24, 144, 255, 0.05)",
                  padding: "12px",
                  borderRadius: 6,
                  border: "1px solid rgba(24, 144, 255, 0.1)",
                }}
              >
                <Text strong style={{ fontSize: 16 }}>
                  Tổng thanh toán
                </Text>
                <Text strong style={{ fontSize: 18, color: token.colorError }}>
                  {finalPrice.toLocaleString()} đ
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <TagOutlined style={{ color: token.colorPrimary }} />
            <span>Mã giảm giá</span>
          </Space>
        }
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
        <div style={{ marginBottom: 20 }}>
          <Input
            placeholder="Nhập mã giảm giá"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            style={{ marginBottom: 16 }}
            prefix={<TagOutlined style={{ color: token.colorTextSecondary }} />}
            allowClear
            size="large"
          />
        </div>

        <Typography.Title level={5}>Mã giảm giá sẵn có</Typography.Title>
        {loadingVouchers ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="small" />
            <div style={{ marginTop: "10px" }}>Đang tải mã giảm giá...</div>
          </div>
        ) : availableVouchers.length > 0 ? (
          <>
            <div style={{ marginBottom: "12px" }}>
              <Text type="secondary">
                {
                  availableVouchers.filter(
                    (v) => !v.min_order_value || v.min_order_value <= totalPrice
                  ).length
                }
                /{availableVouchers.length} mã giảm giá có thể áp dụng cho đơn
                hàng này
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={availableVouchers}
              renderItem={(voucher: any) => {
                const discountText =
                  voucher.discount_type === "PERCENTAGE"
                    ? `Giảm ${voucher.discount_value}% tổng giá trị đơn hàng${
                        voucher.max_discount_value
                          ? `, tối đa ${voucher.max_discount_value.toLocaleString()}đ`
                          : ""
                      }`
                    : `Giảm ${voucher.discount_value.toLocaleString()}đ`;

                const minOrderText = voucher.min_order_value
                  ? ` cho đơn hàng từ ${voucher.min_order_value.toLocaleString()}đ`
                  : "";

                // Create expiration/usage info
                let expirationInfo = "";
                if (voucher.expiry_date) {
                  expirationInfo += `Hết hạn: ${dayjs(
                    voucher.expiry_date
                  ).format("DD/MM/YYYY")}`;
                }

                let usageInfo = "";
                if (voucher.max_uses) {
                  usageInfo = `Còn lại: ${
                    voucher.max_uses - voucher.used_count
                  }/${voucher.max_uses} lần sử dụng`;
                }

                return (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => setVoucherCode(voucher.code)}
                        key="apply"
                        disabled={voucher.min_order_value > totalPrice}
                      >
                        Sử dụng
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <TagOutlined
                          style={{ color: token.colorPrimary, fontSize: 20 }}
                        />
                      }
                      title={
                        <Space>
                          <Typography.Text strong>
                            {voucher.code}
                          </Typography.Text>
                          {voucher.min_order_value > totalPrice && (
                            <Tag color="error">Không đủ điều kiện</Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size={1}
                          style={{ width: "100%" }}
                        >
                          <div>{`${discountText}${minOrderText}`}</div>
                          {expirationInfo && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {expirationInfo}
                            </Text>
                          )}
                          {usageInfo && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {usageInfo}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </>
        ) : (
          <Empty description="Không có mã giảm giá nào khả dụng" />
        )}
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

      <Modal
        title="Xác nhận đơn hàng"
        open={confirmOrderModalVisible}
        footer={[
          <Button
            key="cancel"
            onClick={() => setConfirmOrderModalVisible(false)}
          >
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              const addressId = selectedAddress;
              if (!addressId) {
                messageApi.error("Vui lòng chọn địa chỉ giao hàng");
                setConfirmOrderModalVisible(false);
                return;
              }
              handleSubmit(form.getFieldsValue());
            }}
          >
            Xác nhận
          </Button>,
        ]}
        closable={true}
        onCancel={() => setConfirmOrderModalVisible(false)}
        centered
      >
        <div style={{ padding: "0 8px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <QuestionCircleOutlined
              style={{
                fontSize: "48px",
                color: token.colorPrimary,
                marginBottom: "12px",
              }}
            />
            <div>
              <Title level={5} style={{ marginBottom: 24 }}>
                Bạn có chắc chắn muốn đặt hàng?
              </Title>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "#fafafa",
              }}
            >
              <Text strong>Địa chỉ giao hàng</Text>
            </div>
            <div style={{ padding: "12px 16px" }}>
              {userData?.addresses?.find(
                (addr: any) => addr.address_id === selectedAddress
              ) && (
                <>
                  <Space>
                    <Text strong>{userData?.full_name}</Text>
                    <Text type="secondary">|</Text>
                    <Text>{userData?.phone}</Text>
                  </Space>
                  <div style={{ marginTop: 4 }}>
                    <Text>
                      {
                        userData?.addresses?.find(
                          (addr: any) => addr.address_id === selectedAddress
                        )?.address
                      }
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "#fafafa",
              }}
            >
              <Text strong>Phương thức thanh toán</Text>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {form.getFieldValue("paymentMethod") === "cod" ? (
                  <>
                    <ShoppingOutlined
                      style={{
                        fontSize: 16,
                        color: token.colorPrimary,
                        marginRight: 8,
                      }}
                    />
                    <Text>Thanh toán khi nhận hàng (COD)</Text>
                  </>
                ) : (
                  <>
                    <BankOutlined
                      style={{
                        fontSize: 16,
                        color: token.colorPrimary,
                        marginRight: 8,
                      }}
                    />
                    <Text>Thanh toán qua VNPay</Text>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8 }}>
            <div
              style={{
                padding: "8px 16px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "#fafafa",
              }}
            >
              <Text strong>Tổng thanh toán</Text>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text>Tổng giá trị sản phẩm</Text>
                <Text>{totalPrice.toLocaleString()} đ</Text>
              </div>

              {appliedVoucher && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text>Giảm giá</Text>
                    <Tag color="success" style={{ marginLeft: 4 }}>
                      {appliedVoucher}
                    </Tag>
                  </div>
                  <Text type="success">-{discount.toLocaleString()} đ</Text>
                </div>
              )}

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>Thành tiền</Text>
                <Text strong style={{ color: token.colorError, fontSize: 16 }}>
                  {finalPrice.toLocaleString()} đ
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <AddAddressModal
        isModalVisible={isModalVisible}
        setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
        onAddAddress={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default Checkout;
