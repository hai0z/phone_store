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
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Avatar, Dropdown } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

const { Header, Sider, Content } = Layout;

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
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/admin/settings"),
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
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
