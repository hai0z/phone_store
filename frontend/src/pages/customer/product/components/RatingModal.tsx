import {
  Modal,
  Rate,
  Input,
  Form,
  Button,
  Space,
  Typography,
  theme,
} from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface RatingModalProps {
  visible: boolean;
  productId: number;
  onClose: () => void;
}

const RatingModal = ({ visible, productId, onClose }: RatingModalProps) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [rating, setRating] = useState(5);
  const { user } = useAuth();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.post(`http://localhost:8080/api/v1/ratings`, {
        productId,
        customerId: user?.customer_id,
        rating,
        content: values.content,
      });

      form.resetFields();
      setRating(5);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const descriptions = [
    "Rất không hài lòng",
    "Không hài lòng",
    "Bình thường",
    "Hài lòng",
    "Rất hài lòng",
  ];

  return (
    <Modal
      open={visible}
      title={
        <Title level={4} style={{ margin: 0 }}>
          Đánh giá sản phẩm
        </Title>
      }
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <div style={{ padding: "20px 0" }}>
        <Form form={form} layout="vertical" initialValues={{ rating: 5 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Form.Item name="rating" rules={[{ required: true }]}>
              <Rate
                onChange={(value) => setRating(value)}
                value={rating}
                style={{ fontSize: 32 }}
              />
            </Form.Item>
            <Text style={{ color: token.colorPrimary, fontSize: 16 }}>
              {descriptions[rating - 1]}
            </Text>
          </div>

          <Form.Item
            name="content"
            label="Nhận xét của bạn"
            rules={[
              { required: true, message: "Vui lòng nhập nhận xét của bạn" },
              { min: 20, message: "Nhận xét phải có ít nhất 20 ký tự" },
            ]}
          >
            <TextArea
              placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này nhé"
              rows={4}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                icon={<StarOutlined />}
              >
                Gửi đánh giá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default RatingModal;
