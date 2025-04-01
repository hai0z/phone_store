import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Avatar,
  Badge,
  Drawer,
  Spin,
  Typography,
  Card,
  Space,
  Empty,
  message,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  CloseOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Markdown from "marked-react";

const { Text, Title } = Typography;

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBotProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ visible, setVisible }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatContext, setChatContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    const updatedContext = [...chatContext, inputValue];
    setChatContext(updatedContext);

    setInputValue("");
    setLoading(true);

    try {
      const products = await axios.get("http://localhost:8080/api/v1/products");
      const productData = products.data.map((product: any) => ({
        name: product.product_name,
        description: product.product_description,
        price: product.product_price,
        quantity: product.product_quantity,
        specs: product.specs,
        variants: product.variants,
      }));

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCy7Fihs0Iolrl8Me4YoCPw5Pr5EKlWy6Y",
        {
          contents: [
            {
              parts: [
                {
                  text: `đây là dữ liệu sản phẩm của cửa hàng tôi: ${JSON.stringify(
                    productData
                  )} học nó để trả lời câu hỏi: ${inputValue} một cách tự nhiên (k nhắc gì đến giữ liệu đã đc training này). Đây là ngữ cảnh cuộc trò chuyện trước đó: ${JSON.stringify(
                    updatedContext
                  )}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponseText = response.data.candidates[0].content.parts[0].text;

      const botResponse: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setChatContext([...updatedContext, botResponseText]);

      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      message.error("Không thể kết nối với trợ lý ảo");
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Drawer
        title={
          <Space align="center">
            <Badge status="success" dot>
              <Avatar
                icon={<RobotOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  marginRight: "10px",
                }}
                size="large"
              />
            </Badge>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Trợ lý ảo
              </Title>
              <Text type="success">Đang hoạt động</Text>
            </div>
          </Space>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={480}
        closeIcon={<CloseOutlined />}
        footer={
          <Card
            style={{ padding: 0, boxShadow: "0 -2px 8px rgba(0,0,0,0.05)" }}
          >
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ borderRadius: "20px" }}
              onKeyDown={handleKeyPress}
              size="large"
              prefix={<SmileOutlined style={{ color: "#bfbfbf" }} />}
              suffix={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={inputValue.trim() === ""}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: inputValue.trim() === "" ? "#d9d9d9" : "#1890ff",
                  }}
                />
              }
            />
          </Card>
        }
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {messages.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có tin nhắn nào"
            />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  marginBottom: "16px",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {message.sender === "bot" && (
                  <Avatar
                    icon={<RobotOutlined />}
                    style={{
                      backgroundColor: "#1890ff",
                      marginRight: "8px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Card
                  style={{
                    maxWidth: "70%",
                    padding: 0,
                    borderRadius:
                      message.sender === "user"
                        ? "18px 18px 0 18px"
                        : "18px 18px 18px 0",
                    backgroundColor:
                      message.sender === "user" ? "#1890ff" : "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      color: message.sender === "user" ? "#fff" : "#000",
                    }}
                  >
                    <Markdown>{message.text}</Markdown>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "4px",
                        textAlign: "right",
                        color:
                          message.sender === "user"
                            ? "rgba(255,255,255,0.7)"
                            : "#999",
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </Card>
                {message.sender === "user" && (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "#f56a00",
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <Avatar
                icon={<RobotOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  marginRight: "8px",
                }}
              />
              <Card
                style={{
                  padding: 0,
                  borderRadius: "18px 18px 18px 0",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Spin size="small" />
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Drawer>
    </>
  );
};

export default ChatBot;
