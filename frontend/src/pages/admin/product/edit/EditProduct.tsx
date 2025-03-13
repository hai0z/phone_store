import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  message,
  DatePicker,
  Alert,
  Spin,
} from "antd";
import {
  SaveOutlined,
  InfoCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Brand, Category } from "../../../../types";
import CustomCKEditor from "../../../../components/editor/CKEditor";
import AddProductStep from "../../../../components/product/AddProductStep";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [specs, setSpecs] = useState("");

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      return response.data;
    },
  });

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

  React.useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        release_date: dayjs(product.release_date),
      });
      setArticle(JSON.parse(product.article || ""));
      setSpecs(JSON.parse(product.specs || ""));
    }
  }, [product, form]);

  const [activeTab, setActiveTab] = useState("1");

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        article: JSON.stringify(article),
        specs: JSON.stringify(specs),
      };

      await axios.put(`http://localhost:8080/api/v1/products/${id}`, formData);

      messageApi.success(
        {
          content: "Cập nhật sản phẩm thành công",
          icon: <InfoCircleOutlined style={{ color: "#52c41a" }} />,
        },
        1,
        () => {
          navigate("/admin/products");
        }
      );
    } catch (error) {
      messageApi.error({
        content: "Có lỗi xảy ra khi cập nhật sản phẩm",
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
            description="Vui lòng cập nhật thông tin cơ bản của sản phẩm"
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
                  size="large"
                  placeholder="Chọn ngày ra mắt"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FileTextOutlined /> Bài viết
        </span>
      ),
      children: (
        <>
          <Alert
            message="Bài viết giới thiệu sản phẩm"
            description="Viết bài giới thiệu chi tiết về sản phẩm"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <CustomCKEditor data={article} onChange={setArticle} />
        </>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <ToolOutlined /> Thông số kỹ thuật
        </span>
      ),
      children: (
        <>
          <Alert
            message="Thông số kỹ thuật"
            description="Nhập thông số kỹ thuật chi tiết của sản phẩm"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <CustomCKEditor data={specs} onChange={setSpecs} />
        </>
      ),
    },
  ];

  if (loadingProduct || loadingCategories || loadingBrands) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Chỉnh sửa sản phẩm
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => form.submit()}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Space>

          <AddProductStep current={0} />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              style={{ marginTop: 24 }}
            />
          </Form>
        </Space>
      </Card>
    </>
  );
};

export default EditProduct;
