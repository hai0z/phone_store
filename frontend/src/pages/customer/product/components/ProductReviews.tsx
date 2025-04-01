import { Row, Col, Card, theme, Space, Empty } from "antd";
import { Rate, Typography, Tag, Button } from "antd";
import { Product } from "../../../../types";
import dayjs from "dayjs";
import RatingModal from "./RatingModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

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
    <Row style={{ padding: token.padding }}>
      <Card
        style={{
          width: "100%",
          marginTop: token.marginLG,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Title level={4} style={{ marginBottom: token.marginMD }}>
          Đánh giá và nhận xét từ khách hàng
        </Title>

        <Row gutter={[token.marginXL, token.marginXL]}>
          <Col xs={24} md={8}>
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center" }}
            >
              <Title level={1} style={{ margin: 0, color: token["yellow-6"] }}>
                {ratingResponse?.averageRating.toFixed(1) === "0.0"
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
              <Text type="secondary">
                Dựa trên {ratingResponse?.totalRatings} đánh giá
              </Text>

              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: token.marginMD }}
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <Row key={star} align="middle" gutter={[token.marginSM, 0]}>
                    <Col span={4}>
                      <Text>{star} sao</Text>
                    </Col>
                    <Col span={16}>
                      <div
                        style={{
                          width: "100%",
                          height: 8,
                          backgroundColor: token.colorBgContainerDisabled,
                          borderRadius: token.borderRadiusLG,
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              ((ratingResponse?.distribution.find(
                                (d) => d.rating === star
                              )?._count || 0) /
                                (ratingResponse?.totalRatings || 1)) *
                              100
                            }%`,
                            height: 8,
                            backgroundColor:
                              star >= 4
                                ? token.colorSuccess
                                : star === 3
                                ? token.colorWarning
                                : token.colorError,
                            borderRadius: token.borderRadiusLG,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                      <Text type="secondary">
                        {`${(
                          ((ratingResponse?.distribution.find(
                            (d) => d.rating === star
                          )?._count || 0) /
                            (ratingResponse?.totalRatings || 1)) *
                          100
                        ).toFixed(1)}%`}
                      </Text>
                    </Col>
                  </Row>
                ))}
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={16}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {ratingResponse?.purchasedCustomerIds.includes(
                user?.customer_id!
              ) &&
                !ratingResponse?.ratings.find(
                  (r) => r.customer_id === user?.customer_id
                ) && (
                  <Button
                    type="primary"
                    onClick={() => setRatingModalVisible(true)}
                  >
                    Đánh giá sản phẩm
                  </Button>
                )}

              <div className="customer-reviews">
                {ratingResponse?.totalRatings === 0 ? (
                  <Card>
                    <Empty description="Không có đánh giá" />
                  </Card>
                ) : (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {ratingResponse?.ratings?.map((rating) => (
                      <Card
                        key={rating.rating_id}
                        style={{
                          borderRadius: token.borderRadiusLG,
                          backgroundColor: token.colorBgContainer,
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Row justify="space-between" align="middle">
                            <Space>
                              <Text strong>{rating.customer?.full_name}</Text>
                              <Rate
                                disabled
                                defaultValue={rating.rating}
                                style={{ fontSize: token.fontSizeSM }}
                              />
                            </Space>
                            <Space>
                              <Text type="secondary">
                                {dayjs(rating.created_at).format("DD/MM/YYYY")}
                              </Text>
                              {rating.customer_id === user?.customer_id && (
                                <Space>
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => {
                                      // Handle edit
                                    }}
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    onClick={() => {
                                      // Handle delete
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </Space>
                              )}
                            </Space>
                          </Row>
                          <Tag color="blue">Đã mua hàng</Tag>
                          <Paragraph
                            style={{
                              margin: `${token.marginSM}px 0`,
                              color: token.colorText,
                            }}
                          >
                            {rating.content}
                          </Paragraph>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                )}
              </div>
            </Space>
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
    </Row>
  );
};

export default ProductReviews;
