import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MobileOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  TagOutlined,
  BarChartOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

const { Header, Sider, Content, Footer } = Layout;
const { Text, Link } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Trang chủ",
      onClick: () => navigate("/admin/"),
    },
    {
      key: "products",
      icon: <MobileOutlined />,
      label: "Sản phẩm",

      onClick: () => navigate("/admin/products"),
    },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: "Danh mục",
      onClick: () => navigate("/admin/categories"),
    },
    {
      key: "brands",
      icon: <TagOutlined />,
      label: "Thương hiệu",
      onClick: () => navigate("/admin/brands"),
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
      onClick: () => navigate("/admin/orders"),
    },
    {
      key: "customers",
      icon: <TeamOutlined />,
      label: "Khách hàng",
      onClick: () => navigate("/admin/customers"),
    },
    {
      key: "revenue",
      icon: <BarChartOutlined />,
      label: "Doanh thu",
      onClick: () => navigate("/admin/revenue"),
    },
    {
      key: "vouchers",
      icon: <TagOutlined />,
      label: "Mã giảm giá",
      onClick: () => navigate("/admin/vouchers"),
    },
    {
      key: "banners",
      icon: <PictureOutlined />,
      label: "Quảng cáo",
      onClick: () => navigate("/admin/banners"),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Layout
      style={{
        overflow: "hidden",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/1374/1374085.png"
            alt="Phone Store Logo"
            style={{ height: "40px" }}
          />
          <Title
            level={4}
            style={{
              display: "flex",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transition: "opacity 0.2s, width 0.2s",
              marginLeft: collapsed ? 0 : "8px",
            }}
          >
            Mobile Zone
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          style={{ border: "none" }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            boxShadow: "0 2px 8px #f0f1f2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            marginLeft: collapsed ? 80 : 200,
            transition: "margin-left 0.2s",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginRight: "24px" }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: "8px" }}>Admin</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            marginTop: 64,
            marginInline: 12,
            marginBottom: 16,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            background: "#001529",
            color: "white",
            padding: "24px 0",
            marginLeft: -12,
          }}
        >
          <Row justify="space-around" align="top">
            <Col span={6}>
              <Title level={4} style={{ color: "white" }}>
                Về Mobile Zone
              </Title>
              <Text style={{ color: "white", display: "block" }}>
                Mobile Zone - Cửa hàng điện thoại uy tín hàng đầu Việt Nam
              </Text>
              <Text style={{ color: "white", display: "block" }}>
                Chuyên cung cấp các sản phẩm điện thoại chính hãng
              </Text>
            </Col>
            <Col span={6}>
              <Title level={4} style={{ color: "white" }}>
                Liên hệ
              </Title>
              <Text style={{ color: "white", display: "block" }}>
                <PhoneOutlined /> Hotline: 1900 1234
              </Text>
              <Text style={{ color: "white", display: "block" }}>
                <MailOutlined /> Email: contact@mobilezone.com
              </Text>
              <Text style={{ color: "white", display: "block" }}>
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </Text>
            </Col>
            <Col span={6}>
              <Title level={4} style={{ color: "white" }}>
                Theo dõi chúng tôi
              </Title>
              <Space size="middle">
                <Link href="https://facebook.com" target="_blank">
                  <FacebookOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </Link>
                <Link href="https://instagram.com" target="_blank">
                  <InstagramOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </Link>
              </Space>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: "24px" }}>
            <Text style={{ color: "white" }}>
              © 2024 Mobile Zone. All rights reserved.
            </Text>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
