import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Modal } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const { Title, Text } = Typography;

interface RegisterFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      const result = await register(
        values.full_name,
        values.email,
        values.phone,
        values.password
      );
      if (result.success) {
        setIsSuccessModalVisible(true);
      } else {
        setErrorMessage(
          result.message || "Đăng ký thất bại. Vui lòng thử lại!"
        );
        setIsErrorModalVisible(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
      setIsErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalOk = () => {
    setIsSuccessModalVisible(false);
    navigate("/login");
  };

  const handleErrorModalOk = () => {
    setIsErrorModalVisible(false);
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
            Đăng ký
          </Title>
          <Text type="secondary">Tạo tài khoản mới!</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="full_name"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ tên"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
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

          <Form.Item
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Đã có tài khoản?{" "}
              <Button type="link" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            </Text>
          </div>
        </Form>
      </Card>

      <Modal
        centered
        title="Đăng ký thành công"
        open={isSuccessModalVisible}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalOk}>
            Đăng nhập ngay
          </Button>,
        ]}
      >
        <p>
          Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập ngay
          bây giờ.
        </p>
      </Modal>

      <Modal
        centered
        title="Đăng ký thất bại"
        open={isErrorModalVisible}
        onOk={handleErrorModalOk}
        onCancel={handleErrorModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleErrorModalOk}>
            Đóng
          </Button>,
        ]}
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default Register;
