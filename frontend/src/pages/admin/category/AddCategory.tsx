import React, { useState } from "react";
import { Form, Input, Button, Card, message, Upload, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import axios from "axios";

const { Title } = Typography;

const AddCategory: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Preview image states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category_name", values.category_name);
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.post("http://localhost:8080/api/v1/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      messageApi.success({
        content: "Category added successfully",
        icon: <InfoCircleOutlined style={{ color: "#52c41a" }} />,
      });
      navigate("/admin/categories");
    } catch (error: any) {
      messageApi.error({
        content: error.response?.data?.message || "Error adding category",
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
          Add New Category
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="category_name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
              { min: 2, message: "Category name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Category Image"
            rules={[{ required: true, message: "Please upload a category image" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Category
              </Button>
              <Button onClick={() => navigate("/admin/categories")}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategory;