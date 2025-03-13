import {
  Table,
  Space,
  Button,
  Image,
  Popconfirm,
  message,
  Input,
  Typography,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Title, Text } = Typography;

interface Brand {
  brand_id: number;
  brand_name: string;
  image_url?: string;
}

const BrandList = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: brands,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/v1/brands");
      return response.data;
    },
  });

  const handleDelete = async (brandId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/brands/${brandId}`);
      refetch();
      messageApi.success("Xóa thương hiệu thành công");
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Lỗi khi xóa thương hiệu"
      );
    }
  };

  const handleTableChange: TableProps<Brand>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Table params:", { pagination, filters, sorter });
  };

  const columns: ColumnsType<Brand> = [
    {
      title: "ID",
      dataIndex: "brand_id",
      key: "brand_id",
      sorter: (a, b) => a.brand_id - b.brand_id,
      render: (id) => <Text strong>#{id.toString().padStart(3, "0")}</Text>,
    },
    {
      title: "Logo",
      key: "image",
      render: (_, record) => (
        <Image
          width={60}
          height={60}
          src={record.image_url}
          alt={record.brand_name}
          fallback="https://www.mangobeds.com/images/image-fallback.jpg"
          style={{ objectFit: "contain", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "brand_name",
      key: "brand_name",
      sorter: (a, b) => a.brand_name.localeCompare(b.brand_name),
      render: (text) => (
        <Space>
          <TagOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm thương hiệu"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.brand_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/brands/edit/${record.brand_id}`)}
          />
          <Popconfirm
            title="Xóa thương hiệu"
            description="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(record.brand_id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card style={{ borderRadius: "8px" }}>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <TagOutlined style={{ marginRight: "8px" }} />
            Quản lý thương hiệu
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/brands/add")}
          >
            Thêm thương hiệu mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={brands}
          rowKey="brand_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} thương hiệu`,
          }}
          onChange={handleTableChange}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default BrandList;
