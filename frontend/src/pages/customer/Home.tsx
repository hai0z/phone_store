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
  Badge,
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
  ShoppingOutlined,
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
        <Card
          hoverable
          className="feature-card"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Space align="start">
            <div
              style={{
                background: `${token.colorPrimaryBg}`,
                padding: "12px",
                borderRadius: "12px",
                marginRight: "8px",
              }}
            >
              <RocketOutlined
                style={{ fontSize: 28, color: token.colorPrimary }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                Giao hàng nhanh
              </Text>
              <br />
              <Text type="secondary">Miễn phí cho đơn 2tr</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          hoverable
          className="feature-card"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Space align="start">
            <div
              style={{
                background: "#f6ffed",
                padding: "12px",
                borderRadius: "12px",
                marginRight: "8px",
              }}
            >
              <SafetyCertificateOutlined
                style={{ fontSize: 28, color: "#52c41a" }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                Bảo hành chính hãng
              </Text>
              <br />
              <Text type="secondary">12 tháng</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          hoverable
          className="feature-card"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Space align="start">
            <div
              style={{
                background: "#f9f0ff",
                padding: "12px",
                borderRadius: "12px",
                marginRight: "8px",
              }}
            >
              <CustomerServiceOutlined
                style={{ fontSize: 28, color: "#722ed1" }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                Hỗ trợ 24/7
              </Text>
              <br />
              <Text type="secondary">Tư vấn nhiệt tình</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          hoverable
          className="feature-card"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Space align="start">
            <div
              style={{
                background: "#fffbe6",
                padding: "12px",
                borderRadius: "12px",
                marginRight: "8px",
              }}
            >
              <ThunderboltOutlined style={{ fontSize: 28, color: "#faad14" }} />
            </div>
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                Trả góp 0%
              </Text>
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
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
    >
      <div
        className="section-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          background: `linear-gradient(to right, ${token.colorPrimaryBg}, ${token.colorBgContainer})`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            color: token.colorPrimary,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              background: token.colorPrimary,
              color: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {})}
          </div>
          <span>{title}</span>
        </Title>
        <Link to={viewAllLink}>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            style={{
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Xem tất cả
          </Button>
        </Link>
      </div>

      <div style={{ padding: "24px" }}>
        {products?.length === 0 && !isLoading && (
          <Alert
            message="Không có sản phẩm"
            type="info"
            showIcon
            style={{ marginBottom: token.marginLG, borderRadius: "8px" }}
          />
        )}

        <Row gutter={[20, 20]}>
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      height: "100%",
                    }}
                  >
                    <Skeleton.Image
                      active
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: "8px",
                      }}
                    />
                    <Skeleton active />
                  </Card>
                </Col>
              ))
            : products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
                  <Badge.Ribbon
                    text={product.sold_count > 50 ? "Hot" : ""}
                    color="red"
                    style={{
                      display: product.sold_count > 50 ? "block" : "none",
                    }}
                  >
                    <ProductCard product={product} />
                  </Badge.Ribbon>
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
              ].map((product, index) => (
                <div key={index}>
                  <div
                    className="carousel-slide"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={product}
                      alt={`Banner slide ${index + 1}`}
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
                        padding: "32px",
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      }}
                    >
                      <Title
                        level={2}
                        style={{
                          color: "#fff",
                          margin: 0,
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        Khuyến mãi đặc biệt
                      </Title>
                      <Paragraph
                        style={{
                          color: "#fff",
                          margin: "12px 0 0",
                          fontSize: "16px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        Giảm giá lên đến 50% cho các sản phẩm hot
                      </Paragraph>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          marginTop: "16px",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                        icon={<ShoppingOutlined />}
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Feature Cards */}
          {renderFeatureCards()}

          {/* Brands Section */}

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
