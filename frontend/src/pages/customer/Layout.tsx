import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Input,
  Badge,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Affix,
  Tooltip,
  FloatButton,
  Dropdown,
  MenuProps,
  Avatar,
  AutoComplete,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../types";
import axios from "axios";
import ChatBot from "../../components/chatbot/ChatBot";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const CustomerLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const { user, logout } = useAuth();

  const [current, setCurrent] = useState("mail");
  const [visible, setVisible] = useState(false);
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userMenuItems = [
    {
      key: "1",
      label: "Thông tin tài khoản",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile?tab=1"),
    },
    {
      key: "2",
      label: "Đơn hàng của tôi",
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate("/profile?tab=2"),
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
        navigate("/");
      },
    },
  ];

  const menuItems = [
    {
      key: "/",
      label: "Trang chủ",

      onClick: () => navigate("/"),
    },
    {
      key: "/dtdd",
      label: "Điện thoại",
      onClick: () => navigate("/dtdd"),
    },
    {
      key: "accessories",
      label: "Phụ kiện",
      onClick: () => navigate("/phukien"),
    },
    {
      key: "news",
      label: "Tin tức",
      onClick: () => navigate("/news"),
    },
    {
      key: "contact",
      label: "Liên hệ",
      onClick: () => navigate("/contact"),
    },
  ];

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (value: string) => {
    if (value.trim()) {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/suggestions?keyword=${value}`
      );
      setSuggestions(response.data);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSelect = (_: string, option: any) => {
    navigate(`/dtdd/${option.key}`);
  };

  const options = suggestions.map((product) => ({
    value: product.product_name,
    key: product.product_id,
    label: (
      <div style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0].image_url
              : ""
          }
          alt={product.product_name}
          style={{
            width: 40,
            height: 40,
            marginRight: 12,
            objectFit: "contain",
          }}
        />
        <div>
          <div>{product.product_name}</div>
          {/* <div style={{ fontSize: "12px", color: "#ff4d4f" }}>
            {product.variants && product.variants.length > 0
              ? `${product.variants[0].sale_price.toLocaleString("vi-VN")}₫`
              : ""}
          </div> */}
        </div>
      </div>
    ),
  }));

  return (
    <Layout>
      <Affix>
        <Header
          className={`main-header ${scrolled ? "scrolled" : ""}`}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
            padding: "0 50px",
            background: "#fff",
            boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          <div className="header-container">
            <div className="logo-section">
              <Link to="/" className="logo-link">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1374/1374085.png"
                  alt="Mobile Zone Logo"
                  className="logo-image"
                />
                <Title level={4} className="logo-text">
                  Mobile Zone
                </Title>
              </Link>
            </div>
            <Menu
              mode="horizontal"
              items={menuItems}
              className="desktop-menu"
              selectedKeys={[pathName]}
              onClick={onClick}
            />

            <div className="header-actions">
              <Space size="middle" className="desktop-actions">
                <AutoComplete
                  style={{ width: 300 }}
                  options={options}
                  onSelect={handleSearchSelect}
                  onSearch={(value) => setSearchQuery(value)}
                  placeholder="Tìm kiếm sản phẩm..."
                >
                  <Input size="large" suffix={<SearchOutlined />} allowClear />
                </AutoComplete>
                <Tooltip title="Giỏ hàng">
                  <Badge count={getTotalItems()} size="small">
                    <Button
                      color="default"
                      variant="filled"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                      onClick={() => navigate("/cart")}
                      className="action-button"
                    />
                  </Badge>
                </Tooltip>
                {user ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                  >
                    <div style={{ cursor: "pointer" }}>
                      <Avatar
                        alt="User Avatar"
                        style={{ backgroundColor: "#1890ff" }}
                      >
                        {user.full_name!.charAt(0)}
                      </Avatar>
                    </div>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={() => navigate("/login")}
                    className="login-button"
                  >
                    Đăng nhập
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </Header>
      </Affix>

      <Content className="main-content">
        <Outlet />
      </Content>

      <Footer className="main-footer">
        <div className="footer-content">
          <Row gutter={[32, 32]} justify="space-between">
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-logo">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1374/1374085.png"
                  alt="Mobile Zone Logo"
                  style={{ height: 50, marginRight: 10 }}
                />
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  Mobile Zone
                </Title>
              </div>
              <Paragraph style={{ color: "#ccc", marginTop: 16 }}>
                Mobile Zone - Cửa hàng điện thoại uy tín hàng đầu Việt Nam.
                Chuyên cung cấp các sản phẩm điện thoại chính hãng với giá tốt
                nhất thị trường.
              </Paragraph>
              <div className="footer-social">
                <Link to="https://facebook.com" target="_blank">
                  <FacebookOutlined className="social-icon" />
                </Link>
                <Link to="https://instagram.com" target="_blank">
                  <InstagramOutlined className="social-icon" />
                </Link>
                <Link to="https://whatsapp.com" target="_blank">
                  <WhatsAppOutlined className="social-icon" />
                </Link>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6} lg={5}>
              <Title level={4} style={{ color: "#fff" }}>
                Thông tin
              </Title>
              <ul className="footer-links">
                <li>
                  <Link to="/about">Giới thiệu</Link>
                </li>
                <li>
                  <Link to="/blog">Blog công nghệ</Link>
                </li>
                <li>
                  <Link to="/careers">Tuyển dụng</Link>
                </li>
                <li>
                  <Link to="/stores">Hệ thống cửa hàng</Link>
                </li>
                <li>
                  <Link to="/warranty">Bảo hành</Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6} lg={5}>
              <Title level={4} style={{ color: "#fff" }}>
                Hỗ trợ khách hàng
              </Title>
              <ul className="footer-links">
                <li>
                  <Link to="/faq">Câu hỏi thường gặp</Link>
                </li>
                <li>
                  <Link to="/shipping-policy">Chính sách vận chuyển</Link>
                </li>
                <li>
                  <Link to="/return-policy">Chính sách đổi trả</Link>
                </li>
                <li>
                  <Link to="/payment-methods">Phương thức thanh toán</Link>
                </li>
                <li>
                  <Link to="/contact">Liên hệ hỗ trợ</Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6} lg={8}>
              <Title level={4} style={{ color: "#fff" }}>
                Liên hệ với chúng tôi
              </Title>
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Text style={{ color: "#ccc" }}>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  123 Đường ABC, Quận XYZ, TP.HCM
                </Text>
                <Text style={{ color: "#ccc" }}>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  Hotline: 1900 1234 (8:00 - 21:00)
                </Text>
                <Text style={{ color: "#ccc" }}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  Email: contact@mobilezone.com
                </Text>
              </Space>
              <div className="newsletter">
                <Title level={5} style={{ color: "#fff", marginTop: 16 }}>
                  Đăng ký nhận tin
                </Title>
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 100px)" }}
                    placeholder="Email của bạn"
                  />
                  <Button type="primary">Đăng ký</Button>
                </Input.Group>
              </div>
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              margin: "24px 0",
            }}
          />

          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text style={{ color: "#ccc" }}>
                © {new Date().getFullYear()} Mobile Zone. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <Space
                split={
                  <Divider type="vertical" style={{ borderColor: "#555" }} />
                }
                className="footer-bottom-links"
              >
                <Link to="/privacy" style={{ color: "#ccc" }}>
                  Chính sách bảo mật
                </Link>
                <Link to="/terms" style={{ color: "#ccc" }}>
                  Điều khoản sử dụng
                </Link>
                <Link to="/sitemap" style={{ color: "#ccc" }}>
                  Sitemap
                </Link>
              </Space>
            </Col>
          </Row>
        </div>
      </Footer>

      <FloatButton.Group>
        <FloatButton
          icon={<CustomerServiceOutlined />}
          tooltip="Hỗ trợ"
          onClick={() => setVisible(true)}
        />
        <FloatButton.BackTop visibilityHeight={100} />
      </FloatButton.Group>
      <ChatBot visible={visible} setVisible={setVisible} />
      <style>
        {`
          .top-bar {
            background-color: #f5f5f5;
            padding: 8px 0;
            font-size: 13px;
            border-bottom: 1px solid #eee;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
          }
          
          .main-header {
            height: 70px;
            line-height: 70px;
            transition: all 0.3s;
          }
          
          .main-header.scrolled {
            height: 60px;
            line-height: 60px;
          }
          
          .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .logo-link {
            display: flex;
            align-items: center;
          }
          
          .logo-image {
            height: 40px;
            margin-right: 10px;
            transition: all 0.3s;
          }
          
          .scrolled .logo-image {
            height: 35px;
          }
          
          .logo-text {
            margin: 0;
            color: #1890ff;
            transition: all 0.3s;
          }
          
          .scrolled .logo-text {
            font-size: 18px;
          }
          
          .desktop-menu {
            flex: 1;
            display: flex;
            justify-content: center;
            border: none;
          }
          
          .header-actions {
            display: flex;
            align-items: center;
          }

          .desktop-actions {
            display: flex;
            align-items: center;
            height: 100%;
          }
          
          .action-button {
            color: #555;
          }
          
          .login-button {
            border-radius: 4px;
          }
          
          .main-content {
            min-height: calc(100vh - 70px - 400px);
            padding: 24px 50px;
            background: #f5f5f7;
          }
          
          .main-footer {
            background: #001529;
            padding: 60px 50px 30px;
            color: #fff;
          }
          
          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .footer-logo {
            display: flex;
            align-items: center;
          }
          
          .footer-social {
            margin-top: 20px;
          }
          
          .social-icon {
            font-size: 24px;
            color: #fff;
            margin-right: 16px;
            transition: color 0.3s;
          }
          
          .social-icon:hover {
            color: #1890ff;
          }
          
          .footer-links {
            list-style: none;
            padding: 0;
            margin: 16px 0 0;
          }
          
          .footer-links li {
            margin-bottom: 12px;
          }
          
          .footer-links a {
            color: #ccc;
            transition: color 0.3s;
          }
          
          .footer-links a:hover {
            color: #1890ff;
          }
          
          .newsletter {
            margin-top: 20px;
          }
          
          .footer-bottom-links {
            display: flex;
            justify-content: flex-end;
          }
          
          .back-top-button {
            height: 40px;
            width: 40px;
            line-height: 40px;
            border-radius: 4px;
            background-color: #1890ff;
            color: #fff;
            text-align: center;
            font-size: 18px;
          }
          
          .floating-support {
            position: fixed;
            right: 20px;
            bottom: 80px;
            z-index: 9;
          }
          
          .support-button {
            background: #1890ff;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 50px;
            height: 50px;
          }
          
          @media (max-width: 992px) {
            .main-content {
              padding: 16px 24px;
            }
            
            .main-footer {
              padding: 40px 24px 20px;
            }
            
            .footer-bottom-links {
              justify-content: flex-start;
              margin-top: 16px;
            }
          }
          
          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
            
            .header-actions {
              display: flex;
              align-items: center;
            }
            
            .header-actions .action-button {
              display: block !important;
            }
            
            .main-header {
              padding: 0 15px;
            }
            
            .main-content {
              padding: 16px;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default CustomerLayout;
