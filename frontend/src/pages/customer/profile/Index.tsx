import React, { useState } from "react";
import {
  Tabs,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  List,
  Col,
  Row,
  notification,
  Popconfirm,
  Skeleton,
  Avatar,
  Space,
  Divider,
  Badge,
  Timeline,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  PlusOutlined,
  MailOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ShoppingCartOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import AddAddressModal from "./components/AddAddressModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();

  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const tab = searchParams.get("tab") || "1";

  const navigate = useNavigate();
  // Fetch user data query
  const {
    data: userData,
    refetch,
    isLoading,
  } = useQuery({
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
      form.setFieldsValue({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        customer_id: data.customer_id,
      });
      return data;
    },
    enabled: !!user?.customer_id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/customers/${user?.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to update profile");
      } else {
        refetch();
        notificationApi.success({
          message: "Đã cập nhật thông tin",
        });
      }
    },
  });

  const onFinish = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  const handleUpdateAddress = async (addressId: number) => {
    const respone = await axios.put(
      `http://localhost:8080/api/v1/customers/addresses/${addressId}`,
      {
        is_default: true,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (respone.status === 200) {
      refetch();
      notificationApi.success({
        message: "Đã cập nhật địa chỉ mặc định",
      });
    } else {
      notificationApi.error({
        message: "Lỗi cập nhật địa chỉ mặc định",
      });
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    const respone = await axios.delete(
      `http://localhost:8080/api/v1/customers/addresses/${addressId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (respone.status === 204) {
      refetch();
      notificationApi.success({
        message: "Đã xóa địa chỉ",
      });
    } else {
      notificationApi.error({
        message: "Lỗi xóa địa chỉ",
      });
    }
  };

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (value: number) => <span className="order-id">#{value}</span>,
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "orderDetails",
      render: (orderDetails: any) => {
        return orderDetails
          .map((detail: any) => detail.variant.product.product_name)
          .join(", ");
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date: string) => (
        <Space>
          <ClockCircleOutlined />
          {dayjs(date).format("DD/MM/YYYY HH:mm:ss")}
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => (
        <Text strong className="amount">
          {amount.toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          icon={
            status === "cho_xac_nhan" ? (
              <ClockCircleOutlined />
            ) : status === "dang_giao_hang" ? (
              <SendOutlined />
            ) : status === "da_giao_hang" ? (
              <CheckCircleOutlined />
            ) : status === "da_xac_nhan" ? (
              <ShoppingCartOutlined />
            ) : (
              <DeleteOutlined />
            )
          }
          color={
            status === "cho_xac_nhan"
              ? "gold"
              : status === "dang_giao_hang"
              ? "blue"
              : status === "da_giao_hang"
              ? "green"
              : status === "da_xac_nhan"
              ? "purple"
              : "red"
          }
          className="status-tag"
        >
          {status === "cho_xac_nhan"
            ? "Chờ xác nhận"
            : status === "dang_giao_hang"
            ? "Đang giao hàng"
            : status === "da_giao_hang"
            ? "Hoàn thành"
            : status === "da_xac_nhan"
            ? "Đã xác nhận"
            : "Đã hủy"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "order_id",
      key: "order_id",
      render: (order_id: number) => (
        <Button
          type="primary"
          ghost
          icon={<ShoppingOutlined />}
          onClick={() => navigate(`/order/${order_id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const getAvatarText = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="profile-container"
      style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {notificationContextHolder}
      <Card
        className="profile-card"
        style={{
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          className="profile-header"
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            className="avatar-container"
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            {isLoading ? (
              <Skeleton.Avatar active size={80} shape="circle" />
            ) : (
              <Avatar
                size={80}
                style={{
                  backgroundColor: "#1890ff",
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                }}
              >
                {getAvatarText(userData?.full_name)}
              </Avatar>
            )}
          </div>
          <div>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <>
                <Title level={2} style={{ margin: 0 }}>
                  Xin chào, {userData?.full_name}
                </Title>
                <Text type="secondary">
                  Quản lý tài khoản và đơn hàng của bạn
                </Text>
              </>
            )}
          </div>
        </div>

        <Tabs
          defaultActiveKey={tab}
          className="profile-tabs"
          type="card"
          size="large"
        >
          <TabPane
            tab={
              <span className="tab-label">
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            key="1"
          >
            <Row gutter={[24, 24]} className="profile-content">
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <IdcardOutlined />
                      <span>Thông tin tài khoản</span>
                    </Space>
                  }
                  className="info-card"
                  style={{ height: "100%", borderRadius: "8px" }}
                >
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : (
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                      className="profile-form"
                    >
                      <Form.Item
                        name="full_name"
                        label={
                          <Space>
                            <UserOutlined />
                            <span>Họ và tên</span>
                          </Space>
                        }
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label={
                          <Space>
                            <MailOutlined />
                            <span>Email</span>
                          </Space>
                        }
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input size="large" placeholder="Nhập email của bạn" />
                      </Form.Item>

                      <Form.Item
                        name="phone"
                        label={
                          <Space>
                            <PhoneOutlined />
                            <span>Số điện thoại</span>
                          </Space>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Nhập số điện thoại của bạn"
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<EditOutlined />}
                          loading={updateProfileMutation.isPending}
                          size="large"
                          block
                          style={{
                            borderRadius: "6px",
                            height: "48px",
                            marginTop: "16px",
                            transition: "all 0.3s",
                          }}
                          className="update-button"
                        >
                          Cập nhật thông tin
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Space>
                        <EnvironmentOutlined />
                        <span>Địa chỉ nhận hàng</span>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                      >
                        Thêm địa chỉ
                      </Button>
                    </div>
                  }
                  className="address-card"
                  style={{ height: "100%", borderRadius: "8px" }}
                >
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 3 }} />
                  ) : userData?.addresses?.length ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={userData?.addresses || []}
                      renderItem={(address: any) => (
                        <List.Item
                          className="address-item"
                          style={{
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "12px",
                            border: "1px solid #e8e8e8",
                            background: address.is_default
                              ? "#f0f7ff"
                              : "#f5f5f5",
                            transition: "all 0.3s ease",
                          }}
                          actions={[
                            !address.is_default && (
                              <Popconfirm
                                title="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                                onConfirm={() =>
                                  handleDeleteAddress(address.address_id)
                                }
                                placement="topRight"
                                okText="Xóa"
                                cancelText="Hủy"
                              >
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  className="delete-btn"
                                />
                              </Popconfirm>
                            ),
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={<EnvironmentOutlined />}
                                style={{
                                  background: address.is_default
                                    ? "#1890ff"
                                    : "#b4b4b4",
                                  boxShadow: address.is_default
                                    ? "0 3px 8px rgba(24, 144, 255, 0.3)"
                                    : "none",
                                }}
                              />
                            }
                            title={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <Text strong>{address.receiver_name}</Text>
                                {address.is_default && (
                                  <Badge
                                    count="Mặc định"
                                    style={{
                                      backgroundColor: "#1890ff",
                                      padding: "0 8px",
                                      fontWeight: "normal",
                                    }}
                                  />
                                )}
                              </div>
                            }
                            description={
                              <div>
                                <div className="address-text">
                                  <Text>{address.address}</Text>
                                </div>
                                <div style={{ marginTop: "8px" }}>
                                  {!address.is_default && (
                                    <Button
                                      type="default"
                                      size="small"
                                      onClick={() =>
                                        handleUpdateAddress(address.address_id)
                                      }
                                      icon={<CheckCircleOutlined />}
                                    >
                                      Đặt làm mặc định
                                    </Button>
                                  )}
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <EnvironmentOutlined
                        style={{ fontSize: "48px", color: "#d9d9d9" }}
                      />
                      <p style={{ marginTop: "16px" }}>
                        Bạn chưa có địa chỉ nào
                      </p>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        style={{ marginTop: "8px" }}
                      >
                        Thêm địa chỉ mới
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span className="tab-label">
                <ShoppingOutlined />
                Đơn hàng của tôi
              </span>
            }
            key="2"
          >
            <Card className="orders-card" style={{ borderRadius: "8px" }}>
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <div className="order-list">
                  {userData?.orders?.length ? (
                    <Table
                      columns={orderColumns}
                      dataSource={userData?.orders || []}
                      loading={isLoading}
                      rowKey="order_id"
                      pagination={{
                        pageSize: 10,
                        total: userData?.orders?.length || 0,
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                      }}
                      className="orders-table"
                      rowClassName="order-row"
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <ShoppingCartOutlined
                        style={{ fontSize: "48px", color: "#d9d9d9" }}
                      />
                      <p style={{ marginTop: "16px" }}>
                        Bạn chưa có đơn hàng nào
                      </p>
                      <Button
                        type="primary"
                        onClick={() => navigate("/products")}
                        style={{ marginTop: "8px" }}
                      >
                        Mua sắm ngay
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Card>
      <AddAddressModal
        onAddAddress={() => {
          refetch();
        }}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />

      <style>
        {`
          .profile-container {
            animation: fadeIn 0.5s ease;
          }
          
          .profile-card {
            transition: all 0.3s ease;
          }
          
          .profile-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          
          .tab-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
          }
          
          .update-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
          }
          
          .address-item {
            transition: all 0.3s ease;
          }
          
          .address-item:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }
          
          .delete-btn {
            opacity: 0.7;
            transition: all 0.3s;
          }
          
          .address-item:hover .delete-btn {
            opacity: 1;
          }
          
          .order-id {
            font-weight: 500;
            color: #1890ff;
          }
          
          .status-tag {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 4px;
          }
          
          .amount {
            color: #ff4d4f;
          }
          
          .order-row {
            transition: all 0.3s;
          }
          
          .order-row:hover {
            background-color: #f0f7ff;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @media (max-width: 768px) {
            .profile-tabs .ant-tabs-nav {
              margin-bottom: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfilePage;
