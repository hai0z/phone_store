import { Divider, Space, Statistic, Tag, Rate, Typography, theme } from "antd";
import { Card } from "antd";
import dayjs from "dayjs";
import { ProductVariant, Rating, ProductImage } from "../../../../types";
import { Link } from "react-router-dom";
import { Badge } from "antd";

const { Text } = Typography;
const { Meta } = Card;

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

const getAverageRating = (ratings: Product["ratings"]) => {
  if (!ratings || ratings.length === 0) return 0;
  return ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
};

const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const calculateDiscount = (original: number, promotional: number) => {
  if (!original || !promotional) return 0;
  return Math.round(((original - promotional) / original) * 100);
};

const ProductCard = ({ product }: { product: Product }) => {
  const averageRating = getAverageRating(product.ratings);
  const mainImage = product?.images?.[0]?.image_url || "";
  const firstVariant = product?.variants?.[0] || {};
  const { token } = theme.useToken();

  const originalPrice = firstVariant.sale_price;

  const hasPromotion = product?.variants?.some(
    (v) =>
      v.promotional_price &&
      v.promotion_start &&
      v.promotion_end &&
      dayjs().isAfter(dayjs(v.promotion_start)) &&
      dayjs().isBefore(dayjs(v.promotion_end))
  );
  const firstPromotion = product?.variants?.find(
    (v) =>
      v.promotional_price &&
      v.promotion_start &&
      v.promotion_end &&
      dayjs().isAfter(dayjs(v.promotion_start)) &&
      dayjs().isBefore(dayjs(v.promotion_end))
  );

  const promotionalPrice = firstPromotion?.promotional_price;

  const discountPercent = hasPromotion
    ? calculateDiscount(originalPrice, promotionalPrice!)
    : 0;

  return (
    <Link to={`/dtdd/${product.product_id}`}>
      <Badge.Ribbon
        text={hasPromotion ? `Giảm ${discountPercent}%` : ""}
        color={hasPromotion ? token.colorError : "transparent"}
      >
        <Card
          style={{
            borderRadius: token.borderRadiusLG,
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          className="product-card"
          cover={
            <div
              className="product-image-container"
              style={{
                position: "relative",
                padding: token.padding,
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                alt={product.product_name}
                src={mainImage}
                style={{
                  maxHeight: 260,
                  maxWidth: "95%",
                  objectFit: "contain",
                  transition: "transform 0.5s ease",
                  filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))",
                }}
                className="product-image"
              />
              {hasPromotion && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: token.colorError,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  HOT DEAL
                </div>
              )}
            </div>
          }
        >
          <Meta
            title={
              <div
                style={{
                  color: token.colorTextHeading,
                  fontSize: token.fontSizeLG,
                  fontWeight: 600,
                  marginBottom: token.marginXS,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="product-name-link"
              >
                {product.product_name}
              </div>
            }
            description={
              <Space
                direction="vertical"
                size={token.marginXS}
                style={{ width: "100%" }}
              >
                <div
                  className="price-container"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  {hasPromotion ? (
                    <>
                      <Statistic
                        value={firstVariant.promotional_price || 0}
                        valueStyle={{
                          color: token.colorError,
                          fontSize: "1.5em",
                        }}
                        formatter={(value) => formatPrice(value as number)}
                      />
                      <Text
                        delete
                        type="secondary"
                        style={{ fontSize: token.fontSizeSM }}
                      >
                        {formatPrice(firstVariant.sale_price || 0)}
                      </Text>
                    </>
                  ) : (
                    <Statistic
                      value={firstVariant.sale_price || 0}
                      valueStyle={{
                        color: token.colorError,
                        fontSize: "1.5em",
                      }}
                      formatter={(value) => formatPrice(value as number)}
                    />
                  )}
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Tag
                    color="blue"
                    style={{
                      margin: 0,
                    }}
                  >
                    {firstVariant?.ram?.capacity} -{" "}
                    {firstVariant?.storage?.storage_capacity}
                  </Tag>
                  <Badge color="green" count={`Đã bán ${product.sold_count}`} />
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  <Rate
                    disabled
                    defaultValue={averageRating}
                    style={{ fontSize: token.fontSizeSM }}
                  />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: token.fontSizeSM,
                      marginLeft: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    ({product?.ratings?.length} đánh giá)
                  </Text>
                </div>
              </Space>
            }
          />
        </Card>
      </Badge.Ribbon>
    </Link>
  );
};

export default ProductCard;
