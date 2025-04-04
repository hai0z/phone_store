import React, { useState, useEffect } from "react";
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
  Table,
  Popconfirm,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Banner {
  banner_id: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  images: BannerImage[];
}

interface BannerImage {
  image_id: number;
  banner_id: number;
  image_url: string;
  title: string;
  description: string | null;
  position: number;
  link_url: string | null;
  created_at: string;
}

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

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const EditBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bannerId = parseInt(id as string);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [imageForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [editingImage, setEditingImage] = useState<BannerImage | null>(null);

  // Fetch banner details
  const { data: banner, isLoading: isBannerLoading } = useQuery<Banner>({
    queryKey: ["banner", bannerId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/banners/${bannerId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching banner:", error);
        messageApi.error("Không thể tải thông tin banner");
        throw error;
      }
    },
    enabled: !!bannerId,
  });

  // Update banner details mutation
  const updateBannerMutation = useMutation({
    mutationFn: (data: BannerFormValues) =>
      axios.put(`http://localhost:8080/api/v1/banners/${bannerId}`, data),
    onSuccess: () => {
      messageApi.success("Banner đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra khi cập nhật banner");
      console.error("Update banner error:", error);
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
    onSuccess: () => {
      messageApi.success("Ảnh đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
      imageForm.resetFields();
      setFileList([]);
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra khi thêm ảnh");
      console.error("Add image error:", error);
    },
  });

  // Update banner image mutation
  const updateBannerImageMutation = useMutation({
    mutationFn: ({
      imageId,
      data,
    }: {
      imageId: number;
      data: Partial<BannerImageFormValues>;
    }) =>
      axios.put(`http://localhost:8080/api/v1/banners/images/${imageId}`, data),
    onSuccess: () => {
      messageApi.success("Ảnh đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
      setEditingImage(null);
      imageForm.resetFields();
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra khi cập nhật ảnh");
      console.error("Update image error:", error);
    },
  });

  // Delete banner image mutation
  const deleteBannerImageMutation = useMutation({
    mutationFn: (imageId: number) =>
      axios.delete(`http://localhost:8080/api/v1/banners/images/${imageId}`),
    onSuccess: () => {
      messageApi.success("Ảnh đã được xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra khi xóa ảnh");
      console.error("Delete image error:", error);
    },
  });

  // Set form values when banner data is loaded
  useEffect(() => {
    if (banner) {
      let dateRange = null;
      if (banner.start_date && banner.end_date) {
        dateRange = [dayjs(banner.start_date), dayjs(banner.end_date)];
      }

      form.setFieldsValue({
        is_active: banner.is_active,
        date_range: dateRange,
      });

      // Initialize image position for new images
      const nextPosition =
        banner.images && banner.images.length > 0
          ? Math.max(...banner.images.map((img) => img.position)) + 1
          : 1;

      imageForm.setFieldsValue({
        imgPosition: nextPosition,
      });
    }
  }, [banner, form, imageForm]);

  // Set form values when editing an image
  useEffect(() => {
    if (editingImage) {
      imageForm.setFieldsValue({
        imgTitle: editingImage.title,
        imgDescription: editingImage.description,
        imgLink: editingImage.link_url,
        imgPosition: editingImage.position,
      });
    } else {
      // Reset form but keep position field
      const currentPosition = imageForm.getFieldValue("imgPosition");
      imageForm.resetFields();

      // Set the next position if banner data is available
      if (banner && banner.images) {
        const positions = banner.images.map((img) => img.position);
        const nextPosition =
          positions.length > 0 ? Math.max(...positions) + 1 : 1;
        imageForm.setFieldsValue({
          imgPosition: nextPosition,
        });
      } else {
        // Restore the current position if no banner data
        imageForm.setFieldsValue({
          imgPosition: currentPosition,
        });
      }

      setFileList([]);
    }
  }, [editingImage, imageForm, banner]);

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
    try {
      const values = imageForm.getFieldsValue();

      if (!values.imgTitle || (!editingImage && fileList.length === 0)) {
        messageApi.error("Vui lòng nhập tiêu đề và chọn ảnh");
        return;
      }

      setLoading(true);

      if (editingImage) {
        // Update existing image
        await updateBannerImageMutation.mutateAsync({
          imageId: editingImage.image_id,
          data: {
            title: values.imgTitle,
            description: values.imgDescription,
            link_url: values.imgLink,
            position: values.imgPosition,
          },
        });
      } else {
        // Upload new image
        try {
          const formData = new FormData();
          formData.append("image", fileList[0].originFileObj as RcFile);

          const uploadResponse = await uploadImageMutation.mutateAsync(
            formData
          );
          const imageUrl = uploadResponse.data.url;

          await addBannerImageMutation.mutateAsync({
            banner_id: bannerId,
            image_url: imageUrl,
            title: values.imgTitle,
            description: values.imgDescription,
            link_url: values.imgLink,
            position: values.imgPosition || (banner?.images?.length || 0) + 1,
          });

          // Update next position for convenience
          if (banner?.images) {
            const positions = banner.images.map((img) => img.position);
            const nextPosition =
              positions.length > 0
                ? Math.max(...positions, values.imgPosition || 0) + 1
                : 1;

            imageForm.setFieldsValue({
              imgPosition: nextPosition,
            });
          } else {
            imageForm.setFieldsValue({
              imgPosition: (values.imgPosition || 0) + 1,
            });
          }
        } catch (error) {
          console.error("Error in image upload process:", error);
          messageApi.error("Có lỗi xảy ra khi tải ảnh lên");
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      messageApi.error("Có lỗi xảy ra khi xử lý ảnh");
      console.error(error);
    }
  };

  const handleEditImage = (image: BannerImage) => {
    setEditingImage(image);
  };

  const handleDeleteImage = (imageId: number) => {
    deleteBannerImageMutation.mutate(imageId);
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
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

    try {
      await updateBannerMutation.mutateAsync(bannerData);
      setLoading(false);
      messageApi.success("Banner đã được cập nhật thành công");
    } catch (error) {
      setLoading(false);
      console.error(error);
      messageApi.error("Có lỗi xảy ra khi cập nhật banner");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      key: "image",
      render: (record: BannerImage) => (
        <img
          src={record.image_url}
          alt={record.title}
          style={{ width: "100px", height: "60px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "Không có mô tả",
    },
    {
      title: "Đường dẫn",
      dataIndex: "link_url",
      key: "link_url",
      render: (text: string) => text || "Không có đường dẫn",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: BannerImage) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEditImage(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ảnh này?"
            onConfirm={() => handleDeleteImage(record.image_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isBannerLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        Đang tải thông tin banner...
      </div>
    );
  }

  if (!banner) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={4}>Không tìm thấy banner</Title>
        <Button
          type="primary"
          onClick={() => navigate("/admin/banners")}
          style={{ marginTop: "16px" }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card>
        <Title level={3}>Chỉnh sửa Banner</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật Banner
              </Button>
              <Button onClick={() => navigate("/admin/banners")}>
                Quay lại danh sách
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider>Quản lý ảnh banner</Divider>

        <Table
          columns={columns}
          dataSource={banner?.images || []}
          rowKey="image_id"
          pagination={false}
          style={{ marginBottom: "24px" }}
        />

        <Card
          title={editingImage ? "Cập nhật ảnh" : "Thêm ảnh mới"}
          style={{ marginTop: "16px" }}
        >
          <Form form={imageForm} layout="vertical">
            <Form.Item
              name="imgTitle"
              label="Tiêu đề ảnh"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề cho ảnh" />
            </Form.Item>

            <Form.Item name="imgDescription" label="Mô tả ảnh">
              <TextArea rows={2} placeholder="Nhập mô tả cho ảnh (nếu có)" />
            </Form.Item>

            <Form.Item name="imgLink" label="Đường dẫn khi click vào ảnh">
              <Input placeholder="Nhập đường dẫn (nếu có)" />
            </Form.Item>

            <Form.Item
              name="imgPosition"
              label="Vị trí hiển thị"
              rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>

            {!editingImage && (
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
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  onClick={handleAddImage}
                  loading={loading}
                  disabled={!editingImage && fileList.length === 0}
                >
                  {editingImage ? "Cập nhật" : "Thêm ảnh"}
                </Button>
                {editingImage && (
                  <Button onClick={handleCancelEdit}>Hủy</Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>
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

export default EditBanner;
