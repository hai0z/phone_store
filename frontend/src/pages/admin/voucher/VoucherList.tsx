import {
  Table,
  Space,
  Button,
  Typography,
  Card,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Voucher } from "../../../types";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TagOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const VoucherList = () => {
  const queryClient = useQueryClient();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/vouchers");
      return response.json();
    },
  });

  const { mutate: deleteVoucher } = useMutation({
    mutationFn: async (voucherId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/vouchers/${voucherId}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      messageApi.success("Xóa voucher thành công");
    },
    onError: (error: any) => {
      messageApi.error(error.message || "Có lỗi xảy ra khi xóa voucher");
    },
  });

  // Format date for display
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Check if voucher is expired
  const isExpired = (voucher: Voucher) => {
    if (!voucher.expiry_date) return false;
    return new Date(voucher.expiry_date) < new Date();
  };

  // Check if voucher has reached max uses
  const isMaxedOut = (voucher: Voucher) => {
    if (!voucher.max_uses) return false;
    return voucher.used_count >= voucher.max_uses;
  };

  // Get voucher status
  const getVoucherStatus = (voucher: Voucher) => {
    if (isExpired(voucher)) {
      return { status: "error", text: "Hết hạn" };
    }
    if (isMaxedOut(voucher)) {
      return { status: "error", text: "Đã dùng hết" };
    }
    if (voucher.start_date && new Date(voucher.start_date) > new Date()) {
      return { status: "warning", text: "Chưa bắt đầu" };
    }
    return { status: "success", text: "Đang hoạt động" };
  };

  const columns: ColumnsType<Voucher> = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <Text strong copyable>
          {text}
        </Text>
      ),
    },
    {
      title: "Giá trị",
      key: "discount",
      render: (_, record) => (
        <Text>
          {record.discount_value.toLocaleString("vi-VN")}
          {record.discount_type === "PERCENTAGE" ? "%" : "₫"}
        </Text>
      ),
    },
    {
      title: "Loại",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (type) => (
        <Tag color={type === "PERCENTAGE" ? "blue" : "green"}>
          {type === "PERCENTAGE" ? "Phần trăm" : "Giá trị cố định"}
        </Tag>
      ),
    },
    {
      title: "Giá trị đơn tối thiểu",
      dataIndex: "min_order_value",
      key: "min_order_value",
      render: (value) => (value ? value.toLocaleString("vi-VN") + "₫" : "-"),
    },
    {
      title: "Giảm tối đa",
      key: "max_discount",
      render: (_, record) => {
        if (
          record.discount_type !== "PERCENTAGE" ||
          !record.max_discount_value
        ) {
          return "-";
        }
        return (
          <Text>{record.max_discount_value.toLocaleString("vi-VN")}₫</Text>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Số lượt sử dụng",
      key: "uses",
      render: (_, record) => (
        <Text>
          {record.used_count}/{record.max_uses || "∞"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const { status, text } = getVoucherStatus(record);
        return <Badge status={status as any} text={text} />;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/vouchers/edit/${record.voucher_id}`}>
              <Button type="primary" icon={<EditOutlined />} size="middle" />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa voucher này không?"
              onConfirm={() => deleteVoucher(record.voucher_id)}
            >
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                size="middle"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {messageContextHolder}
      <Card style={{ borderRadius: "8px", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Space align="center">
            <TagOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý voucher
            </Title>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate("/admin/vouchers/add")}
          >
            Thêm voucher mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="voucher_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} voucher`,
          }}
          bordered
          size="middle"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default VoucherList;
