import React, { useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Rate,
  Tag,
  Select,
  Drawer,
  Radio,
  Slider,
  Checkbox,
  Divider,
  Badge,
  Input,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Meta } = Card;

interface Phone {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  tag?: string;
  specs: {
    screen: string;
    storage: string;
  };
}

const PhoneList: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sample data
  const phones: Phone[] = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      image:
        "https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-15-pro-max_3.png",
      price: 1299,
      originalPrice: 1399,
      rating: 5,
      reviews: 128,
      tag: "Mới",
      specs: {
        screen: '6.7"',
        storage: "256GB",
      },
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      image:
        "https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s24-ultra-xam-1.png",
      price: 1199,
      originalPrice: 1299,
      rating: 4.5,
      reviews: 96,
      tag: "Bán chạy",
      specs: {
        screen: '6.8"',
        storage: "512GB",
      },
    },
  ];

  const brands = [
    { label: "Apple", value: "apple" },
    { label: "Samsung", value: "samsung" },
    { label: "Xiaomi", value: "xiaomi" },
    { label: "OPPO", value: "oppo" },
    { label: "Vivo", value: "vivo" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Điện thoại</Title>
        <Space>
          <Select
            defaultValue="featured"
            style={{ width: 200 }}
            onChange={(value) => setSortBy(value)}
            options={[
              { label: "Nổi bật", value: "featured" },
              { label: "Giá thấp đến cao", value: "price_asc" },
              { label: "Giá cao đến thấp", value: "price_desc" },
              { label: "Đánh giá cao nhất", value: "rating" },
            ]}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerVisible(true)}
          >
            Bộ lọc
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {phones.map((phone) => (
          <Col xs={24} sm={12} md={8} lg={6} key={phone.id}>
            <Badge.Ribbon text={phone.tag} color="#f50">
              <Card
                hoverable
                cover={
                  <img
                    alt={phone.name}
                    src={phone.image}
                    style={{ padding: 20 }}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    key="favorite"
                  />,
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    key="add-to-cart"
                  >
                    Thêm vào giỏ
                  </Button>,
                ]}
              >
                <Meta
                  title={phone.name}
                  description={
                    <Space direction="vertical">
                      <Space>
                        <Text type="danger" strong style={{ fontSize: 18 }}>
                          ${phone.price}
                        </Text>
                        <Text delete type="secondary">
                          ${phone.originalPrice}
                        </Text>
                      </Space>
                      <Space>
                        <Rate disabled defaultValue={phone.rating} />
                        <Text type="secondary">({phone.reviews})</Text>
                      </Space>
                      <Space>
                        <Tag color="blue">{phone.specs.screen}</Tag>
                        <Tag color="green">{phone.specs.storage}</Tag>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      <Drawer
        title="Bộ lọc"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={300}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Title level={5}>Hãng sản xuất</Title>
            <Checkbox.Group
              options={brands}
              value={selectedBrands}
              onChange={(values) => setSelectedBrands(values as string[])}
            />
          </div>

          <div>
            <Title level={5}>Mức giá</Title>
            <Slider
              range
              min={0}
              max={2000}
              defaultValue={priceRange}
              onChange={(values) => setPriceRange(values as [number, number])}
              tipFormatter={(value) => `$${value}`}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>${priceRange[0]}</Text>
              <Text>${priceRange[1]}</Text>
            </div>
          </div>

          <div>
            <Title level={5}>Dung lượng</Title>
            <Radio.Group defaultValue="all">
              <Space direction="vertical">
                <Radio value="all">Tất cả</Radio>
                <Radio value="128">128GB</Radio>
                <Radio value="256">256GB</Radio>
                <Radio value="512">512GB</Radio>
                <Radio value="1024">1TB</Radio>
              </Space>
            </Radio.Group>
          </div>
        </Space>
      </Drawer>
    </div>
  );
};

export default PhoneList;
