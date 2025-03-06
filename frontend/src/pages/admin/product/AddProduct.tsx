import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  Card,
  Divider,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  message,
  DatePicker,
  Modal,
  ColorPicker,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

interface Color {
  color_id: number;
  color_name: string;
  hex: string;
}

interface Storage {
  storage_id: number;
  storage_capacity: string;
}

interface ProductVariant {
  color_id: number;
  storage_id: number;
  original_price: number;
  sale_price: number;
  promotional_price?: number;
  promotion_start?: string;
  promotion_end?: string;
  stock: number;
  images: UploadFile[];
}

const AddProduct: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [storages, setStorages] = useState<Storage[]>([]);
  const [activeTab, setActiveTab] = useState("1");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  // State cho modal màu sắc
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [colorForm] = Form.useForm();
  const [colorHex, setColorHex] = useState<string>("#1677FF");

  // Lấy tất cả dữ liệu cần thiết khi component được tải
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API
        // Hiện tại, chúng ta sử dụng dữ liệu mẫu
        setBrands([
          { brand_id: 1, brand_name: "Apple" },
          { brand_id: 2, brand_name: "Samsung" },
          { brand_id: 3, brand_name: "Xiaomi" },
        ]);

        setCategories([
          { category_id: 1, category_name: "Điện thoại thông minh" },
          { category_id: 2, category_name: "Máy tính bảng" },
        ]);

        setColors([
          { color_id: 1, color_name: "Đen", hex: "#000000" },
          { color_id: 2, color_name: "Trắng", hex: "#FFFFFF" },
          { color_id: 3, color_name: "Xanh dương", hex: "#0000FF" },
        ]);

        setStorages([
          { storage_id: 1, storage_capacity: "64GB" },
          { storage_id: 2, storage_capacity: "128GB" },
          { storage_id: 3, storage_capacity: "256GB" },
          { storage_id: 4, storage_capacity: "512GB" },
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Không thể tải dữ liệu cần thiết");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("Giá trị đã gửi:", values);
      // Ở đây bạn sẽ gửi dữ liệu đến API
      // const response = await axios.post('/api/products', values);

      message.success("Thêm sản phẩm thành công");
      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Không thể thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem trước hình ảnh
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

  const handleCancel = () => setPreviewOpen(false);

  // Xử lý modal màu sắc
  const showColorModal = () => {
    setColorModalVisible(true);
    colorForm.resetFields();
    setColorHex("#1677FF");
  };

  const handleColorCancel = () => {
    setColorModalVisible(false);
  };

  const handleColorSubmit = () => {
    colorForm
      .validateFields()
      .then((values) => {
        // Tạo ID mới dựa trên ID cao nhất hiện có
        const newColorId =
          colors.length > 0
            ? Math.max(...colors.map((c) => c.color_id)) + 1
            : 1;

        const newColor: Color = {
          color_id: newColorId,
          color_name: values.color_name,
          hex: colorHex,
        };

        setColors([...colors, newColor]);
        setColorModalVisible(false);
        message.success(`Đã thêm màu ${values.color_name} thành công`);
      })
      .catch((error) => {
        console.error("Xác thực thất bại:", error);
      });
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Cấu hình thuộc tính upload
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} không phải là file hình ảnh`);
      }
      return isImage || Upload.LIST_IGNORE;
    },
    listType: "picture-card",
    onPreview: handlePreview,
  };

  const tabItems = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product_name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand_id"
                label="Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select placeholder="Chọn thương hiệu">
                  {brands.map((brand) => (
                    <Option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
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
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="colors_with_images"
                label="Màu sắc và hình ảnh"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng thêm ít nhất một màu sắc và hình ảnh",
                  },
                ]}
              >
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="dashed"
                    onClick={showColorModal}
                    icon={<PlusOutlined />}
                  >
                    Thêm màu sắc mới
                  </Button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {colors.map((color) => (
                    <Card
                      key={color.color_id}
                      size="small"
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: color.hex,
                                border: "1px solid #d9d9d9",
                                borderRadius: "2px",
                              }}
                            />
                            <span>{color.color_name}</span>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              setColors(
                                colors.filter(
                                  (c) => c.color_id !== color.color_id
                                )
                              );
                              messageApi.success(
                                `Đã xóa màu ${color.color_name}`
                              );
                            }}
                          />
                        </div>
                      }
                      style={{ width: 300 }}
                    >
                      <Form.Item
                        name={["color_images", color.color_id]}
                        noStyle
                      >
                        <Upload {...uploadProps} maxCount={5}>
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Card>
                  ))}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item name="specs" label="Thông số kỹ thuật">
            <Card>
              <Collapse defaultActiveKey={["configuration_and_storage"]}>
                <Collapse.Panel
                  header="Cấu hình & Bộ nhớ"
                  key="configuration_and_storage"
                >
                  <Form.Item
                    name={[
                      "specs",
                      "configuration_and_storage",
                      "operating_system",
                    ]}
                    label="Hệ điều hành"
                  >
                    <Input placeholder="Nhập hệ điều hành" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "cpu"]}
                    label="CPU"
                  >
                    <Input placeholder="Nhập thông tin CPU" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "cpu_speed"]}
                    label="Tốc độ CPU"
                  >
                    <Input placeholder="Nhập tốc độ CPU" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "gpu"]}
                    label="GPU"
                  >
                    <Input placeholder="Nhập thông tin GPU" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "ram"]}
                    label="RAM"
                  >
                    <Input placeholder="Nhập dung lượng RAM" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "storage"]}
                    label="Bộ nhớ"
                  >
                    <Input placeholder="Nhập dung lượng bộ nhớ" />
                  </Form.Item>
                  <Form.Item
                    name={[
                      "specs",
                      "configuration_and_storage",
                      "available_storage",
                    ]}
                    label="Bộ nhớ khả dụng"
                  >
                    <Input placeholder="Nhập bộ nhớ khả dụng" />
                  </Form.Item>
                  <Form.Item
                    name={["specs", "configuration_and_storage", "contacts"]}
                    label="Danh bạ"
                  >
                    <Input placeholder="Nhập dung lượng danh bạ" />
                  </Form.Item>
                </Collapse.Panel>

                <Collapse.Panel
                  header="Camera & Màn hình"
                  key="camera_and_display"
                >
                  <Form.Item label="Độ phân giải camera sau">
                    <Input.Group>
                      <Form.Item
                        name={[
                          "specs",
                          "camera_and_display",
                          "rear_camera_resolution",
                          "main",
                        ]}
                        label="Chính"
                      >
                        <Input placeholder="Nhập độ phân giải camera chính" />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "specs",
                          "camera_and_display",
                          "rear_camera_resolution",
                          "sub",
                        ]}
                        label="Phụ"
                      >
                        <Input placeholder="Nhập độ phân giải camera phụ" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>

                  <Form.List
                    name={["specs", "camera_and_display", "rear_camera_video"]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Video camera sau" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập định dạng video hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Định dạng video"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm định dạng video
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    name={["specs", "camera_and_display", "rear_camera_flash"]}
                    label="Đèn flash camera sau"
                  >
                    <Input placeholder="Nhập thông tin đèn flash camera sau" />
                  </Form.Item>

                  <Form.List
                    name={[
                      "specs",
                      "camera_and_display",
                      "rear_camera_features",
                    ]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Tính năng camera sau" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập tính năng hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Tính năng"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm tính năng
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    name={[
                      "specs",
                      "camera_and_display",
                      "front_camera_resolution",
                    ]}
                    label="Độ phân giải camera trước"
                  >
                    <Input placeholder="Nhập độ phân giải camera trước" />
                  </Form.Item>

                  <Form.List
                    name={[
                      "specs",
                      "camera_and_display",
                      "front_camera_features",
                    ]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Tính năng camera trước" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập tính năng hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Tính năng"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm tính năng
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    name={["specs", "camera_and_display", "display_technology"]}
                    label="Công nghệ màn hình"
                  >
                    <Input placeholder="Nhập công nghệ màn hình" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "camera_and_display", "display_resolution"]}
                    label="Độ phân giải màn hình"
                  >
                    <Input placeholder="Nhập độ phân giải màn hình" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "camera_and_display", "display_size"]}
                    label="Kích thước màn hình"
                  >
                    <Input placeholder="Nhập kích thước màn hình" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "camera_and_display", "refresh_rate"]}
                    label="Tần số quét"
                  >
                    <Input placeholder="Nhập tần số quét" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "camera_and_display", "max_brightness"]}
                    label="Độ sáng tối đa"
                  >
                    <Input placeholder="Nhập độ sáng tối đa" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "camera_and_display", "display_glass"]}
                    label="Kính màn hình"
                  >
                    <Input placeholder="Nhập loại kính màn hình" />
                  </Form.Item>
                </Collapse.Panel>

                <Collapse.Panel header="Pin & Sạc" key="battery_and_charging">
                  <Form.Item
                    name={["specs", "battery_and_charging", "battery_capacity"]}
                    label="Dung lượng pin"
                  >
                    <Input placeholder="Nhập dung lượng pin" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "battery_and_charging", "battery_type"]}
                    label="Loại pin"
                  >
                    <Input placeholder="Nhập loại pin" />
                  </Form.Item>

                  <Form.Item
                    name={[
                      "specs",
                      "battery_and_charging",
                      "max_charging_support",
                    ]}
                    label="Hỗ trợ sạc tối đa"
                  >
                    <Input placeholder="Nhập công suất sạc tối đa" />
                  </Form.Item>

                  <Form.List
                    name={["specs", "battery_and_charging", "battery_features"]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Tính năng pin" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập tính năng hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Tính năng"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm tính năng
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Collapse.Panel>

                <Collapse.Panel header="Tính năng" key="features">
                  <Form.Item
                    name={["specs", "features", "advanced_security"]}
                    label="Bảo mật nâng cao"
                  >
                    <Input placeholder="Nhập tính năng bảo mật nâng cao" />
                  </Form.Item>

                  <Form.List name={["specs", "features", "special_features"]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Tính năng đặc biệt" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập tính năng hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Tính năng"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm tính năng
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    name={["specs", "features", "water_dust_resistance"]}
                    label="Chống nước/bụi"
                  >
                    <Input placeholder="Nhập chỉ số chống nước/bụi" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "features", "recording"]}
                    label="Ghi âm"
                  >
                    <Input placeholder="Nhập khả năng ghi âm" />
                  </Form.Item>

                  <Form.List name={["specs", "features", "video_playback"]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "Phát lại video" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập định dạng hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Định dạng"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm định dạng
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Collapse.Panel>

                <Collapse.Panel header="Kết nối" key="connectivity">
                  <Form.Item
                    name={["specs", "connectivity", "mobile_network"]}
                    label="Mạng di động"
                  >
                    <Input placeholder="Nhập hỗ trợ mạng di động" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "connectivity", "sim"]}
                    label="SIM"
                  >
                    <Input placeholder="Nhập thông tin SIM" />
                  </Form.Item>

                  <Form.List name={["specs", "connectivity", "wifi"]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "WiFi" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập chuẩn WiFi hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Chuẩn WiFi"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm chuẩn WiFi
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.List name={["specs", "connectivity", "gps"]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? "GPS" : ""}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Vui lòng nhập loại GPS hoặc xóa trường này",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Loại GPS"
                                style={{ width: "85%" }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ marginLeft: 8 }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm loại GPS
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    name={["specs", "connectivity", "bluetooth"]}
                    label="Bluetooth"
                  >
                    <Input placeholder="Nhập phiên bản Bluetooth" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "connectivity", "charging_port"]}
                    label="Charging Port"
                  >
                    <Input placeholder="Enter charging port type" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "connectivity", "headphone_jack"]}
                    label="Headphone Jack"
                  >
                    <Input placeholder="Enter headphone jack type" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "connectivity", "other_connections"]}
                    label="Other Connections"
                  >
                    <Input placeholder="Enter other connection types" />
                  </Form.Item>
                </Collapse.Panel>

                <Collapse.Panel
                  header="Thiết kế & Chất liệu"
                  key="design_and_material"
                >
                  <Form.Item
                    name={["specs", "design_and_material", "design"]}
                    label="Design"
                  >
                    <Input placeholder="Enter design type" />
                  </Form.Item>

                  <Form.Item
                    name={["specs", "design_and_material", "material"]}
                    label="Material"
                  >
                    <Input placeholder="Enter material details" />
                  </Form.Item>

                  <Form.Item label="Dimensions">
                    <Input.Group>
                      <Form.Item
                        name={[
                          "specs",
                          "design_and_material",
                          "dimensions",
                          "length",
                        ]}
                        label="Length"
                      >
                        <Input placeholder="Enter length" />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "specs",
                          "design_and_material",
                          "dimensions",
                          "width",
                        ]}
                        label="Width"
                      >
                        <Input placeholder="Enter width" />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "specs",
                          "design_and_material",
                          "dimensions",
                          "thickness",
                        ]}
                        label="Thickness"
                      >
                        <Input placeholder="Enter thickness" />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "specs",
                          "design_and_material",
                          "dimensions",
                          "weight",
                        ]}
                        label="Weight"
                      >
                        <Input placeholder="Enter weight" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            </Card>
          </Form.Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Phiên bản & Giá",
      children: (
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  title={`Phiên bản ${name + 1}`}
                  extra={
                    <Button
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "color_id"]}
                        label="Color"
                        rules={[
                          { required: true, message: "Please select color" },
                        ]}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Select
                            placeholder="Select color"
                            style={{ flex: 1 }}
                            dropdownRender={(menu) => <>{menu}</>}
                          >
                            {colors.map((color) => (
                              <Option
                                key={color.color_id}
                                value={color.color_id}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 16,
                                      height: 16,
                                      backgroundColor: color.hex,
                                      marginRight: 8,
                                      border: "1px solid #d9d9d9",
                                    }}
                                  />
                                  {color.color_name}
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "storage_id"]}
                        label="Storage"
                        rules={[
                          { required: true, message: "Please select storage" },
                        ]}
                      >
                        <Select placeholder="Select storage">
                          {storages.map((storage) => (
                            <Option
                              key={storage.storage_id}
                              value={storage.storage_id}
                            >
                              {storage.storage_capacity}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "original_price"]}
                        label="Original Price"
                        rules={[
                          { required: true, message: "Please enter price" },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "sale_price"]}
                        label="Sale Price"
                        rules={[
                          {
                            required: true,
                            message: "Please enter sale price",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        label="Stock"
                        rules={[
                          { required: true, message: "Please enter stock" },
                        ]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "promotional_price"]}
                        label="Promotional Price (Optional)"
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "promotion_start"]}
                        label="Promotion Start"
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "promotion_end"]}
                        label="Promotion End"
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm phiên bản
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Thêm sản phẩm mới
            </Title>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ variants: [{}] }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: 24 }}
          />

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Product
              </Button>
              <Button onClick={() => navigate("/admin/products")}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Image preview modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      {/* Add new color modal */}
      <Modal
        open={colorModalVisible}
        title="Add New Color"
        onCancel={handleColorCancel}
        onOk={handleColorSubmit}
        okText="Add Color"
      >
        <Form form={colorForm} layout="vertical">
          <Form.Item
            name="color_name"
            label="Color Name"
            rules={[{ required: true, message: "Please enter color name" }]}
          >
            <Input placeholder="Enter color name (e.g. Ruby Red)" />
          </Form.Item>

          <Form.Item label="Color">
            <ColorPicker
              value={colorHex}
              onChange={(color) => setColorHex(color.toHexString())}
              showText
            />
          </Form.Item>

          <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: colorHex,
                marginRight: 12,
                border: "1px solid #d9d9d9",
                borderRadius: 4,
              }}
            />
            <div>
              <div>Preview</div>
              <div style={{ fontSize: 12, color: "#666" }}>{colorHex}</div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AddProduct;
