import { useEffect, useState } from "react";
import { Result, Button, Typography, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import axios from "axios";
import { useCartStore } from "../../../store/cartStore";

const { Title, Text } = Typography;

const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "error">("success");
  const [message, setMessage] = useState("");

  const type = searchParams.get("type");

  const { clearOrder, removeItem, order } = useCartStore();

  useEffect(() => {
    if (type === "vnpay") {
      // Check VNPay payment result
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

      const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");

      const vnp_TxnRef = searchParams.get("vnp_TxnRef");

      if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
        setStatus("success");
        setMessage("Thanh toán thành công qua VNPay!");
        clearOrder();
        order?.items.forEach((item) => {
          removeItem(item.variant_id);
        });
      } else if (vnp_ResponseCode) {
        setStatus("error");
        setMessage("Thanh toán qua VNPay thất bại!");
      }

      // Check normal order success
      const orderSuccess = searchParams.get("success");
      if (orderSuccess === "true") {
        setStatus("success");
        setMessage("Đặt hàng thành công!");
      } else if (orderSuccess === "false") {
        axios.patch(
          `http://localhost:8080/api/v1/orders/${vnp_TxnRef}/status`,
          {
            status: "da_huy",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStatus("error");
        setMessage("Đặt hàng thất bại!");
      }
    } else if (type === "normal") {
      setStatus("success");
      setMessage("Đặt hàng thành công!");
    }
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Result
        status={status}
        icon={status === "success" ? <SmileOutlined /> : <FrownOutlined />}
        title={
          <Title level={2}>
            {status === "success" ? "Thành Công!" : "Thất Bại!"}
          </Title>
        }
        subTitle={
          <Space
            direction="vertical"
            size="large"
            style={{ textAlign: "center" }}
          >
            <Text style={{ fontSize: 18 }}>{message}</Text>
            {status === "success" && (
              <Text type="secondary">
                Cảm ơn bạn đã mua hàng! Chúng tôi sẽ xử lý đơn hàng của bạn
                trong thời gian sớm nhất.
              </Text>
            )}
          </Space>
        }
        extra={[
          <Button
            type="primary"
            key="console"
            size="large"
            onClick={() => navigate("/profile?tab=2")}
          >
            Xem Đơn Hàng
          </Button>,
          <Button key="buy" size="large" onClick={() => navigate("/")}>
            Tiếp Tục Mua Sắm
          </Button>,
        ]}
      />
    </div>
  );
};

export default CheckoutResult;
