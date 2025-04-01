import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Select,
  Drawer,
  Slider,
  Checkbox,
  Input,
  Pagination,
  Tooltip,
  List,
  InputNumber,
  Spin,
  Flex,
  Card,
  theme,
} from "antd";
import {
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  PercentageOutlined,
  ThunderboltOutlined,
  StarOutlined,
  MobileOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FilterOptions,
  ProductImage,
  ProductVariant,
  Rating,
} from "../../types";
import ProductCard from "./product/components/ProductCard";
import { useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;
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

const PhoneList: React.FC = () => {
  const { token } = useToken();
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedRams, setSelectedRams] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: filterOptions } = useQuery({
    queryKey: ["filterOptions"],
    queryFn: async (): Promise<FilterOptions> => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/filter-options`
      );
      return response.data;
    },
  });
  const { data: products, isFetching } = useQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: async (): Promise<{
      products: Product[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }> => {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/filter?${searchParams.toString()}`
      );
      return response.data;
    },
  });
  // Sample data with more details

  const handleSearch = (value: string) => {
    setSearchParams({ search: value });
    setCurrentPage(1);
  };

  const renderGridView = () => (
    <Row gutter={[24, 24]}>
      {products?.products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );

  const renderListView = () => (
    <List
      itemLayout="horizontal"
      dataSource={products?.products}
      renderItem={(product) => (
        <List.Item
          key={product.product_id}
          style={{
            background: "#fff",
            borderRadius: "12px",
            marginBottom: "16px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Row gutter={24} style={{ width: "100%", alignItems: "center" }}>
            <Col xs={24} sm={6} style={{ textAlign: "center" }}>
              {/* <Badge.Ribbon
                text={phone.tag}
                color={
                  phone.tag === "Mới"
                    ? "#52c41a"
                    : phone.tag === "Bán chạy"
                    ? "#f5222d"
                    : phone.tag === "Giảm sốc"
                    ? "#fa8c16"
                    : "#1890ff"
                }
              >
                <div
                  style={{
                    padding: "20px",
                    background: "#f7f9fc",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    alt={phone.name}
                    src={phone.image}
                    style={{ height: "120px", objectFit: "contain" }}
                  />
                </div>
              </Badge.Ribbon> */}
            </Col>

            {/* <Col xs={24} sm={12}>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ marginBottom: "8px" }}>
                  {phone.name}
                </Title>

                <Space wrap>
                  <Tag color="blue" icon={<MobileOutlined />}>
                    {phone.specs.screen}
                  </Tag>
                  <Tag color="green">{phone.specs.storage}</Tag>
                  <Tag color="purple">{phone.specs.ram}</Tag>
                  <Tag color="cyan" icon={<SettingOutlined />}>
                    {phone.specs.processor}
                  </Tag>
                  <Tag color="magenta" icon={<MobileOutlined />}>
                    {phone.specs.camera}
                  </Tag>
                </Space>

                <div>
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={phone.rating}
                    style={{ fontSize: "14px" }}
                  />
                  <Text type="secondary" style={{ marginLeft: "8px" }}>
                    ({phone.reviews} đánh giá)
                  </Text>
                </div>
              </Space>
            </Col>

            <Col xs={24} sm={6} style={{ textAlign: "right" }}>
              <Space direction="vertical" size="small" align="end">
                <div>
                  <Text type="danger" strong style={{ fontSize: "22px" }}>
                    ${phone.price.toLocaleString()}
                  </Text>
                  <Tag color="red" style={{ marginLeft: "8px" }}>
                    {Math.round(
                      ((phone.originalPrice - phone.price) /
                        phone.originalPrice) *
                        100
                    )}
                    %
                  </Tag>
                </div>
                <Text delete type="secondary">
                  ${phone.originalPrice.toLocaleString()}
                </Text>

                <Space style={{ marginTop: "12px" }}>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    style={{ borderRadius: "8px" }}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    style={{ borderRadius: "8px", border: "1px solid #d9d9d9" }}
                  />
                </Space>
              </Space>
            </Col> */}
          </Row>
        </List.Item>
      )}
    />
  );

  const handleFilterChange = () => {
    const params = new URLSearchParams();

    if (selectedBrands.length > 0) {
      params.set("brandIds", selectedBrands.join(","));
    }
    if (selectedStorages.length > 0) {
      params.set("storages", selectedStorages.join(","));
    }
    if (selectedRams.length > 0) {
      params.set("ram", selectedRams.join(","));
    }
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }

    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const handleQuickFilter = (type: string) => {
    const params = new URLSearchParams();
    switch (type) {
      case "promotion":
        params.set("hasPromotion", "true");
        break;
      case "discount":
        params.set("hasDiscount", "true");
        break;
      case "rating":
        params.set("minRating", "5");
        break;
      case "screen":
        params.set("minScreenSize", "6.5");
        break;
      case "ram":
        params.set("minRam", "8");
        break;
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const renderFilterDrawer = () => (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            color: token.colorPrimary,
          }}
        >
          <FilterOutlined style={{ marginRight: "12px" }} />
          Bộ lọc sản phẩm
        </div>
      }
      placement="right"
      onClose={() => setFilterDrawerVisible(false)}
      open={filterDrawerVisible}
      width={360}
      styles={{
        body: {
          padding: "0 16px",
          backgroundColor: token.colorBgContainer,
        },
        header: {
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: "16px 24px",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "16px 24px",
        },
      }}
      footer={
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            block
            onClick={handleFilterChange}
            size="large"
            style={{
              borderRadius: "8px",
              height: "46px",
              fontWeight: "bold",
            }}
          >
            Áp dụng bộ lọc
          </Button>
          <Button
            block
            onClick={() => {
              setSelectedBrands([]);
              setSelectedStorages([]);
              setSelectedRams([]);
              setPriceRange([0, 2000]);
              setSearchParams({});
            }}
            style={{
              marginTop: "12px",
              borderRadius: "8px",
              height: "46px",
            }}
          >
            Đặt lại tất cả
          </Button>
        </Space>
      }
    >
      <div style={{ marginTop: "16px" }}>
        <Card
          title={
            <Text strong style={{ fontSize: "16px" }}>
              <span style={{ color: token.colorPrimary, marginRight: "8px" }}>
                ●
              </span>
              Thương hiệu
            </Text>
          }
          bordered={false}
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{
            borderBottom: "none",
            padding: "16px 16px 0 16px",
          }}
          bodyStyle={{ padding: "8px 16px 16px 16px" }}
        >
          <Checkbox.Group
            value={selectedBrands}
            onChange={(values) => setSelectedBrands(values as string[])}
            style={{ width: "100%" }}
          >
            <Row gutter={[8, 12]}>
              {filterOptions?.brands.map((brand) => (
                <Col span={12} key={brand.brand_id}>
                  <Checkbox value={brand.brand_id} style={{ fontSize: "14px" }}>
                    {brand.brand_name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>

        <Card
          title={
            <Text strong style={{ fontSize: "16px" }}>
              <span style={{ color: token.colorSuccess, marginRight: "8px" }}>
                ●
              </span>
              Bộ nhớ trong
            </Text>
          }
          bordered={false}
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{
            borderBottom: "none",
            padding: "16px 16px 0 16px",
          }}
          bodyStyle={{ padding: "8px 16px 16px 16px" }}
        >
          <Checkbox.Group
            value={selectedStorages}
            onChange={(values) => setSelectedStorages(values as string[])}
            style={{ width: "100%" }}
          >
            <Row gutter={[8, 12]}>
              {filterOptions?.storages.map((storage) => (
                <Col span={12} key={storage.storage_id}>
                  <Checkbox
                    value={storage.storage_id}
                    style={{ fontSize: "14px" }}
                  >
                    {storage.storage_capacity}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>

        <Card
          title={
            <Text strong style={{ fontSize: "16px" }}>
              <span style={{ color: token.colorWarning, marginRight: "8px" }}>
                ●
              </span>
              RAM
            </Text>
          }
          bordered={false}
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{
            borderBottom: "none",
            padding: "16px 16px 0 16px",
          }}
          bodyStyle={{ padding: "8px 16px 16px 16px" }}
        >
          <Checkbox.Group
            value={selectedRams}
            onChange={(values) => setSelectedRams(values as string[])}
            style={{ width: "100%" }}
          >
            <Row gutter={[8, 12]}>
              {filterOptions?.ram.map((ram) => (
                <Col span={12} key={ram.ram_id}>
                  <Checkbox value={ram.ram_id} style={{ fontSize: "14px" }}>
                    {ram.capacity}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>

        <Card
          title={
            <Text strong style={{ fontSize: "16px" }}>
              <span style={{ color: token.colorError, marginRight: "8px" }}>
                ●
              </span>
              Khoảng giá
            </Text>
          }
          bordered={false}
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{
            borderBottom: "none",
            padding: "16px 16px 0 16px",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <Slider
            range
            min={0}
            max={2000}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            tooltip={{ formatter: (value) => `$${value}` }}
            styles={{
              track: { backgroundColor: token.colorError },
              handle: { borderColor: token.colorError },
            }}
          />
          <Flex justify="space-between" style={{ marginTop: "16px" }}>
            <InputNumber
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(value) => setPriceRange([value || 0, priceRange[1]])}
              formatter={(value) => `$ ${value}`}
              style={{ width: "45%" }}
            />
            <Text type="secondary">đến</Text>
            <InputNumber
              min={priceRange[0]}
              max={2000}
              value={priceRange[1]}
              onChange={(value) =>
                setPriceRange([priceRange[0], value || 2000])
              }
              formatter={(value) => `$ ${value}`}
              style={{ width: "45%" }}
            />
          </Flex>
        </Card>
      </div>
    </Drawer>
  );

  return (
    <Layout.Content style={{ padding: "24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Filter and Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Điện thoại
            </Title>
            <Search
              placeholder="Tìm kiếm điện thoại..."
              onSearch={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
          </div>

          <Space wrap>
            <Select
              defaultValue="price_asc"
              style={{ width: 180 }}
              onChange={(value) => setSearchParams({ sortBy: value })}
              options={[
                { label: "Giá thấp đến cao", value: "price_asc" },
                { label: "Giá cao đến thấp", value: "price_desc" },
              ]}
              suffixIcon={<DollarOutlined />}
            />

            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
            >
              Bộ lọc
            </Button>
          </Space>
        </div>
        {/* Quick Filter Tags */}
        <div style={{ marginBottom: "24px" }}>
          <Space wrap size="middle">
            <Button
              type="default"
              icon={<ThunderboltOutlined />}
              shape="round"
              onClick={() => handleQuickFilter("promotion")}
            >
              Khuyến mãi hot
            </Button>
            <Button
              type="default"
              icon={<PercentageOutlined />}
              shape="round"
              onClick={() => handleQuickFilter("discount")}
            >
              Giảm giá sốc
            </Button>
            <Button
              type="default"
              icon={<StarOutlined />}
              shape="round"
              onClick={() => handleQuickFilter("rating")}
            >
              Đánh giá 5 sao
            </Button>
            <Button
              type="default"
              icon={<MobileOutlined />}
              shape="round"
              onClick={() => handleQuickFilter("screen")}
            >
              Màn hình lớn
            </Button>
            <Button
              type="default"
              shape="round"
              onClick={() => handleQuickFilter("ram")}
            >
              RAM 8GB+
            </Button>
          </Space>
        </div>
        {/* Active Filters */}
        {(selectedBrands.length > 0 ||
          selectedStorages.length > 0 ||
          selectedRams.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 2000) && (
          <div style={{ marginBottom: "24px" }}>
            <Space wrap>
              <Text strong>Bộ lọc đang chọn:</Text>

              {/* {selectedBrands.map((brand) => (
                <Tag
                  key={brand}
                  closable
                  onClose={() =>
                    setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                  }
                  color="blue"
                >
                  {brands.find((b) => b.value === brand)?.label}
                </Tag>
              ))} */}

              {selectedStorages.map((storage) => (
                <Tag
                  key={storage}
                  closable
                  onClose={() =>
                    setSelectedStorages(
                      selectedStorages.filter((s) => s !== storage)
                    )
                  }
                  color="green"
                >
                  Bộ nhớ: {storage}GB
                </Tag>
              ))}

              {selectedRams.map((ram) => (
                <Tag
                  key={ram}
                  closable
                  onClose={() =>
                    setSelectedRams(selectedRams.filter((r) => r !== ram))
                  }
                  color="purple"
                >
                  RAM: {ram}GB
                </Tag>
              ))}

              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <Tag
                  closable
                  onClose={() => setPriceRange([0, 2000])}
                  color="red"
                >
                  Giá: ${priceRange[0]} - ${priceRange[1]}
                </Tag>
              )}

              <Button
                type="link"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedStorages([]);
                  setSelectedRams([]);
                  setPriceRange([0, 2000]);
                }}
              >
                Xóa tất cả
              </Button>
            </Space>
          </div>
        )}
        {isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Product List */}

            <div style={{ marginBottom: "24px" }}>
              {viewMode === "grid" ? renderGridView() : renderListView()}
            </div>

            {/* Pagination */}
            <Flex justify="center" align="center" style={{ marginTop: "32px" }}>
              <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={products?.pagination.total}
                pageSize={products?.pagination.limit || 12}
                showSizeChanger={false}
              />
            </Flex>
          </>
        )}
        {/* Filter Drawer */}
        {renderFilterDrawer()}
      </div>
    </Layout.Content>
  );
};

export default PhoneList;
