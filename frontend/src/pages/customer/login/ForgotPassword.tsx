import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Modal } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const { Title, Text } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const result = await forgotPassword(values.email);
      if (result.success) {
        setIsSuccess(true);
        setModalMessage(result.message);
        setIsModalVisible(true);
      } else {
        setModalMessage(result.message);
        setIsModalVisible(true);
        setIsSuccess(false);
      }
    } catch (error) {
      message.error("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    if (isSuccess) {
      navigate("/login");
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
            Quên mật khẩu
          </Title>
          <Text type="secondary">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Quay lại{" "}
              <Button type="link" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            </Text>
          </div>
        </Form>
      </Card>

      <Modal
        centered
        title="Đặt lại mật khẩu"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk}>
            Đồng ý
          </Button>,
        ]}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
