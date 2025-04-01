import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Radio,
  Divider,
  Image,
  Rate,
  Breadcrumb,
  Tooltip,
  Carousel,
  Badge,
  Statistic,
  theme,
  notification,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductImage, ProductVariant, Rating } from "../../../types";
import { CarouselRef } from "antd/es/carousel";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";
import ProductDescriptions from "./components/ProductDescriptions";
import ProductReviews from "./components/ProductReviews";
import dayjs from "dayjs";
import { useCartStore } from "../../../store/cartStore";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [selectedColorId, setSelectedColorId] = useState<number>();
  const [selectedRamId, setSelectedRamId] = useState<number>();
  const [selectedStorageId, setSelectedStorageId] = useState<number>();
  const [api, contextHolder] = notification.useNotification();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [filteredImages, setFilteredImages] = useState<ProductImage[]>([]);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [availableRams, setAvailableRams] = useState<any[]>([]);
  const [availableStorages, setAvailableStorages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const { addItem, items, setOrder } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/${id}`
      );
      return response.data;
    },
  });

  // Group variants by unique combinations
  const uniqueColors: any = product?.variants
    ? [
        ...new Map(
          product.variants.map((variant: ProductVariant) => [
            variant.color_id,
            variant.color,
          ])
        ).values(),
      ]
    : [];

  // Update available RAMs based on selected color
  useEffect(() => {
    if (product?.variants && selectedColorId) {
      const ramsForSelectedColor = product.variants
        .filter((v: ProductVariant) => v.color_id === selectedColorId)
        .map((v: ProductVariant) => ({
          ram_id: v.ram_id,
          capacity: v.ram?.capacity,
          stock: v.stock,
        }));

      const uniqueRamsForColor: any = [
        ...new Map(
          ramsForSelectedColor.map((ram: any) => [ram.ram_id, ram])
        ).values(),
      ];

      setAvailableRams(uniqueRamsForColor);

      // If current RAM is not available for this color, select the first available RAM
      if (
        selectedRamId &&
        !uniqueRamsForColor.some((ram: any) => ram.ram_id === selectedRamId)
      ) {
        // Prioritize variants with stock > 0
        const inStockRams = uniqueRamsForColor.filter(
          (ram: any) => ram.stock > 0
        );
        if (inStockRams.length > 0) {
          setSelectedRamId(inStockRams[0].ram_id);
        } else if (uniqueRamsForColor.length > 0) {
          setSelectedRamId(uniqueRamsForColor[0].ram_id);
        }
      } else if (!selectedRamId && uniqueRamsForColor.length > 0) {
        // Prioritize variants with stock > 0
        const inStockRams = uniqueRamsForColor.filter(
          (ram: any) => ram.stock > 0
        );
        if (inStockRams.length > 0) {
          setSelectedRamId(inStockRams[0].ram_id);
        } else {
          setSelectedRamId(uniqueRamsForColor[0].ram_id);
        }
      }
    }
  }, [product, selectedColorId, selectedRamId]);

  // Update available storages based on selected color and RAM
  useEffect(() => {
    if (product?.variants && selectedColorId && selectedRamId) {
      const storagesForSelectedOptions = product.variants
        .filter(
          (v: ProductVariant) =>
            v.color_id === selectedColorId && v.ram_id === selectedRamId
        )
        .map((v: ProductVariant) => ({
          storage_id: v.storage_id,
          storage_capacity: v.storage?.storage_capacity,
          stock: v.stock,
        }));

      const uniqueStoragesForOptions: any = [
        ...new Map(
          storagesForSelectedOptions.map((storage: any) => [
            storage.storage_id,
            storage,
          ])
        ).values(),
      ];

      setAvailableStorages(uniqueStoragesForOptions);

      // If current storage is not available for this color and RAM, select the first available storage
      if (
        selectedStorageId &&
        !uniqueStoragesForOptions.some(
          (storage: any) => storage.storage_id === selectedStorageId
        )
      ) {
        // Prioritize variants with stock > 0
        const inStockStorages = uniqueStoragesForOptions.filter(
          (storage: any) => storage.stock > 0
        );
        if (inStockStorages.length > 0) {
          setSelectedStorageId(inStockStorages[0].storage_id);
        } else if (uniqueStoragesForOptions.length > 0) {
          setSelectedStorageId(uniqueStoragesForOptions[0].storage_id);
        }
      } else if (!selectedStorageId && uniqueStoragesForOptions.length > 0) {
        // Prioritize variants with stock > 0
        const inStockStorages = uniqueStoragesForOptions.filter(
          (storage: any) => storage.stock > 0
        );
        if (inStockStorages.length > 0) {
          setSelectedStorageId(inStockStorages[0].storage_id);
        } else {
          setSelectedStorageId(uniqueStoragesForOptions[0].storage_id);
        }
      }
    }
  }, [product, selectedColorId, selectedRamId, selectedStorageId]);

  // Set default selections when data is loaded
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      if (!selectedColorId && uniqueColors.length > 0) {
        // Prioritize colors that have variants with stock > 0
        const colorsWithStock = uniqueColors.filter((color: any) => {
          return product.variants.some(
            (v: ProductVariant) => v.color_id === color.color_id && v.stock > 0
          );
        });

        if (colorsWithStock.length > 0) {
          setSelectedColorId(colorsWithStock[0].color_id);
        } else {
          setSelectedColorId(uniqueColors[0].color_id);
        }
      }
    }
  }, [product]);

  // Filter images based on selected color
  useEffect(() => {
    if (product?.images && selectedColorId) {
      const filtered = product.images.filter(
        (image: ProductImage) => image.color_id === selectedColorId
      );
      setFilteredImages(filtered.length > 0 ? filtered : product.images);
      setActiveThumbIndex(0);
    } else if (product?.images) {
      setFilteredImages(product.images);
    }
  }, [product, selectedColorId]);

  // Find selected variant
  const selectedVariant: ProductVariant = product?.variants?.find(
    (variant: ProductVariant) =>
      variant.color_id === selectedColorId &&
      variant.ram_id === selectedRamId &&
      variant.storage_id === selectedStorageId
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      api.error({
        message: "Vui lòng chọn phiên bản sản phẩm",
        placement: "top",
      });
      return;
    }

    if (selectedVariant.stock <= 0) {
      api.error({
        message: "Sản phẩm đã hết hàng",
        placement: "top",
      });
      return;
    }

    const itemQuantity = items.find(
      (item) => item.variant_id === selectedVariant.variant_id
    )?.quantity;

    if (itemQuantity === undefined || itemQuantity < 5) {
      addItem({
        variant_id: selectedVariant.variant_id,
        quantity: 1,
      });
      api.success({
        message: "Đã thêm vào giỏ hàng",
        placement: "top",
      });
    } else {
      api.error({
        message: "Số lượng sản phẩm không được vượt quá 5",
        placement: "top",
      });
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      api.error({
        message: "Vui lòng chọn phiên bản sản phẩm",
        placement: "top",
      });
      return;
    }

    if (selectedVariant.stock <= 0) {
      api.error({
        message: "Sản phẩm đã hết hàng",
        placement: "top",
      });
      return;
    }
    addItem({
      variant_id: selectedVariant.variant_id,
      quantity: 1,
    });
    setOrder({
      items: [{ variant_id: selectedVariant.variant_id, quantity: 1 }],
      total: selectedVariant.sale_price,
    });
    navigate("/checkout");
  };

  const handlePreview = (image: string) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  const handleColorChange = (colorId: number) => {
    setSelectedColorId(colorId);
  };

  const handleThumbnailClick = (index: number) => {
    setActiveThumbIndex(index);
  };

  const carouselRef = React.useRef<CarouselRef>(null);
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div
      className="product-detail-container"
      style={{ padding: "24px 0", maxWidth: 1200, margin: "0 auto" }}
    >
      {contextHolder}

      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to="/dtdd">Điện thoại</Link> },
            {
              title: product?.brand?.brand_name,
              href: `/brand/${product?.brand?.brand_id}`,
            },
            { title: product?.product_name },
          ]}
        />
      </div>

      <Row gutter={[24, 24]} style={{ padding: "0 24px" }}>
        <Col xs={24} md={12}>
          <div
            className="product-gallery"
            style={{ position: "sticky", top: 24 }}
          >
            <Card
              className="main-image-card"
              style={{
                overflow: "hidden",
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <div
                className="main-image-container"
                style={{ position: "relative" }}
              >
                <Carousel
                  arrows
                  infinite={false}
                  ref={carouselRef}
                  autoplay
                  effect="fade"
                >
                  {filteredImages.map((image: ProductImage) => (
                    <div
                      key={`carousel-${image.image_id}`}
                      style={{
                        width: "100%",
                        height: 450,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f7f9fc",
                        borderRadius: 8,
                        padding: 20,
                      }}
                    >
                      <img
                        src={image.image_url}
                        alt={`Image ${image.image_id}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onClick={() => handlePreview(image.image_url)}
                      />
                    </div>
                  ))}
                </Carousel>
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <Button
                    shape="circle"
                    icon={<ShareAltOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                  <Button
                    shape="circle"
                    icon={<HeartOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                </div>
              </div>

              <div
                className="thumbnails-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                  marginTop: 16,
                }}
              >
                {filteredImages.map((image: ProductImage, index: number) => (
                  <div
                    key={`thumb-${image.image_id}`}
                    onClick={() => {
                      handleThumbnailClick(index);
                      carouselRef.current?.goTo(index);
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      border:
                        index === activeThumbIndex
                          ? `2px solid ${token.colorPrimary}`
                          : "1px solid #d9d9d9",
                      borderRadius: 8,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      opacity: index === activeThumbIndex ? 1 : 0.7,
                      transform:
                        index === activeThumbIndex ? "scale(1.05)" : "scale(1)",
                      boxShadow:
                        index === activeThumbIndex
                          ? "0 4px 8px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt={`Thumbnail ${image.image_id}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card
            className="product-info-card"
            style={{
              borderRadius: 12,
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title
                  level={1}
                  style={{ fontSize: 28, marginBottom: 8, color: "#2c3e50" }}
                >
                  {product?.product_name}
                </Title>
                <Space size="middle">
                  <Tag
                    color="blue"
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                  >
                    {product?.brand?.brand_name}
                  </Tag>
                  <Tag
                    color="green"
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                  >
                    {product?.category?.category_name}
                  </Tag>
                  {selectedVariant?.stock > 0 ? (
                    <Tag
                      color="success"
                      icon={<CheckCircleOutlined />}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 14,
                      }}
                    >
                      Còn hàng ({selectedVariant.stock})
                    </Tag>
                  ) : (
                    <Tag
                      color="error"
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 14,
                      }}
                    >
                      Hết hàng
                    </Tag>
                  )}
                </Space>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Rate
                    disabled
                    defaultValue={
                      product?.ratings?.length > 0
                        ? product?.ratings?.reduce(
                            (acc: number, rating: Rating) =>
                              acc + rating.rating,
                            0
                          ) / product?.ratings?.length
                        : 5
                    }
                    style={{ fontSize: 16 }}
                  />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({product?.ratings?.length} đánh giá)
                  </Text>
                  <Divider type="vertical" style={{ margin: "0 12px" }} />
                  <Text type="secondary">Đã bán: {product?.sold_count}</Text>
                </div>
              </div>

              {selectedVariant &&
              selectedVariant.promotion_start &&
              selectedVariant.promotion_end &&
              dayjs().isAfter(dayjs(selectedVariant.promotion_start)) &&
              dayjs().isBefore(dayjs(selectedVariant.promotion_end)) ? (
                <Badge.Ribbon
                  text={`-${Math.round(
                    (1 -
                      selectedVariant.promotional_price! /
                        selectedVariant.sale_price) *
                      100
                  )}%`}
                  color={token.colorWarning}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${token.colorError} 0%, ${token.colorError} 100%)`,
                      padding: "20px",
                      borderRadius: "16px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                          Giá gốc:
                        </Text>
                        <Text delete style={{ color: "#ffd6e7", fontSize: 20 }}>
                          {selectedVariant.sale_price.toLocaleString() + " đ"}
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                          Giá sale:
                        </Text>
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 32,
                            fontWeight: "bold",
                          }}
                        >
                          {selectedVariant.promotional_price?.toLocaleString() +
                            " đ"}
                        </Text>
                      </div>

                      <Divider
                        style={{
                          margin: "12px 0",
                          borderColor: "rgba(255,255,255,0.2)",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <ClockCircleOutlined style={{ color: "#fff" }} />
                        <Text style={{ color: "#fff" }}>Kết thúc sau:</Text>
                        <Countdown
                          value={dayjs(selectedVariant.promotion_end).valueOf()}
                          format="D ngày H giờ m phút s"
                          valueStyle={{
                            fontSize: 16,
                            color: "#fff",
                            fontWeight: "bold",
                            background: "rgba(255,255,255,0.2)",
                            padding: "4px 8px",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </Space>
                  </div>
                </Badge.Ribbon>
              ) : (
                <div
                  style={{
                    background: "linear-gradient(145deg, #f8f9fa, #e9ecef)",
                    padding: 20,
                    borderRadius: 12,
                  }}
                >
                  <Title
                    level={5}
                    style={{ marginBottom: 12, color: "#495057" }}
                  >
                    Giá Niêm Yết
                  </Title>
                  {selectedVariant ? (
                    <Text
                      type="danger"
                      style={{ fontSize: 32, fontWeight: "bold" }}
                    >
                      {selectedVariant.sale_price.toLocaleString() + " đ"}
                    </Text>
                  ) : (
                    <Text type="secondary">Vui lòng chọn phiên bản</Text>
                  )}
                </div>
              )}

              <div
                style={{
                  background: "#f8f9fa",
                  padding: 16,
                  borderRadius: 12,
                  border: "1px dashed #dee2e6",
                }}
              >
                <Title
                  level={5}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <GiftOutlined style={{ marginRight: 8, color: "#e74c3c" }} />
                  Ưu đãi đặc biệt
                </Title>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>
                    Giảm thêm 5% khi thanh toán qua ví điện tử
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    Trả góp 0% lãi suất qua thẻ tín dụng
                  </li>
                  <li>Bảo hành 12 tháng chính hãng</li>
                </ul>
              </div>

              <div className="variant-selection">
                <div className="color-selection" style={{ marginBottom: 20 }}>
                  <Title
                    level={5}
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      color: "#2c3e50",
                    }}
                  >
                    Màu sắc
                    <Tooltip title="Chọn màu sắc phù hợp với bạn">
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, color: "#8c8c8c" }}
                      />
                    </Tooltip>
                  </Title>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {uniqueColors.map((color: any) => {
                      const hasStock = product.variants.some(
                        (v: ProductVariant) =>
                          v.color_id === color.color_id && v.stock > 0
                      );

                      return (
                        <Button
                          key={color.color_id}
                          onClick={() => handleColorChange(color.color_id)}
                          disabled={!hasStock}
                          style={{
                            borderRadius: 8,
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border:
                              color.color_id === selectedColorId
                                ? `2px solid ${token.colorPrimary}`
                                : "1px solid #d9d9d9",
                            background:
                              color.color_id === selectedColorId
                                ? "#e6f7ff"
                                : "white",
                            opacity: !hasStock ? 0.6 : 1,

                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              backgroundColor: color.hex,
                              border: "1px solid #ddd",
                            }}
                          />
                          <span>{color.color_name}</span>
                          {!hasStock && <span> (Hết hàng)</span>}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="ram-selection" style={{ marginBottom: 20 }}>
                  <Title
                    level={5}
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      color: "#2c3e50",
                    }}
                  >
                    RAM
                    <Tooltip title="Chọn dung lượng RAM phù hợp với nhu cầu">
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, color: "#8c8c8c" }}
                      />
                    </Tooltip>
                  </Title>
                  <Radio.Group
                    value={selectedRamId}
                    onChange={(e) => setSelectedRamId(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Space wrap>
                      {availableRams
                        .sort((a: any, b: any) => a.ram_id - b.ram_id)
                        .map((ram: any) => (
                          <Radio.Button
                            key={ram.ram_id}
                            value={ram.ram_id}
                            style={{
                              borderRadius: 8,
                              boxShadow:
                                ram.ram_id === selectedRamId
                                  ? "0 2px 6px rgba(0,0,0,0.1)"
                                  : "none",
                            }}
                            disabled={ram.stock <= 0}
                          >
                            {ram.capacity} {ram.stock <= 0 && "(Hết hàng)"}
                          </Radio.Button>
                        ))}
                    </Space>
                  </Radio.Group>
                </div>

                <div className="storage-selection" style={{ marginBottom: 20 }}>
                  <Title
                    level={5}
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      color: "#2c3e50",
                    }}
                  >
                    Bộ nhớ trong
                    <Tooltip title="Chọn dung lượng bộ nhớ phù hợp với nhu cầu">
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, color: "#8c8c8c" }}
                      />
                    </Tooltip>
                  </Title>
                  <Radio.Group
                    value={selectedStorageId}
                    onChange={(e) => setSelectedStorageId(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Space wrap>
                      {availableStorages.map((storage: any) => (
                        <Radio.Button
                          key={storage.storage_id}
                          value={storage.storage_id}
                          style={{
                            borderRadius: 8,

                            boxShadow:
                              storage.storage_id === selectedStorageId
                                ? "0 2px 6px rgba(0,0,0,0.1)"
                                : "none",
                          }}
                          disabled={storage.stock <= 0}
                        >
                          {storage.storage_capacity}{" "}
                          {storage.stock <= 0 && "(Hết hàng)"}
                        </Radio.Button>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>

                <div className="action-buttons" style={{ marginTop: 24 }}>
                  <Space size="large">
                    <Button
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || selectedVariant.stock <= 0}
                      style={{
                        borderRadius: 8,
                        padding: "0 24px",
                        height: 48,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      onClick={handleBuyNow}
                      disabled={!selectedVariant || selectedVariant.stock <= 0}
                      style={{
                        borderRadius: 8,
                        padding: "0 24px",
                        height: 48,
                        background: "linear-gradient(45deg, #f5222d, #ff7a45)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(245, 34, 45, 0.4)",
                        fontWeight: "bold",
                      }}
                    >
                      Mua ngay
                    </Button>
                  </Space>
                </div>
              </div>
            </Space>
          </Card>

          <Card
            style={{
              marginTop: 16,
              borderRadius: 12,
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <SafetyCertificateOutlined
                  style={{ fontSize: 24, color: "#52c41a" }}
                />
                <div>
                  <Text strong>Bảo hành chính hãng 12 tháng</Text>
                  <div>
                    <Text type="secondary">
                      Bao gồm cả lỗi phần mềm và phần cứng
                    </Text>
                  </div>
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircleOutlined
                  style={{ fontSize: 24, color: "#1890ff" }}
                />
                <div>
                  <Text strong>Giao hàng miễn phí toàn quốc</Text>
                  <div>
                    <Text type="secondary">
                      Nhận hàng trong vòng 24h tại các thành phố lớn
                    </Text>
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      <ProductDescriptions product={product} />
      <ProductReviews product={product} />
      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
      />
    </div>
  );
};
export default ProductDetail;
