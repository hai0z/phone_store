import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  message,
  Typography,
  Space,
  Modal,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const EditBrand: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Preview image states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/brands/${id}`
        );
        const brand = response.data;

        form.setFieldsValue({
          brand_name: brand.brand_name,
        });

        if (brand.image_url) {
          setFileList([
            {
              uid: brand.brand_id.toString(),
              name: brand.brand_name,
              status: "done",
              url: brand.image_url,
            },
          ]);
        }
      } catch (error: any) {
        messageApi.error(
          error.response?.data?.message || "Could not load brand information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [form, id, messageApi]);

  const handlePreview = async (file: UploadFile) => {
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
      formData.append("brand_name", values.brand_name);
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.put(`http://localhost:8080/api/v1/brands/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      messageApi.success("Brand updated successfully");
      navigate("/admin/brands");
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Error updating brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          Edit Brand
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="brand_name"
            label="Brand Name"
            rules={[
              { required: true, message: "Please enter the brand name" },
              { min: 2, message: "Brand name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item name="image" label="Brand Logo">
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
                Update Brand
              </Button>
              <Button onClick={() => navigate("/admin/brands")}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default EditBrand;
