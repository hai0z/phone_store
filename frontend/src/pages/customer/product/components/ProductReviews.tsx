import { Row, Col, Card } from "antd";
import { Rate, Typography, Tag, Button, Image } from "antd";
import { Product } from "../../../../types";

const { Title, Text, Paragraph } = Typography;
const ProductReviews = ({ product }: { product: Product }) => {
  return (
    <Row style={{ paddingInline: "24px" }}>
      <Card
        style={{
          marginTop: 16,
          borderRadius: 12,
        }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          Đánh giá và nhận xét từ khách hàng
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: "center" }}>
              <Title level={1} style={{ margin: 0, color: "#1890ff" }}>
                4.8
              </Title>
              <Rate
                disabled
                defaultValue={4.8}
                allowHalf
                style={{ fontSize: 16, marginBottom: 8 }}
              />
              <Text type="secondary">Dựa trên 128 đánh giá</Text>

              <div style={{ marginTop: 16 }}>
                <Row align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}>
                    <Text>5 sao</Text>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "85%",
                          height: 8,
                          backgroundColor: "#52c41a",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">85%</Text>
                  </Col>
                </Row>

                <Row align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}>
                    <Text>4 sao</Text>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "10%",
                          height: 8,
                          backgroundColor: "#52c41a",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">10%</Text>
                  </Col>
                </Row>

                <Row align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}>
                    <Text>3 sao</Text>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "3%",
                          height: 8,
                          backgroundColor: "#faad14",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">3%</Text>
                  </Col>
                </Row>

                <Row align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}>
                    <Text>2 sao</Text>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "1%",
                          height: 8,
                          backgroundColor: "#ff4d4f",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">1%</Text>
                  </Col>
                </Row>

                <Row align="middle">
                  <Col span={4}>
                    <Text>1 sao</Text>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "1%",
                          height: 8,
                          backgroundColor: "#ff4d4f",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">1%</Text>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div style={{ marginBottom: 24 }}>
              <Button type="primary" style={{ borderRadius: 8 }}>
                Viết đánh giá
              </Button>
            </div>

            <div className="customer-reviews">
              {/* Review 1 */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <Text strong>Nguyễn Văn A</Text>
                    <Rate
                      disabled
                      defaultValue={5}
                      style={{ fontSize: 14, marginLeft: 8 }}
                    />
                  </div>
                  <Text type="secondary">12/05/2023</Text>
                </div>
                <div>
                  <Tag color="blue" style={{ marginBottom: 8 }}>
                    Đã mua hàng
                  </Tag>
                  <Tag color="green">Phiên bản: Đen, 8GB, 256GB</Tag>
                </div>
                <Paragraph style={{ margin: "12px 0" }}>
                  Sản phẩm rất tốt, đúng như mô tả. Pin trâu, màn hình đẹp,
                  camera chụp rõ nét. Giao hàng nhanh và đóng gói cẩn thận. Rất
                  hài lòng với sản phẩm này!
                </Paragraph>
                <div style={{ display: "flex", gap: 8 }}>
                  <Image.PreviewGroup>
                    <Image
                      width={80}
                      height={80}
                      src="https://placehold.co/80x80/png"
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                    <Image
                      width={80}
                      height={80}
                      src="https://placehold.co/80x80/png"
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                  </Image.PreviewGroup>
                </div>
              </div>

              {/* Review 2 */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <Text strong>Trần Thị B</Text>
                    <Rate
                      disabled
                      defaultValue={4}
                      style={{ fontSize: 14, marginLeft: 8 }}
                    />
                  </div>
                  <Text type="secondary">05/05/2023</Text>
                </div>
                <div>
                  <Tag color="blue" style={{ marginBottom: 8 }}>
                    Đã mua hàng
                  </Tag>
                  <Tag color="green">Phiên bản: Trắng, 8GB, 128GB</Tag>
                </div>
                <Paragraph style={{ margin: "12px 0" }}>
                  Điện thoại chạy rất mượt, thiết kế đẹp. Chỉ tiếc là pin không
                  được trâu như mong đợi. Camera chụp ảnh rất đẹp, đặc biệt là
                  chế độ chụp đêm.
                </Paragraph>
              </div>

              {/* Review 3 */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <Text strong>Lê Văn C</Text>
                    <Rate
                      disabled
                      defaultValue={5}
                      style={{ fontSize: 14, marginLeft: 8 }}
                    />
                  </div>
                  <Text type="secondary">28/04/2023</Text>
                </div>
                <div>
                  <Tag color="blue" style={{ marginBottom: 8 }}>
                    Đã mua hàng
                  </Tag>
                  <Tag color="green">Phiên bản: Xanh, 12GB, 256GB</Tag>
                </div>
                <Paragraph style={{ margin: "12px 0" }}>
                  Quá tuyệt vời, đáng đồng tiền bát gạo. Hiệu năng mạnh mẽ, chơi
                  game không giật lag. Màn hình hiển thị sắc nét, âm thanh to
                  rõ. Rất hài lòng với sản phẩm này!
                </Paragraph>
              </div>

              <div style={{ textAlign: "center" }}>
                <Button type="default">Xem thêm đánh giá</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Row>
  );
};

export default ProductReviews;
