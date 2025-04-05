import React from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Skeleton,
  theme,
  Alert,
  Badge,
  ConfigProvider,
  FloatButton,
  Empty,
} from "antd";
import {
  GiftOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  PercentageOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductImage, ProductVariant, Rating } from "../../types";
import ProductCard from "./product/components/ProductCard";
import { motion } from "framer-motion";
import BannerSlider from "../../components/customer/BannerSlider";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

interface Product {
  product_id: number;
  product_name: string;
  release_date: string;
  sold_count: number;
  brand_id: number;
  variants: ProductVariant[];
  images: ProductImage[];
  ratings: Rating[];
}

interface Brand {
  brand_id: number;
  brand_name: string;
  image_url: string | null;
}

interface HomeData {
  newArrivals: Product[];
  bestSellers: Product[];
  featuredProducts: Product[];
}

const fetchHomeData = async (): Promise<HomeData> => {
  const { data } = await axios.get(
    "http://localhost:8080/api/v1/customers/home"
  );
  return data;
};

const fetchBrands = async (): Promise<Brand[]> => {
  const { data } = await axios.get("http://localhost:8080/api/v1/brands");
  return data;
};

const Home: React.FC = () => {
  const { token } = useToken();
  const { data, isLoading } = useQuery<HomeData>({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
  });

  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const renderFeatureCards = () => (
    <div className="features-container" style={{ marginBottom: 60 }}>
      <Row gutter={[24, 24]}>
        {[
          {
            icon: (
              <RocketOutlined
                style={{ fontSize: 48, color: token.colorPrimary }}
              />
            ),
            title: "Giao hàng nhanh",
            description: "Miễn phí cho đơn từ 2 triệu",
            gradient: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimaryBgHover} 100%)`,
            color: token.colorPrimary,
          },
          {
            icon: (
              <SafetyCertificateOutlined
                style={{ fontSize: 48, color: token.colorSuccess }}
              />
            ),
            title: "Bảo hành chính hãng",
            description: "12 tháng bảo hành toàn diện",
            gradient: `linear-gradient(135deg, ${token.colorSuccessBg} 0%, ${token.colorSuccessBgHover} 100%)`,
            color: token.colorSuccess,
          },
          {
            icon: (
              <CustomerServiceOutlined
                style={{ fontSize: 48, color: token.colorWarning }}
              />
            ),
            title: "Hỗ trợ 24/7",
            description: "Tư vấn chuyên nghiệp",
            gradient: `linear-gradient(135deg, ${token.colorWarningBg} 0%, ${token.colorWarningBgHover} 100%)`,
            color: token.colorWarning,
          },
          {
            icon: (
              <ThunderboltOutlined
                style={{ fontSize: 48, color: token.colorInfo }}
              />
            ),
            title: "Trả góp 0%",
            description: "Duyệt hồ sơ trong 5 phút",
            gradient: `linear-gradient(135deg, ${token.colorInfoBg} 0%, ${token.colorInfoBgHover} 100%)`,
            color: token.colorInfo,
          },
        ].map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card
                hoverable
                className="feature-card"
                style={{
                  height: "100%",
                  borderRadius: token.borderRadiusLG,
                  border: "none",
                  background: feature.gradient,
                  boxShadow: token.boxShadowSecondary,
                  overflow: "hidden",
                }}
              >
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  {feature.icon}
                  <Title
                    level={4}
                    style={{ marginTop: 16, color: feature.color }}
                  >
                    {feature.title}
                  </Title>
                  <Text style={{ fontSize: 16 }}>{feature.description}</Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderProductSection = (
    title: string,
    icon: React.ReactNode,
    products: Product[] = [],
    viewAllLink: string,
    bgGradient: string,
    iconColor: string
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="product-section"
      style={{
        marginBottom: 60,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
        boxShadow: token.boxShadowSecondary,
      }}
    >
      <div
        className="section-header"
        style={{
          padding: "24px 32px",
          background: bgGradient,
          position: "relative",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space size={16} align="center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: token.colorBgContainer,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: token.boxShadow,
                }}
              >
                <span style={{ fontSize: 30, color: iconColor }}>{icon}</span>
              </motion.div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: token.colorBgContainer,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {title}
              </Title>
            </Space>
          </Col>
          <Col>
            <Link to={viewAllLink}>
              <Button
                type="default"
                size="large"
                style={{
                  borderRadius: 30,
                  fontWeight: 600,
                  background: token.colorBgContainer,
                  color: iconColor,
                  border: "none",
                  boxShadow: token.boxShadow,
                  height: 48,
                  padding: "0 24px",
                }}
              >
                Xem tất cả <ArrowRightOutlined />
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      <div style={{ padding: 32 }}>
        {products?.length === 0 && !isLoading && (
          <Alert
            message="Không có sản phẩm"
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: token.borderRadius }}
          />
        )}

        <Row gutter={[24, 32]}>
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    style={{
                      borderRadius: token.borderRadius,
                      overflow: "hidden",
                      boxShadow: token.boxShadowTertiary,
                      height: "100%",
                      border: "none",
                    }}
                  >
                    <Skeleton.Image
                      active
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: token.borderRadiusSM,
                      }}
                    />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))
            : products.map((product, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  >
                    <Badge.Ribbon
                      text={
                        product.sold_count > 50
                          ? Math.random() > 0.5
                            ? "Hot"
                            : "Bán chạy"
                          : ""
                      }
                      color={iconColor}
                      placement="start"
                      style={{
                        display: product.sold_count > 50 ? "block" : "none",
                        padding: "0 15px",
                      }}
                    >
                      <ProductCard product={product} />
                    </Badge.Ribbon>
                  </motion.div>
                </Col>
              ))}
        </Row>
      </div>
    </motion.div>
  );

  const renderBrandSection = () => {
    if (brandsLoading) {
      return (
        <Row gutter={[16, 16]}>
          {[...Array(6)].map((_, idx) => (
            <Col xs={8} sm={6} md={4} key={idx}>
              <Skeleton.Button active block style={{ height: 80 }} />
            </Col>
          ))}
        </Row>
      );
    }

    if (brandsError || !brandsData || brandsData.length === 0) {
      return <Empty description="Không có thương hiệu" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {brandsData.map((brand) => (
          <Col xs={8} sm={6} md={4} key={brand.brand_id}>
            <Link to={`/dtdd?brandIds=${brand.brand_id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  style={{
                    textAlign: "center",
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: token.borderRadius,
                    background: token.colorBgContainer,
                  }}
                >
                  {brand.image_url ? (
                    <img
                      src={brand.image_url}
                      alt={brand.brand_name}
                      style={{ maxHeight: 80 }}
                    />
                  ) : (
                    <Text strong>{brand.brand_name}</Text>
                  )}
                </Card>
              </motion.div>
            </Link>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        },
        components: {
          Button: {
            primaryColor: "#ffffff",
            defaultBorderColor: "transparent",
          },
          Card: {
            boxShadowTertiary: "0 4px 16px rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <Layout style={{ background: token.colorBgLayout }}>
        <Content style={{ padding: "40px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <BannerSlider />

            {/* Feature Cards */}
            {renderFeatureCards()}

            {/* New Arrivals Section */}
            {renderProductSection(
              "Sản phẩm mới",
              <GiftOutlined />,
              data?.newArrivals,
              "/dtdd",
              `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
              token.colorPrimary
            )}

            {/* Brand Section */}
            <div
              className="section-container"
              style={{
                padding: "40px 16px",
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowTertiary,
                marginBottom: 60,
              }}
            >
              <div
                className="content-wrapper"
                style={{ maxWidth: 1280, margin: "0 auto" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      color: token.colorTextHeading,
                    }}
                  >
                    Thương hiệu nổi bật
                  </Title>
                </div>

                {renderBrandSection()}
              </div>
            </div>

            {/* Featured Products Section */}
            {renderProductSection(
              "Khuyến mãi hot",
              <PercentageOutlined />,
              data?.featuredProducts,
              "/dtdd",
              `linear-gradient(135deg, ${token.colorWarning} 0%, ${token.colorWarningActive} 100%)`,
              token.colorWarning
            )}
            {/* Best Sellers Section */}
            {renderProductSection(
              "Bán chạy nhất",
              <TrophyOutlined />,
              data?.bestSellers,
              "/dtdd",
              `linear-gradient(135deg, ${token.colorError} 0%, ${token.colorErrorActive} 100%)`,
              token.colorError
            )}
          </div>
        </Content>
        <FloatButton.BackTop
          visibilityHeight={300}
          type="primary"
          style={{ right: 24, bottom: 24 }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Home;
