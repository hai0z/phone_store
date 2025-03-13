import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Divider,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  message,
  DatePicker,
  Alert,
} from "antd";
import {
  SaveOutlined,
  InfoCircleOutlined,
  TagOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Brand, Category } from "../../../../types";
import CustomCKEditor from "../../../../components/editor/CKEditor";
import AddProductStep from "../../../../components/product/AddProductStep";

const { Title, Text } = Typography;
const { Option } = Select;

const AddProduct: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [specs, setSpecs] = useState("");

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      return response.data;
    },
  });

  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async (): Promise<Brand[]> => {
      const response = await axios.get("http://localhost:8080/api/v1/brands");
      return response.data;
    },
  });

  const [activeTab, setActiveTab] = useState("1");

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        article: JSON.stringify(article),
        specs: JSON.stringify(specs),
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/products",
        {
          product: formData,
        }
      );

      messageApi.success({
        content: "Thêm sản phẩm thành công",
        icon: <InfoCircleOutlined style={{ color: "#52c41a" }} />,
        duration: 1,
        onClose: () => {
          navigate(
            `/admin/products/add/product-color-image/${response.data.product_id}`
          );
        },
      });
    } catch (error) {
      messageApi.error({
        content: "Có lỗi xảy ra khi thêm sản phẩm",
        icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <TagOutlined /> Thông tin cơ bản
        </span>
      ),
      children: (
        <>
          <Alert
            message="Thông tin sản phẩm"
            description="Vui lòng điền đầy đủ các thông tin cơ bản của sản phẩm"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="product_name"
                label={<Text strong>Tên sản phẩm</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input
                  placeholder="Nhập tên sản phẩm"
                  size="large"
                  prefix={<TagOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand_id"
                label={<Text strong>Thương hiệu</Text>}
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select
                  placeholder="Chọn thương hiệu"
                  size="large"
                  loading={loadingBrands}
                  showSearch
                  optionFilterProp="children"
                >
                  {brands?.map((brand) => (
                    <Option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label={<Text strong>Danh mục</Text>}
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  size="large"
                  loading={loadingCategories}
                  showSearch
                  optionFilterProp="children"
                >
                  {categories?.map((category) => (
                    <Option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="release_date"
                label={<Text strong>Ngày ra mắt</Text>}
                rules={[
                  { required: true, message: "Vui lòng chọn ngày ra mắt" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày ra mắt"
                  size="large"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Space>
              <FileTextOutlined />
              <Text strong>Nội dung chi tiết</Text>
            </Space>
          </Divider>

          <Form.Item
            name="article"
            label={<Text strong>Bài viết</Text>}
            tooltip="Nội dung bài viết mô tả chi tiết về sản phẩm"
          >
            <CustomCKEditor
              data={article}
              onChange={(data) => setArticle(data)}
            />
          </Form.Item>

          <Form.Item
            name="specs"
            label={<Text strong>Thông số kỹ thuật</Text>}
            tooltip="Các thông số kỹ thuật chi tiết của sản phẩm"
          >
            <CustomCKEditor data={specs} onChange={(data) => setSpecs(data)} />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <AddProductStep current={0} />
      <Card
        title={
          <Space>
            <ToolOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Thêm sản phẩm mới
            </Title>
          </Space>
        }
        style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: 24 }}
            type="card"
          />

          <Divider />

          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Lưu sản phẩm
              </Button>
              <Button onClick={() => navigate("/admin/products")} size="large">
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
