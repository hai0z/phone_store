import React, { useEffect } from "react";
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
  Divider,
  Tag,
  Rate,
  Avatar,
  Statistic,
  ConfigProvider,
  FloatButton,
  App,
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
  ArrowRightOutlined,
  HeartOutlined,
  PercentageOutlined,
  TrophyOutlined,
  CommentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LikeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductImage, ProductVariant, Rating } from "../../types";
import ProductCard from "./product/components/ProductCard";
import { motion } from "framer-motion";

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
    "http://localhost:8080/api/v1/customers/home"
  );
  return data;
};

const Home: React.FC = () => {
  const { token } = theme.useToken();
  const { data, isLoading } = useQuery<HomeData>({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
  });

  const statistics = [
    {
      icon: <UserOutlined />,
      value: "100,000+",
      title: "Khách hàng tin dùng",
    },
    {
      icon: <ShoppingCartOutlined />,
      value: "500,000+",
      title: "Đơn hàng thành công",
    },
    {
      icon: <LikeOutlined />,
      value: "98%",
      title: "Khách hàng hài lòng",
    },
    {
      icon: <CheckCircleOutlined />,
      value: "5,000+",
      title: "Sản phẩm chính hãng",
    },
  ];

  const customerReviews = [
    {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      date: "20/03/2024",
      comment:
        "Sản phẩm chất lượng tuyệt vời, giao hàng nhanh chóng. Nhân viên tư vấn nhiệt tình, chuyên nghiệp.",
      product: "iPhone 15 Pro Max",
    },
    {
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      date: "19/03/2024",
      comment:
        "Mua hàng tại đây rất yên tâm về chất lượng. Chế độ bảo hành tốt, giá cả hợp lý.",
      product: "Samsung Galaxy S24 Ultra",
    },
    {
      name: "Lê Văn C",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 4,
      date: "18/03/2024",
      comment: "Dịch vụ chăm sóc khách hàng tuyệt vời. Sẽ ủng hộ shop dài dài.",
      product: "Xiaomi 14 Ultra",
    },
  ];

  const renderFeatureCards = () => (
    <div className="features-container" style={{ marginBottom: 60 }}>
      <Row gutter={[24, 24]}>
        {[
          {
            icon: <RocketOutlined style={{ fontSize: 48, color: "#1976D2" }} />,
            title: "Giao hàng nhanh",
            description: "Miễn phí cho đơn từ 2 triệu",
            gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            color: "#1976D2",
          },
          {
            icon: (
              <SafetyCertificateOutlined
                style={{ fontSize: 48, color: "#689F38" }}
              />
            ),
            title: "Bảo hành chính hãng",
            description: "12 tháng bảo hành toàn diện",
            gradient: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
            color: "#689F38",
          },
          {
            icon: (
              <CustomerServiceOutlined
                style={{ fontSize: 48, color: "#7B1FA2" }}
              />
            ),
            title: "Hỗ trợ 24/7",
            description: "Tư vấn chuyên nghiệp",
            gradient: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            color: "#7B1FA2",
          },
          {
            icon: (
              <ThunderboltOutlined style={{ fontSize: 48, color: "#FFA000" }} />
            ),
            title: "Trả góp 0%",
            description: "Duyệt hồ sơ trong 5 phút",
            gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
            color: "#FFA000",
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
                  borderRadius: 16,
                  border: "none",
                  background: feature.gradient,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
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
    bgColor: string,
    iconColor: string
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="product-section"
      style={{
        marginBottom: 60,
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 5px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="section-header"
        style={{
          padding: "24px 32px",
          background: bgColor,
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
                  background: "#fff",
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontSize: 30, color: iconColor }}>{icon}</span>
              </motion.div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: "#fff",
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
                  background: "#fff",
                  color: iconColor,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
            style={{ marginBottom: 24, borderRadius: 12 }}
          />
        )}

        <Row gutter={[24, 32]}>
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: "none",
                    }}
                  >
                    <Skeleton.Image
                      active
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 12,
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
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
      <Layout style={{ background: "#f0f2f5" }}>
        <Content style={{ padding: "40px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* Hero Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                marginBottom: 60,
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
              }}
            >
              <Carousel
                autoplay
                effect="fade"
                className="hero-carousel"
                dots={{ className: "custom-dots" }}
              >
                {[
                  {
                    image:
                      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e5/a8/e5a87cfd3dcc022948258c83dea38a3b.png",
                    title: "iPhone 15 Pro Max",
                    subtitle: "Mạnh mẽ hơn bao giờ hết với chip A17 Pro",
                    color: "#1a1a1a",
                    buttonColor: "#0071e3",
                  },
                  {
                    image:
                      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b7/4c/b74c88377bb52db039daf26a48390b61.png",
                    title: "Galaxy S24 Ultra",
                    subtitle:
                      "Trải nghiệm Galaxy AI - Mở rộng khả năng sáng tạo",
                    color: "#4e2a84",
                    buttonColor: "#9c64de",
                  },
                  {
                    image:
                      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/c5/b2/c5b28eeb77bedec1c0eab2cb9370d7e2.png",
                    title: "Xiaomi 14 Ultra",
                    subtitle: "Camera đỉnh cao - Hiệu năng vượt trội",
                    color: "#ff6900",
                    buttonColor: "#ff6900",
                  },
                ].map((slide, index) => (
                  <div key={index}>
                    <div
                      className="carousel-slide"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={slide.image}
                        alt={`Banner slide ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "600px",
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
                          padding: "60px",
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <Tag
                            color={slide.buttonColor}
                            style={{
                              fontSize: 16,
                              padding: "4px 12px",
                              marginBottom: 16,
                              borderRadius: 4,
                            }}
                          >
                            <PercentageOutlined /> Khuyến mãi đặc biệt
                          </Tag>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <Title
                            level={1}
                            style={{
                              color: "#fff",
                              margin: "8px 0",
                              fontWeight: 800,
                              fontSize: 48,
                              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            }}
                          >
                            {slide.title}
                          </Title>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <Paragraph
                            style={{
                              color: "#fff",
                              margin: "16px 0 24px",
                              fontSize: 20,
                              maxWidth: 600,
                              textShadow: "0 1px 5px rgba(0,0,0,0.3)",
                            }}
                          >
                            {slide.subtitle}
                          </Paragraph>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <Space size={16}>
                            <Button
                              type="primary"
                              size="large"
                              style={{
                                borderRadius: 30,
                                fontWeight: 600,
                                background: slide.buttonColor,
                                border: "none",
                                height: 50,
                                padding: "0 32px",
                                fontSize: 16,
                              }}
                              icon={<ShoppingOutlined />}
                            >
                              Mua ngay
                            </Button>
                            <Button
                              size="large"
                              style={{
                                borderRadius: 30,
                                fontWeight: 600,
                                background: "rgba(255,255,255,0.2)",
                                backdropFilter: "blur(10px)",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.3)",
                                height: 50,
                                padding: "0 32px",
                                fontSize: 16,
                              }}
                              icon={<HeartOutlined />}
                            >
                              Yêu thích
                            </Button>
                          </Space>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>

            {/* Feature Cards */}
            {renderFeatureCards()}

            {/* New Arrivals Section */}
            {renderProductSection(
              "Sản phẩm mới",
              <GiftOutlined />,
              data?.newArrivals,
              "/dtdd",
              "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
              "#2E7D32"
            )}

            {/* Statistics Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="statistics-section"
              style={{
                marginBottom: 60,
                background: "linear-gradient(135deg, #f5f7ff 0%, #e6f7ff 100%)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 5px 30px rgba(0,0,0,0.08)",
                padding: "40px",
              }}
            >
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 40,
                  fontWeight: 700,
                  background: "linear-gradient(to right, #1677ff, #0958d9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Chúng tôi tự hào về con số
              </Title>
              <Row gutter={[32, 32]}>
                {statistics.map((stat, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Card
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          background: token.colorBgContainer,
                          borderRadius: 16,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          border: "none",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 48,
                            color: token.colorPrimary,
                            marginBottom: 16,
                          }}
                        >
                          {stat.icon}
                        </div>
                        <Title
                          level={2}
                          style={{ margin: 0, color: token.colorPrimary }}
                        >
                          {stat.value}
                        </Title>
                        <Text style={{ fontSize: 16 }}>{stat.title}</Text>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>

            {/* Best Sellers Section */}
            {renderProductSection(
              "Bán chạy nhất",
              <TrophyOutlined />,
              data?.bestSellers,
              "/dtdd",
              "linear-gradient(135deg, #F44336 0%, #C62828 100%)",
              "#C62828"
            )}

            {/* Customer Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="customer-reviews-section"
              style={{
                marginBottom: 60,
                background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 5px 30px rgba(0,0,0,0.08)",
                padding: "40px",
              }}
            >
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 40,
                  fontWeight: 700,
                  background: "linear-gradient(to right, #1677ff, #0958d9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <CommentOutlined style={{ marginRight: 12 }} />
                Khách hàng nói gì về chúng tôi
              </Title>
              <Row gutter={[32, 32]}>
                {customerReviews.map((review, index) => (
                  <Col xs={24} md={8} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    >
                      <Card
                        style={{
                          borderRadius: 16,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          height: "100%",
                          border: "none",
                          overflow: "hidden",
                        }}
                        cover={
                          <div
                            style={{
                              height: 80,
                              background:
                                "linear-gradient(90deg, #1677ff 0%, #0958d9 100%)",
                            }}
                          />
                        }
                      >
                        <div
                          style={{
                            marginTop: -40,
                            textAlign: "center",
                            marginBottom: 20,
                          }}
                        >
                          <Avatar
                            src={review.avatar}
                            size={80}
                            style={{
                              border: `4px solid #fff`,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Title
                            level={4}
                            style={{ marginTop: 16, marginBottom: 4 }}
                          >
                            {review.name}
                          </Title>
                          <Text type="secondary">
                            <ClockCircleOutlined style={{ marginRight: 8 }} />
                            {review.date}
                          </Text>
                          <div style={{ margin: "12px 0" }}>
                            <Rate disabled defaultValue={review.rating} />
                          </div>
                        </div>
                        <Paragraph
                          style={{
                            fontSize: 16,
                            textAlign: "center",
                            color: token.colorTextSecondary,
                          }}
                        >
                          "{review.comment}"
                        </Paragraph>
                        <Divider style={{ margin: "16px 0" }} />
                        <Text
                          type="secondary"
                          style={{ display: "block", textAlign: "center" }}
                        >
                          Sản phẩm: <Text strong>{review.product}</Text>
                        </Text>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>

            {/* Featured Products Section */}
            {renderProductSection(
              "Khuyến mãi hot",
              <PercentageOutlined />,
              data?.featuredProducts,
              "/dtdd",
              "linear-gradient(135deg, #FF9800 0%, #EF6C00 100%)",
              "#EF6C00"
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
