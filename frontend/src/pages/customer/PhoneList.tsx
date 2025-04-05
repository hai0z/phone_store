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
  Spin,
  Flex,
  Card,
  theme,
  Divider,
  Badge,
  Empty,
  InputNumber,
} from "antd";
import {
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ThunderboltOutlined,
  StarOutlined,
  MobileOutlined,
  DollarOutlined,
  ShoppingOutlined,
  SearchOutlined,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedRams, setSelectedRams] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions?.priceRange.min!,
    filterOptions?.priceRange.max!,
  ]);

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

  const handleSearch = (value: string) => {
    setSearchParams({ search: value });
    setCurrentPage(1);
  };

  const renderGridView = () => {
    if (!products?.products.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không tìm thấy sản phẩm nào phù hợp"
          style={{ margin: "48px 0" }}
        />
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {products?.products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
            <Badge.Ribbon
              text={product.sold_count > 100 ? "Bán chạy" : null}
              color="red"
              style={{ display: product.sold_count > 100 ? "block" : "none" }}
            >
              <ProductCard product={product} />
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    );
  };

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
    if (
      priceRange[0] > filterOptions?.priceRange.min! ||
      priceRange[1] < filterOptions?.priceRange.max!
    ) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }

    setSearchParams(params);
    setCurrentPage(1);
    setFilterDrawerVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const totalFilters =
    selectedBrands.length +
    selectedStorages.length +
    selectedRams.length +
    (priceRange[0] > filterOptions?.priceRange.min! ||
    priceRange[1] < filterOptions?.priceRange.max!
      ? 1
      : 0);

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
            icon={<FilterOutlined />}
          >
            Áp dụng bộ lọc
          </Button>
          <Button
            block
            onClick={() => {
              setSelectedBrands([]);
              setSelectedStorages([]);
              setSelectedRams([]);
              setPriceRange([
                filterOptions?.priceRange.min!,
                filterOptions?.priceRange.max!,
              ]);
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
            <Flex align="center">
              <MobileOutlined
                style={{
                  color: token.colorPrimary,
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              <Text strong style={{ fontSize: "16px" }}>
                Thương hiệu
              </Text>
              {selectedBrands.length > 0 && (
                <Badge
                  count={selectedBrands.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: token.colorPrimary,
                  }}
                />
              )}
            </Flex>
          }
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
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
            <Flex align="center">
              <ThunderboltOutlined
                style={{
                  color: token.colorSuccess,
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              <Text strong style={{ fontSize: "16px" }}>
                Bộ nhớ trong
              </Text>
              {selectedStorages.length > 0 && (
                <Badge
                  count={selectedStorages.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: token.colorSuccess,
                  }}
                />
              )}
            </Flex>
          }
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
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
            <Flex align="center">
              <StarOutlined
                style={{
                  color: token.colorWarning,
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              <Text strong style={{ fontSize: "16px" }}>
                RAM
              </Text>
              {selectedRams.length > 0 && (
                <Badge
                  count={selectedRams.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: token.colorWarning,
                  }}
                />
              )}
            </Flex>
          }
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
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
            <Flex align="center">
              <DollarOutlined
                style={{
                  color: token.colorError,
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              <Text strong style={{ fontSize: "16px" }}>
                Khoảng giá
              </Text>
            </Flex>
          }
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Slider
            range
            min={filterOptions?.priceRange.min!}
            max={filterOptions?.priceRange.max!}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            tooltip={{
              formatter: (value?: number) =>
                value
                  ? `${Number(value).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}`
                  : "",
            }}
            styles={{
              track: { backgroundColor: token.colorError },
              handle: { borderColor: token.colorError },
              rail: { backgroundColor: token.colorErrorBg },
            }}
          />
          <Flex justify="space-between" style={{ marginTop: "16px" }}>
            <InputNumber
              min={filterOptions?.priceRange.min!}
              max={filterOptions?.priceRange.max!}
              value={priceRange[0]}
              onChange={(value: number | null) =>
                setPriceRange([value || 0, priceRange[1]])
              }
              formatter={(value) =>
                `${Number(value).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}`
              }
              style={{ width: "45%" }}
            />
            <Text type="secondary">đến</Text>
            <InputNumber
              min={filterOptions?.priceRange.min!}
              max={filterOptions?.priceRange.max!}
              value={priceRange[1]}
              onChange={(value: number | null) =>
                setPriceRange([priceRange[0], value || 0])
              }
              formatter={(value) =>
                `${Number(value).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}`
              }
              style={{ width: "45%" }}
            />
          </Flex>
        </Card>
      </div>
    </Drawer>
  );

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedStorages([]);
    setSelectedRams([]);
    setPriceRange([
      filterOptions?.priceRange.min!,
      filterOptions?.priceRange.max!,
    ]);
    setSearchParams({});
  };

  return (
    <Layout.Content
      style={{ padding: "24px", backgroundColor: token.colorBgContainer }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Page Title and Search */}
        <Card style={{ marginBottom: "24px", borderRadius: "12px" }}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
            <Flex align="center" gap={16}>
              <Title level={3} style={{ margin: 0 }}>
                <ShoppingOutlined
                  style={{ marginRight: "12px", color: token.colorPrimary }}
                />
                Điện thoại
              </Title>
              <Search
                placeholder="Tìm kiếm điện thoại..."
                onSearch={handleSearch}
                style={{ width: 300 }}
                allowClear
                prefix={<SearchOutlined />}
                size="large"
              />
            </Flex>

            <Flex gap={12}>
              <Select
                defaultValue="price_asc"
                style={{ width: 180 }}
                onChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("sortBy", value);
                  setSearchParams(params);
                }}
                options={[
                  { label: "Giá thấp đến cao", value: "price_asc" },
                  { label: "Giá cao đến thấp", value: "price_desc" },
                ]}
                suffixIcon={<DollarOutlined />}
                size="large"
              />

              <Button
                type={totalFilters > 0 ? "primary" : "default"}
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                size="large"
              >
                Bộ lọc
                {totalFilters > 0 && (
                  <Badge
                    count={totalFilters}
                    style={{
                      marginLeft: "8px",
                      backgroundColor: token.colorBgContainer,
                      color: token.colorPrimary,
                    }}
                  />
                )}
              </Button>

              <Space>
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === "grid" ? "primary" : "default"}
                  onClick={() => setViewMode("grid")}
                  size="large"
                />
                <Button
                  icon={<UnorderedListOutlined />}
                  type={viewMode === "list" ? "primary" : "default"}
                  onClick={() => setViewMode("list")}
                  size="large"
                />
              </Space>
            </Flex>
          </Flex>
        </Card>

        {/* Active Filters */}
        {(selectedBrands.length > 0 ||
          selectedStorages.length > 0 ||
          selectedRams.length > 0 ||
          priceRange[0] > filterOptions?.priceRange.min! ||
          priceRange[1] < filterOptions?.priceRange.max!) && (
          <Card style={{ marginBottom: "24px", borderRadius: "12px" }}>
            <Flex align="center" wrap gap={8}>
              <Text strong style={{ marginRight: "8px" }}>
                Bộ lọc:
              </Text>

              {selectedBrands.map((brand) => (
                <Tag
                  key={brand}
                  closable
                  onClose={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set(
                      "brandIds",
                      selectedBrands.filter((b) => b !== brand).join(",")
                    );
                    setSearchParams(params);
                    setSelectedBrands(
                      selectedBrands.filter((b) => b !== brand)
                    );
                  }}
                  color="blue"
                  icon={<MobileOutlined />}
                  style={{ padding: "4px 8px", borderRadius: "6px" }}
                >
                  {
                    filterOptions?.brands.find((b) => b.brand_id === +brand)
                      ?.brand_name
                  }
                </Tag>
              ))}

              {selectedStorages.map((storage) => (
                <Tag
                  key={storage}
                  closable
                  onClose={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set(
                      "storages",
                      selectedStorages.filter((s) => s !== storage).join(",")
                    );
                    setSearchParams(params);
                    setSelectedStorages(
                      selectedStorages.filter((s) => s !== storage)
                    );
                  }}
                  color="green"
                  icon={<ThunderboltOutlined />}
                  style={{ padding: "4px 8px", borderRadius: "6px" }}
                >
                  {
                    filterOptions?.storages.find(
                      (s) => s.storage_id === +storage
                    )?.storage_capacity
                  }
                </Tag>
              ))}

              {selectedRams.map((ram) => (
                <Tag
                  key={ram}
                  closable
                  onClose={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set(
                      "ram",
                      selectedRams.filter((r) => r !== ram).join(",")
                    );
                    setSearchParams(params);
                    setSelectedRams(selectedRams.filter((r) => r !== ram));
                  }}
                  color="purple"
                  icon={<StarOutlined />}
                  style={{ padding: "4px 8px", borderRadius: "6px" }}
                >
                  {filterOptions?.ram.find((r) => r.ram_id === +ram)?.capacity}
                </Tag>
              ))}

              {(priceRange[0] > filterOptions?.priceRange.min! ||
                priceRange[1] < filterOptions?.priceRange.max!) && (
                <Tag
                  closable
                  onClose={() => {
                    setPriceRange([
                      filterOptions?.priceRange.min!,
                      filterOptions?.priceRange.max!,
                    ]);
                    const params = new URLSearchParams(searchParams);
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    setSearchParams(params);
                  }}
                  color="red"
                  icon={<DollarOutlined />}
                  style={{ padding: "4px 8px", borderRadius: "6px" }}
                >
                  {priceRange[0].toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                  -{" "}
                  {priceRange[1].toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              )}

              <Button
                type="link"
                onClick={clearAllFilters}
                style={{ marginLeft: "auto" }}
              >
                Xóa tất cả
              </Button>
            </Flex>
          </Card>
        )}

        {/* Product Stats */}
        {products && !isFetching && (
          <Card style={{ marginBottom: "24px", borderRadius: "12px" }}>
            <Flex justify="space-between" align="center">
              <Text>
                Hiển thị <Text strong>{products.products.length}</Text> trên
                tổng số <Text strong>{products.pagination.total}</Text> sản phẩm
              </Text>
              <Text type="secondary">
                Trang {currentPage}/{products.pagination.totalPages}
              </Text>
            </Flex>
          </Card>
        )}

        {/* Product Grid */}
        <Card style={{ borderRadius: "12px" }}>
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
              <div>{renderGridView()}</div>

              {/* Pagination */}
              {products && products.pagination.total > 0 && (
                <>
                  <Divider />
                  <Flex justify="center" align="center">
                    <Pagination
                      current={currentPage}
                      onChange={handlePageChange}
                      total={products?.pagination.total}
                      pageSize={products?.pagination.limit || 12}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total) => `Tổng ${total} sản phẩm`}
                    />
                  </Flex>
                </>
              )}
            </>
          )}
        </Card>

        {/* Filter Drawer */}
        {renderFilterDrawer()}
      </div>
    </Layout.Content>
  );
};

export default PhoneList;
