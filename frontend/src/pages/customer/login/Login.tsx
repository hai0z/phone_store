import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login("customer", values.username, values.password);
      message.success("Đăng nhập thành công!");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email hoặc số điện thoại",
              },
              {
                pattern:
                  /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{10})$/,
                message: "Email hoặc số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email hoặc số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </Text>
            <br />
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
