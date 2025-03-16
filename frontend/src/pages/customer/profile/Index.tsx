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
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  PlusOutlined,
  EditOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import AddAddressModal from "./components/AddAddressModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "1";

  const navigate = useNavigate();
  // Fetch user data query
  const { data: userData } = useQuery({
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
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/customers/${user?.customer_id}/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsModalVisible(false);
      addressForm.resetFields();
    },
  });

  const onFinish = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  const handleAddAddress = (values: any) => {
    addAddressMutation.mutate(values);
  };

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (value: number) => `#${value}`,
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
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
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
        <Button type="link" onClick={() => navigate(`/order/${order_id}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  console.log(userData);
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <Title level={2}>Tài khoản của tôi</Title>
        <Tabs defaultActiveKey={tab}>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            key="1"
          >
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ flex: 1 }}>
                <Title level={4}>Thông tin chung</Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    name="full_name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={updateProfileMutation.isPending}
                    >
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Title level={4}>Địa chỉ nhận hàng</Title>
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Thêm địa chỉ mới
                  </Button>
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={userData?.addresses || []}
                  renderItem={(address: any) => (
                    <List.Item
                      style={{
                        background: "#f5f5f5",
                        padding: "16px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border: "1px solid #e8e8e8",
                      }}
                      actions={[
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            /* Handle edit */
                          }}
                        >
                          Sửa
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <MailOutlined
                            style={{ fontSize: "24px", color: "#1890ff" }}
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
                            <span>{address.receiver_name}</span>
                            {address.isDefault && (
                              <Tag color="blue">Địa chỉ mặc định</Tag>
                            )}
                          </div>
                        }
                        description={
                          <Col>
                            <Row>
                              <div>Địa chỉ: {address.address}</div>
                            </Row>
                            <Row style={{ marginTop: "8px" }}>
                              {!address.is_default && (
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => {}}
                                >
                                  Đặt làm địa chỉ mặc định
                                </Button>
                              )}
                              {address.is_default && (
                                <Tag color="blue">Địa chỉ mặc định</Tag>
                              )}
                            </Row>
                          </Col>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ShoppingOutlined />
                Đơn hàng của tôi
              </span>
            }
            key="2"
          >
            <Table
              columns={orderColumns}
              dataSource={userData?.orders || []}
              loading={!userData}
              rowKey="order_id"
              pagination={{
                pageSize: 10,
                total: userData?.orders?.length || 0,
                showTotal: (total) => `Tổng ${total} đơn hàng`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
      <AddAddressModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        addressForm={addressForm}
        handleAddAddress={handleAddAddress}
      />
    </div>
  );
};

export default ProfilePage;
