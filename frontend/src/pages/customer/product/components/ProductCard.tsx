import {
  Divider,
  Space,
  Statistic,
  Tag,
  Rate,
  Typography,
  theme,
  Tooltip,
} from "antd";
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
          hoverable
          style={{
            height: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            transition: "transform 0.3s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          cover={
            <div
              style={{
                padding: "20px",
                background: "#f7f9fc",
                textAlign: "center",
              }}
            >
              <img
                alt={product.product_name}
                src={mainImage}
                style={{ height: "200px", objectFit: "contain" }}
              />
            </div>
          }
        >
          <Meta
            title={
              <Tooltip title={product.product_name}>
                <Text
                  strong
                  style={{ fontSize: "16px" }}
                  ellipsis={{ tooltip: true }}
                >
                  {product.product_name}
                </Text>
              </Tooltip>
            }
            description={
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div>
                  {hasPromotion ? (
                    <>
                      <Text type="danger" strong style={{ fontSize: "18px" }}>
                        {formatPrice(promotionalPrice!)}
                      </Text>
                      <Text
                        delete
                        type="secondary"
                        style={{ marginLeft: "8px" }}
                      >
                        {formatPrice(originalPrice)}
                      </Text>
                    </>
                  ) : (
                    <Text type="danger" strong style={{ fontSize: "18px" }}>
                      {formatPrice(originalPrice)}
                    </Text>
                  )}
                </div>

                <div>
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={averageRating || 5}
                    style={{ fontSize: "14px" }}
                  />
                  <Text
                    type="secondary"
                    style={{ marginLeft: "8px", fontSize: "12px" }}
                  >
                    ({product.ratings.length})
                  </Text>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <Tag color="blue">{firstVariant?.ram?.capacity}</Tag>
                  <Tag color="green">
                    {firstVariant?.storage?.storage_capacity}
                  </Tag>
                  <Tag color="purple">Đã bán {product.sold_count}</Tag>
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
