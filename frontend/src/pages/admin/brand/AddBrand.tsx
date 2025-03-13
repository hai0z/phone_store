import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Space,
  message,
  Typography,
  Modal,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const AddBrand: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

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
      <div style={{ marginTop: 8 }}>Tải lên</div>
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

      await axios.post("http://localhost:8080/api/v1/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      messageApi.success("Thêm thương hiệu thành công", 1, () => {
        navigate("/admin/brands");
      });
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Lỗi khi thêm thương hiệu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          Thêm thương hiệu mới
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="brand_name"
            label="Tên thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
              { min: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Logo thương hiệu"
            rules={[
              { required: true, message: "Vui lòng tải lên logo thương hiệu" },
            ]}
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
                Lưu thương hiệu
              </Button>
              <Button onClick={() => navigate("/admin/brands")}>Hủy</Button>
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
        <img alt="Xem trước" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AddBrand;
