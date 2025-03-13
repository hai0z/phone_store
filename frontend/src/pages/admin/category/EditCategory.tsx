import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Space, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const EditCategory: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/categories/${id}`
        );
        const category = response.data;

        form.setFieldsValue({
          category_name: category.category_name,
        });
      } catch (error: any) {
        messageApi.error({
          content:
            error.response?.data?.message || "Không thể tải thông tin danh mục",
          icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [form, id, messageApi]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category_name", values.category_name);

      await axios.put(
        `http://localhost:8080/api/v1/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      messageApi.success({
        content: "Cập nhật danh mục thành công",
        icon: <InfoCircleOutlined style={{ color: "#52c41a" }} />,
        onClose: () => {
          navigate("/admin/categories");
        },
        duration: 1,
      });
    } catch (error: any) {
      messageApi.error({
        content: error.response?.data?.message || "Lỗi khi cập nhật danh mục",
        icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          Chỉnh sửa danh mục
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="category_name"
            label="Tên danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              {
                min: 2,
                message: "Tên danh mục phải có ít nhất 2 ký tự",
              },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Cập nhật
              </Button>
              <Button onClick={() => navigate("/admin/categories")}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCategory;
