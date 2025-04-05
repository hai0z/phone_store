import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Tabs,
  Space,
  Row,
  Col,
  Avatar,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { Admin } from "../../../types";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminProfile: React.FC = () => {
  const { admin, token } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Fetch admin details
  const fetchAdminDetails = async () => {
    if (!admin?.admin_id || !token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/${admin.admin_id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCurrentAdmin(response.data);
      // Set form values
      form.setFieldsValue({
        username: response.data.username,
        full_name: response.data.full_name,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Error fetching admin details:", error);
      messageApi.error("Không thể tải thông tin của admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [admin, token]);

  // Handle form submission for profile update
  const handleUpdateProfile = async (values: any) => {
    if (!admin?.admin_id || !token) return;

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/${admin.admin_id}`,
        {
          full_name: values.full_name,
          email: values.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      messageApi.success("Cập nhật thông tin thành công");
      fetchAdminDetails(); // Refresh data
    } catch (error) {
      console.error("Error updating profile:", error);
      messageApi.error("Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (values: any) => {
    if (!admin?.admin_id || !token) return;

    if (values.new_password !== values.confirm_password) {
      messageApi.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/${admin.admin_id}/password`,
        {
          current_password: values.current_password,
          new_password: values.new_password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      messageApi.success("Đổi mật khẩu thành công");
      passwordForm.resetFields();
    } catch (error: any) {
      if (error.response?.status === 401) {
        messageApi.error("Mật khẩu hiện tại không đúng");
      } else {
        messageApi.error("Không thể đổi mật khẩu");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Generate avatar text from full name
  const getAvatarText = (name?: string) => {
    if (!name) return "A";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (!admin) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Alert
          message="Lỗi truy cập"
          description="Bạn không có quyền truy cập trang này"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
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
            {getAvatarText(currentAdmin?.full_name)}
          </Avatar>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentAdmin?.full_name || "Admin"}
            </Title>
            <Text type="secondary">Quản lý thông tin tài khoản của bạn</Text>
          </div>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            key="1"
          >
            <Spin spinning={loading}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                style={{ maxWidth: 600 }}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="username"
                      label="Tên đăng nhập"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên đăng nhập",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="full_name"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
                    >
                      <Input prefix={<IdcardOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Đổi mật khẩu
              </span>
            }
            key="2"
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="current_password"
                label="Mật khẩu hiện tại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại",
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="new_password"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Xác nhận mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  icon={<SaveOutlined />}
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminProfile;
