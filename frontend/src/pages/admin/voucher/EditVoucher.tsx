import React, { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import {
  SaveOutlined,
  TagOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Voucher } from "../../../types";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EditVoucher: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");
  const [voucher, setVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setFetchLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/v1/vouchers/${id}`
        );
        setVoucher(response.data);

        // Set form values
        const formValues = {
          ...response.data,
          discount_type: response.data.discount_type,
          date_range:
            response.data.start_date && response.data.expiry_date
              ? [
                  dayjs(response.data.start_date),
                  dayjs(response.data.expiry_date),
                ]
              : undefined,
        };

        form.setFieldsValue(formValues);
        setDiscountType(response.data.discount_type);
      } catch (error) {
        messageApi.error("Không thể tải thông tin voucher");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchVoucher();
    }
  }, [id, form, messageApi]);

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

      // Remove unused fields
      delete formattedValues.date_range;
      delete formattedValues.used_count;
      delete formattedValues.voucher_id;

      await axios.put(
        `http://localhost:8080/api/v1/vouchers/${id}`,
        formattedValues
      );

      messageApi.success({
        content: "Cập nhật voucher thành công",
        duration: 1.5,
        onClose: () => {
          navigate("/admin/vouchers");
        },
      });
    } catch (error: any) {
      messageApi.error({
        content:
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật voucher",
        icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        title={
          <Space>
            <TagOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Chỉnh sửa voucher
            </Title>
          </Space>
        }
        style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
      >
        <Alert
          message="Thông tin voucher"
          description="Chỉnh sửa thông tin voucher"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

          {voucher && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<Text strong>Số lượt đã sử dụng</Text>}>
                  <InputNumber
                    value={voucher.used_count}
                    size="large"
                    style={{ width: "100%" }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item style={{ marginTop: 16 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={loading}
              >
                Cập nhật voucher
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

export default EditVoucher;
