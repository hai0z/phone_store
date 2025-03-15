import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Modal } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const { Title, Text } = Typography;

interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const token = searchParams.get("token");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    isSuccess: false,
  });

  const handleSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      message.error("Token không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, values.password);
      if (result.success) {
        setModalContent({
          title: "Thành công",
          content: result.message || "Đã đặt lại mật khẩu thành công!",
          isSuccess: true,
        });
        setModalVisible(true);
      } else {
        setModalContent({
          title: "Thất bại",
          content: "Không thể đặt lại mật khẩu. Vui lòng thử lại!",
          isSuccess: false,
        });
        setModalVisible(true);
      }
    } catch (error) {
      setModalContent({
        title: "Thất bại",
        content: "Không thể đặt lại mật khẩu. Vui lòng thử lại!",
        isSuccess: false,
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalContent.isSuccess) {
      navigate("/login");
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Text type="danger">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!
        </Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

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
            Đặt lại mật khẩu
          </Title>
          <Text type="secondary">Nhập mật khẩu mới của bạn</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
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
              placeholder="Xác nhận mật khẩu mới"
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
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title={modalContent.title}
        open={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        centered
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            {modalContent.isSuccess ? "Đăng nhập ngay" : "Đóng"}
          </Button>,
        ]}
      >
        <p>{modalContent.content}</p>
      </Modal>
    </div>
  );
};

export default ResetPassword;
