import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Card,
  Space,
  Typography,
  Row,
  Col,
  message,
  Alert,
} from "antd";
import {
  SaveOutlined,
  TagOutlined,
  PercentageOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AddVoucher: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Format dates
      const formattedValues = {
        ...values,
        start_date: values.date_range
          ? values.date_range[0].toISOString()
          : null,
        expiry_date: values.date_range
          ? values.date_range[1].toISOString()
          : null,
      };

      // Remove date_range as it's not needed in the API call
      delete formattedValues.date_range;

      await axios.post(
        "http://localhost:8080/api/v1/vouchers",
        formattedValues
      );

      messageApi.success({
        content: "Thêm voucher thành công",
        duration: 1.5,
        onClose: () => {
          navigate("/admin/vouchers");
        },
      });
    } catch (error: any) {
      messageApi.error({
        content:
          error.response?.data?.message || "Có lỗi xảy ra khi thêm voucher",
        icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        title={
          <Space>
            <TagOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Thêm voucher mới
            </Title>
          </Space>
        }
        style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
      >
        <Alert
          message="Thông tin voucher"
          description="Vui lòng điền đầy đủ các thông tin của voucher"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            discount_type: "PERCENTAGE",
            max_uses: null,
            min_order_value: null,
            max_discount_value: null,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={<Text strong>Mã voucher</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập mã voucher" },
                  { min: 3, message: "Mã voucher phải có ít nhất 3 ký tự" },
                ]}
                tooltip="Mã voucher nên viết hoa, không dấu, không có khoảng trắng (VD: SUMMER2023)"
              >
                <Input
                  placeholder="Nhập mã voucher"
                  size="large"
                  prefix={<TagOutlined className="site-form-item-icon" />}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) =>
                    form.setFieldsValue({ code: e.target.value.toUpperCase() })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount_type"
                label={<Text strong>Loại giảm giá</Text>}
                rules={[
                  { required: true, message: "Vui lòng chọn loại giảm giá" },
                ]}
              >
                <Select
                  placeholder="Chọn loại giảm giá"
                  size="large"
                  onChange={(value) => setDiscountType(value)}
                >
                  <Option value="PERCENTAGE">Phần trăm (%)</Option>
                  <Option value="FIXED">Giá trị cố định (₫)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="discount_value"
                label={<Text strong>Giá trị giảm giá</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị giảm giá" },
                  {
                    validator: (_, value) => {
                      if (
                        discountType === "PERCENTAGE" &&
                        (value <= 0 || value > 100)
                      ) {
                        return Promise.reject(
                          "Giá trị phần trăm phải từ 1-100%"
                        );
                      }
                      if (discountType === "FIXED" && value <= 0) {
                        return Promise.reject("Giá trị phải lớn hơn 0");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá trị giảm giá"
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                  max={discountType === "PERCENTAGE" ? 100 : undefined}
                  addonAfter={discountType === "PERCENTAGE" ? "%" : "₫"}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="min_order_value"
                label={<Text strong>Giá trị đơn hàng tối thiểu</Text>}
                tooltip="Để trống nếu không có giá trị tối thiểu"
              >
                <InputNumber
                  placeholder="Nhập giá trị đơn hàng tối thiểu"
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                  addonAfter="₫"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {discountType === "PERCENTAGE" && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="max_discount_value"
                  label={<Text strong>Giảm tối đa</Text>}
                  tooltip="Giới hạn số tiền giảm giá tối đa khi sử dụng voucher phần trăm. Để trống nếu không giới hạn số tiền giảm."
                >
                  <InputNumber
                    placeholder="Nhập số tiền giảm tối đa"
                    size="large"
                    style={{ width: "100%" }}
                    min={0}
                    addonAfter="₫"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="max_uses"
                label={<Text strong>Số lượt sử dụng tối đa</Text>}
                tooltip="Để trống nếu không giới hạn số lượt sử dụng"
              >
                <InputNumber
                  placeholder="Nhập số lượt sử dụng tối đa"
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date_range"
                label={<Text strong>Thời gian hiệu lực</Text>}
                tooltip="Để trống nếu voucher không có thời hạn"
              >
                <RangePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={loading}
              >
                Lưu voucher
              </Button>
              <Button size="large" onClick={() => navigate("/admin/vouchers")}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddVoucher;
