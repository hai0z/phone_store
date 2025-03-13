import React from "react";
import {
  Layout,
  Carousel,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Skeleton,
  theme,
  Alert,
} from "antd";
import {
  RightOutlined,
  FireOutlined,
  GiftOutlined,
  StarOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductImage, ProductVariant, Rating } from "../../types";
import ProductCard from "./product/components/ProductCard";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

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

interface HomeData {
  newArrivals: Product[];
  bestSellers: Product[];
  featuredProducts: Product[];
}

const fetchHomeData = async (): Promise<HomeData> => {
  const { data } = await axios.get(
    "http://localhost:8080/api/v1/customer/home"
  );
  return data;
};

const Home: React.FC = () => {
  const { token } = theme.useToken();
  const { data, isLoading } = useQuery<HomeData>({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
  });

  const renderFeatureCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: token.marginLG * 2 }}>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable>
          <Space>
            <RocketOutlined
              style={{ fontSize: 24, color: token.colorPrimary }}
            />
            <div>
              <Text strong>Giao hàng nhanh</Text>
              <br />
              <Text type="secondary">Miễn phí cho đơn 2tr</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable>
          <Space>
            <SafetyCertificateOutlined
              style={{ fontSize: 24, color: "#52c41a" }}
            />
            <div>
              <Text strong>Bảo hành chính hãng</Text>
              <br />
              <Text type="secondary">12 tháng</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable>
          <Space>
            <CustomerServiceOutlined
              style={{ fontSize: 24, color: "#722ed1" }}
            />
            <div>
              <Text strong>Hỗ trợ 24/7</Text>
              <br />
              <Text type="secondary">Tư vấn nhiệt tình</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable>
          <Space>
            <ThunderboltOutlined style={{ fontSize: 24, color: "#faad14" }} />
            <div>
              <Text strong>Trả góp 0%</Text>
              <br />
              <Text type="secondary">Duyệt nhanh</Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  const renderProductSection = (
    title: string,
    icon: React.ReactNode,
    products: Product[] = [],
    viewAllLink: string
  ) => (
    <div
      className="product-section"
      style={{
        marginBottom: token.marginLG * 2,
        background: token.colorBgContainer,
        padding: token.padding * 2,
        borderRadius: token.borderRadiusLG,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="section-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: token.marginLG,
          borderBottom: `2px solid ${token.colorPrimary}`,
          paddingBottom: token.padding,
          background:
            "linear-gradient(to right, rgba(24, 144, 255, 0.05), transparent)",
          padding: "16px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            color: token.colorPrimary,
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {})}
          <span style={{ marginLeft: token.margin }}>{title}</span>
        </Title>
        <Link to={viewAllLink}>
          <Button type="primary" size="large" icon={<RightOutlined />}>
            Xem tất cả
          </Button>
        </Link>
      </div>

      {products?.length === 0 && !isLoading && (
        <Alert
          message="Không có sản phẩm"
          type="info"
          showIcon
          style={{ marginBottom: token.marginLG }}
        />
      )}

      <Row gutter={[token.marginLG, token.marginLG]}>
        {isLoading
          ? [...Array(8)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card>
                  <Skeleton.Image
                    active
                    style={{ width: "100%", height: 200 }}
                  />
                  <Skeleton active />
                </Card>
              </Col>
            ))
          : products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
                <ProductCard product={product} />
              </Col>
            ))}
      </Row>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ padding: token.paddingLG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              marginBottom: token.marginLG * 2,
              borderRadius: token.borderRadiusLG,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <Carousel
              autoplay
              effect="fade"
              className="hero-carousel"
              dots={{ className: "custom-dots" }}
            >
              {[
                "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e5/a8/e5a87cfd3dcc022948258c83dea38a3b.png",
                "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b7/4c/b74c88377bb52db039daf26a48390b61.png",
                "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/c5/b2/c5b28eeb77bedec1c0eab2cb9370d7e2.png",
              ].map((product) => (
                <div key={product}>
                  <div
                    className="carousel-slide"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={product}
                      alt={product}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      className="carousel-content"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: token.paddingLG,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      }}
                    >
                      <Title level={2} style={{ color: "#fff", margin: 0 }}>
                        Khuyến mãi đặc biệt
                      </Title>
                      <Paragraph style={{ color: "#fff", margin: "8px 0 0" }}>
                        Giảm giá lên đến 50% cho các sản phẩm hot
                      </Paragraph>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Feature Cards */}
          {renderFeatureCards()}

          {/* New Arrivals Section */}
          {renderProductSection(
            "Sản phẩm mới",
            <GiftOutlined />,
            data?.newArrivals,
            "/dtdd"
          )}

          {/* Best Sellers Section */}
          {renderProductSection(
            "Bán chạy nhất",
            <FireOutlined />,
            data?.bestSellers,
            "/dtdd"
          )}

          {/* Featured Products Section */}
          {renderProductSection(
            "Khuyến mãi hot",
            <StarOutlined />,
            data?.featuredProducts,
            "/dtdd"
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
