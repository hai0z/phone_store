import React, { useState } from "react";
import {
  Form,
  Card,
  Button,
  Typography,
  Switch,
  DatePicker,
  message,
  Space,
  Upload,
  Input,
  Divider,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface BannerFormValues {
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

interface BannerImageFormValues {
  banner_id: number;
  title: string;
  description?: string;
  link_url?: string;
  position: number;
  image_url: string;
}

interface BannerImageItem {
  file: UploadFile;
  values: {
    title: string;
    description?: string;
    link_url?: string;
    position: number;
  };
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddBanner: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imageList, setImageList] = useState<BannerImageItem[]>([]);

  // Create banner mutation
  const createBannerMutation = useMutation({
    mutationFn: (data: BannerFormValues) =>
      axios.post("http://localhost:8080/api/v1/banners", data),
    onSuccess: (response) => {
      messageApi.success("Banner đã được tạo thành công");
      const bannerId = response.data.banner_id;

      // If there are images, upload them
      if (imageList.length > 0) {
        uploadBannerImages(bannerId);
      } else {
        navigate("/admin/banners");
      }
    },
    onError: (error) => {
      setLoading(false);
      messageApi.error("Có lỗi xảy ra khi tạo banner");
      console.error(error);
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post("http://localhost:8080/api/v1/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });

  // Add banner image mutation
  const addBannerImageMutation = useMutation({
    mutationFn: (data: BannerImageFormValues) =>
      axios.post("http://localhost:8080/api/v1/banners/images", data),
  });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleAddImage = async () => {
    const values = form.getFieldsValue([
      "imgTitle",
      "imgDescription",
      "imgLink",
      "imgPosition",
    ]);

    if (!values.imgTitle || fileList.length === 0) {
      messageApi.error("Vui lòng nhập tiêu đề và chọn ảnh");
      return;
    }

    try {
      // Get base64 preview for display
      const preview = await getBase64(fileList[0].originFileObj as RcFile);

      setImageList([
        ...imageList,
        {
          file: { ...fileList[0], preview },
          values: {
            title: values.imgTitle,
            description: values.imgDescription,
            link_url: values.imgLink,
            position: values.imgPosition || imageList.length + 1,
          },
        },
      ]);

      // Reset form fields and file list
      form.setFieldsValue({
        imgTitle: "",
        imgDescription: "",
        imgLink: "",
        imgPosition: imageList.length + 2, // Update to next position
      });
      setFileList([]);
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi xử lý ảnh");
      console.error(error);
    }
  };

  const removeImage = (index: number) => {
    const newImageList = [...imageList];
    newImageList.splice(index, 1);

    // Update positions for remaining images
    const updatedList = newImageList.map((item, idx) => ({
      ...item,
      values: {
        ...item.values,
        position: idx + 1,
      },
    }));

    setImageList(updatedList);

    // Update next position in form
    form.setFieldsValue({
      imgPosition: updatedList.length + 1,
    });
  };

  // Upload banner images
  const uploadBannerImages = async (bannerId: number) => {
    try {
      setLoading(true);
      let successCount = 0;

      // Upload each image and add to banner
      for (let i = 0; i < imageList.length; i++) {
        const item = imageList[i];
        try {
          const formData = new FormData();
          formData.append("image", item.file.originFileObj as RcFile);

          const uploadResponse = await uploadImageMutation.mutateAsync(
            formData
          );
          const imageUrl = uploadResponse.data.url;

          await addBannerImageMutation.mutateAsync({
            banner_id: bannerId,
            image_url: imageUrl,
            title: item.values.title,
            description: item.values.description,
            link_url: item.values.link_url,
            position: item.values.position,
          });

          successCount++;
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error);
          // Continue with the next image even if this one fails
        }
      }

      setLoading(false);

      if (successCount === 0) {
        messageApi.error("Không thể tải lên ảnh nào. Vui lòng kiểm tra lại.");
      } else if (successCount < imageList.length) {
        messageApi.warning(
          `Đã tải lên ${successCount}/${imageList.length} ảnh. Một số ảnh bị lỗi.`
        );
        navigate("/admin/banners");
      } else {
        messageApi.success("Tất cả ảnh đã được tải lên thành công");
        navigate("/admin/banners");
      }
    } catch (error) {
      setLoading(false);
      messageApi.error("Có lỗi xảy ra khi tải ảnh lên");
      console.error(error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    let dateRange = null;
    if (values.date_range && values.date_range.length === 2) {
      dateRange = {
        start_date: values.date_range[0].toISOString(),
        end_date: values.date_range[1].toISOString(),
      };
    }

    const bannerData: BannerFormValues = {
      is_active: values.is_active,
      start_date: dateRange ? dateRange.start_date : null,
      end_date: dateRange ? dateRange.end_date : null,
    };

    createBannerMutation.mutate(bannerData);
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Title level={3}>Thêm Banner mới</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            is_active: true,
            imgPosition: 1,
          }}
        >
          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="date_range"
            label="Thời gian hiển thị"
            help="Để trống nếu không giới hạn thời gian hiển thị"
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Divider>Thêm hình ảnh cho banner</Divider>

          <div style={{ marginBottom: "20px" }}>
            <Title level={5}>Danh sách ảnh ({imageList.length})</Title>
            {imageList.map((item, index) => (
              <Card
                size="small"
                key={index}
                style={{ marginTop: "10px" }}
                extra={
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeImage(index)}
                  >
                    Xóa
                  </Button>
                }
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item.file.preview as string}
                    alt={item.values.title}
                    style={{
                      width: "100px",
                      height: "60px",
                      objectFit: "cover",
                      marginRight: "12px",
                    }}
                  />
                  <div>
                    <div>
                      <strong>Tiêu đề:</strong> {item.values.title}
                    </div>
                    {item.values.description && (
                      <div>
                        <strong>Mô tả:</strong> {item.values.description}
                      </div>
                    )}
                    {item.values.link_url && (
                      <div>
                        <strong>Đường dẫn:</strong> {item.values.link_url}
                      </div>
                    )}
                    <div>
                      <strong>Vị trí:</strong> {item.values.position}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Form.Item name="imgTitle" label="Tiêu đề ảnh">
            <Input placeholder="Nhập tiêu đề cho ảnh" />
          </Form.Item>

          <Form.Item name="imgDescription" label="Mô tả ảnh">
            <TextArea rows={2} placeholder="Nhập mô tả cho ảnh (nếu có)" />
          </Form.Item>

          <Form.Item name="imgLink" label="Đường dẫn khi click vào ảnh">
            <Input placeholder="Nhập đường dẫn (nếu có)" />
          </Form.Item>

          <Form.Item name="imgPosition" label="Vị trí hiển thị">
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item label="Tải ảnh lên">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddImage}
              disabled={fileList.length === 0}
              style={{ marginTop: "10px" }}
            >
              Thêm ảnh vào danh sách
            </Button>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={imageList.length === 0}
              >
                Lưu Banner
              </Button>
              <Button onClick={() => navigate("/admin/banners")}>Hủy</Button>
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
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AddBanner;
