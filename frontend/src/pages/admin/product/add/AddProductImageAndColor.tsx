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
  Select,
  ColorPicker,
  Divider,
  Row,
  Col,
  Descriptions,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddProductStep from "../../../../components/product/AddProductStep";
import { Color } from "../../../../types";

const { Title } = Typography;
const { Option } = Select;

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  brand: {
    brand_name: string;
  };
  category: {
    category_name: string;
  };
}

interface ColorFile {
  colorId: number;
  files: UploadFile[];
}

const AddProductImageAndColor: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#1677ff");
  const [fileList, setFileList] = useState<ColorFile[]>([]);

  // Trạng thái xem trước ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { data: colors, refetch: refetchColors } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/colors");
      return response.data;
    },
  });

  const { data: product } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${Number(id)}`
      );
      return response.data;
    },
  });

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

  const handleChange = (
    colorId: number,
    { fileList: newFileList }: { fileList: UploadFile[] }
  ) => {
    setFileList((prev) => {
      const colorFileIndex = prev.findIndex((cf) => cf.colorId === colorId);
      if (colorFileIndex >= 0) {
        const newState = [...prev];
        newState[colorFileIndex] = { colorId, files: newFileList };
        return newState;
      }
      return [...prev, { colorId, files: newFileList }];
    });
  };

  const handleColorSelect = (values: number[]) => {
    setSelectedColors(values);
    // Thêm màu mới vào fileList nếu chưa tồn tại
    values.forEach((colorId) => {
      if (!fileList.find((cf) => cf.colorId === colorId)) {
        setFileList((prev) => [...prev, { colorId, files: [] }]);
      }
    });
    // Xóa màu khỏi fileList nếu không còn được chọn
    setFileList((prev) => prev.filter((cf) => values.includes(cf.colorId)));
  };

  const handleAddNewColor = async () => {
    try {
      await axios.post("http://localhost:8080/api/v1/colors", {
        color_name: newColorName,
        hex: newColorHex,
      });
      messageApi.success("Thêm màu thành công");
      refetchColors();
      setNewColorName("");
      setNewColorHex("#1677ff");
    } catch (error) {
      messageApi.error("Không thể thêm màu mới" + error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const onFinish = async () => {
    try {
      for (let i = 0; i < fileList.length; i++) {
        const colorId = fileList[i].colorId;
        const formData = new FormData();

        formData.append("color_id", colorId.toString());

        for (let j = 0; j < fileList[i].files.length; j++) {
          const file = fileList[i].files[j];
          formData.append("image", file.originFileObj as Blob);
        }
        await axios.post(
          `http://localhost:8080/api/v1/products/${id}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      messageApi.success("Tải ảnh lên thành công", 1, () => {
        navigate(`/admin/products/add/product-variants/${id}`);
      });
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <AddProductStep current={1} />
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          Thêm Ảnh và Màu Sắc Sản Phẩm
        </Title>

        <Descriptions
          title="Thông Tin Sản Phẩm"
          bordered
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Tên Sản Phẩm">
            {product?.product_name}
          </Descriptions.Item>
          <Descriptions.Item label="Thương Hiệu">
            {product?.brand.brand_name}
          </Descriptions.Item>
          <Descriptions.Item label="Danh Mục">
            {product?.category.category_name}
          </Descriptions.Item>
          <Descriptions.Item label="Mô Tả" span={3}>
            {product?.description}
          </Descriptions.Item>
        </Descriptions>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Chọn Màu Sắc có sẵn">
                <Select
                  mode="multiple"
                  placeholder="Chọn màu sắc"
                  onChange={handleColorSelect}
                  value={selectedColors}
                  style={{ width: "100%" }}
                  allowClear
                >
                  {colors?.map((color) => (
                    <Option key={color.color_id} value={color.color_id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            backgroundColor: color.hex,
                            borderRadius: 4,
                            border: "1px solid #d9d9d9",
                          }}
                        />
                        {color.color_name}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Hoặc Thêm Màu Mới</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Tên Màu">
                <Input
                  placeholder="Nhập tên màu"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Màu">
                <ColorPicker
                  value={newColorHex}
                  onChange={(color) => setNewColorHex(color.toHexString())}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  onClick={handleAddNewColor}
                  disabled={!newColorName}
                >
                  Thêm Màu Mới
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Tải Ảnh Lên</Divider>

          {fileList.map(({ colorId, files }) => {
            const color = colors?.find((c) => c.color_id === colorId);
            return (
              <Form.Item
                key={colorId}
                label={`Ảnh cho màu ${color?.color_name}`}
              >
                <Upload
                  listType="picture-card"
                  fileList={files}
                  onPreview={handlePreview}
                  onChange={(info) => handleChange(colorId, info)}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  {files.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
            );
          })}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu Ảnh
              </Button>
              <Button onClick={() => navigate(-1)}>Hủy</Button>
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

export default AddProductImageAndColor;
