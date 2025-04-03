import {
  Row,
  Col,
  Card,
  theme,
  Space,
  Empty,
  Avatar,
  Divider,
  Progress,
  Flex,
} from "antd";
import { Rate, Typography, Tag, Button } from "antd";
import { Product } from "../../../../types";
import dayjs from "dayjs";
import RatingModal from "./RatingModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export interface RatingResponse {
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  distribution: Distribution[];
  purchasedCustomerIds: number[];
}

export interface Rating {
  rating_id: number;
  product_id: number;
  customer_id: number;
  rating: number;
  created_at: string;
  content: string;
  customer: Customer;
}

export interface Customer {
  customer_id: number;
  full_name: string;
}

export interface Distribution {
  _count: number;
  rating: number;
}

const { Title, Text, Paragraph } = Typography;

const ProductReviews = ({ product }: { product: Product }) => {
  const { user } = useAuth();
  const { data: ratingResponse, refetch } = useQuery({
    queryKey: ["ratings", product.product_id],
    queryFn: async () => {
      const res = await axios.get<RatingResponse>(
        `http://localhost:8080/api/v1/ratings/product/${product.product_id}`
      );
      return res.data;
    },
  });
  const { token } = theme.useToken();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  return (
    <div style={{ padding: token.paddingLG }}>
      <Card
        style={{
          width: "100%",
          borderRadius: token.borderRadiusLG,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: token.paddingLG }}
      >
        <Title
          level={3}
          style={{ marginBottom: token.marginLG, fontWeight: 600 }}
        >
          Đánh giá và nhận xét từ khách hàng
        </Title>

        <Divider
          style={{ margin: `${token.marginSM}px 0 ${token.marginLG}px` }}
        />

        <Row gutter={[token.marginXL, token.marginXL]}>
          <Col xs={24} md={8}>
            <Flex vertical align="center" gap={token.marginSM}>
              <div
                style={{
                  background: token.colorBgContainer,
                  padding: token.paddingLG,
                  borderRadius: token.borderRadiusLG,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Title
                  level={1}
                  style={{
                    margin: 0,
                    color: token["gold-6"],
                    fontSize: 54,
                    fontWeight: 700,
                  }}
                >
                  {ratingResponse?.averageRating === 0
                    ? "5.0"
                    : ratingResponse?.averageRating.toFixed(1)}
                </Title>
                <Rate
                  value={
                    ratingResponse?.averageRating === 0
                      ? 5
                      : ratingResponse?.averageRating
                  }
                  disabled
                  allowHalf
                  style={{ fontSize: token.fontSizeLG }}
                />
                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: token.marginSM }}
                >
                  <strong>{ratingResponse?.totalRatings}</strong> đánh giá
                </Text>
              </div>

              <Flex
                vertical
                gap={token.marginXS}
                style={{ width: "100%", marginTop: token.marginMD }}
              >
                {[5, 4, 3, 2, 1].map((star) => {
                  const count =
                    ratingResponse?.distribution.find((d) => d.rating === star)
                      ?._count || 0;
                  const percentage =
                    (count / (ratingResponse?.totalRatings || 1)) * 100;

                  return (
                    <Flex key={star} align="center" gap={token.marginXS}>
                      <div style={{ width: 40, textAlign: "right" }}>
                        <Text strong>{star}</Text>{" "}
                        <StarOutlined style={{ color: token["gold-6"] }} />
                      </div>
                      <Progress
                        percent={percentage}
                        showInfo={false}
                        strokeColor={
                          star >= 4
                            ? token["green-6"]
                            : star === 3
                            ? token["orange-6"]
                            : token["red-6"]
                        }
                        style={{
                          flex: 1,
                          margin: 0,
                        }}
                      />
                      <Text style={{ width: 50 }} type="secondary">
                        {percentage.toFixed(0)}%
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Col>

          <Col xs={24} md={16}>
            <Flex vertical gap={token.marginMD} style={{ width: "100%" }}>
              {ratingResponse?.purchasedCustomerIds.includes(
                user?.customer_id!
              ) &&
                !ratingResponse?.ratings.find(
                  (r) => r.customer_id === user?.customer_id
                ) && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<StarOutlined />}
                    onClick={() => setRatingModalVisible(true)}
                    style={{
                      borderRadius: token.borderRadiusSM,
                      fontWeight: 500,
                    }}
                  >
                    Đánh giá sản phẩm
                  </Button>
                )}

              <div className="customer-reviews">
                {ratingResponse?.totalRatings === 0 ? (
                  <Card
                    style={{
                      borderRadius: token.borderRadiusLG,
                      textAlign: "center",
                      padding: token.paddingLG,
                    }}
                  >
                    <Empty
                      description="Không có đánh giá nào cho sản phẩm này"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </Card>
                ) : (
                  <Flex vertical gap={token.marginMD} style={{ width: "100%" }}>
                    {ratingResponse?.ratings?.map((rating) => (
                      <Card
                        key={rating.rating_id}
                        style={{
                          borderRadius: token.borderRadiusLG,
                          backgroundColor: token.colorBgContainer,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          border: "none",
                        }}
                      >
                        <Flex
                          vertical
                          gap={token.marginSM}
                          style={{ width: "100%" }}
                        >
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={token.marginSM}>
                              <Avatar
                                style={{
                                  backgroundColor: token["blue-5"],
                                  color: token.colorTextLightSolid,
                                }}
                              >
                                {rating.customer?.full_name.charAt(0)}
                              </Avatar>
                              <div>
                                <Text strong style={{ fontSize: 16 }}>
                                  {rating.customer?.full_name}
                                </Text>
                                <Flex align="center" gap={4}>
                                  <Rate
                                    disabled
                                    defaultValue={rating.rating}
                                    style={{ fontSize: token.fontSizeSM }}
                                  />
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: token.fontSizeSM }}
                                  >
                                    {dayjs(rating.created_at).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </Text>
                                </Flex>
                              </div>
                            </Flex>

                            {rating.customer_id === user?.customer_id && (
                              <Space>
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    // Handle edit
                                  }}
                                >
                                  Sửa
                                </Button>
                              </Space>
                            )}
                          </Flex>

                          <div>
                            <Tag
                              color="blue"
                              icon={<CheckCircleOutlined />}
                              style={{ marginLeft: 40 }}
                            >
                              Đã mua hàng
                            </Tag>
                          </div>

                          <Paragraph
                            style={{
                              margin: `${token.marginSM}px 0 0 40px`,
                              color: token.colorText,
                              fontSize: 15,
                              lineHeight: 1.6,
                            }}
                          >
                            {rating.content}
                          </Paragraph>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                )}
              </div>
            </Flex>
          </Col>
        </Row>
      </Card>
      <RatingModal
        visible={ratingModalVisible}
        productId={product.product_id}
        onClose={() => {
          setRatingModalVisible(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ProductReviews;
