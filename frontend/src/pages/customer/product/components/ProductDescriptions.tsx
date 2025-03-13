import { Button, Tabs, Modal } from "antd";
import { Card } from "antd";
import { Col } from "antd";
import { Row } from "antd";
import { Product } from "../../../../types";
import { useState } from "react";

const ProductDescriptions = ({ product }: { product: Product }) => {
  const [specsModalVisible, setSpecsModalVisible] = useState(false);
  const [articleModalVisible, setArticleModalVisible] = useState(false);

  return (
    <Row style={{ padding: "24px", marginTop: 24 }}>
      <Col span={24}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Tabs
            defaultActiveKey="specs"
            type="card"
            size="large"
            items={[
              {
                key: "specs",
                label: (
                  <span style={{ padding: "0 8px", fontWeight: 500 }}>
                    Thông số kỹ thuật
                  </span>
                ),
                children: (
                  <div>
                    {product?.specs && (
                      <>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                          className="specs-preview"
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: JSON.parse(product.specs) || "",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: "80px",
                              background:
                                "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1))",
                            }}
                          />
                        </div>
                        <div style={{ textAlign: "center", marginTop: "16px" }}>
                          <Button
                            type="primary"
                            onClick={() => setSpecsModalVisible(true)}
                          >
                            Xem thêm
                          </Button>
                        </div>

                        <Modal
                          title="Thông số kỹ thuật"
                          centered
                          style={{
                            overflowY: "scroll",
                            top: 20,
                            height: "80vh",
                          }}
                          open={specsModalVisible}
                          onCancel={() => setSpecsModalVisible(false)}
                          footer={[
                            <Button
                              key="close"
                              type="primary"
                              onClick={() => setSpecsModalVisible(false)}
                            >
                              Đóng
                            </Button>,
                          ]}
                          width={800}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: JSON.parse(product.specs) || "",
                            }}
                          />
                        </Modal>
                      </>
                    )}
                  </div>
                ),
              },

              {
                key: "article",
                label: (
                  <span style={{ padding: "0 8px", fontWeight: 500 }}>
                    Bài viết đánh giá
                  </span>
                ),
                children: (
                  <div>
                    {product?.article && (
                      <>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                          className="article-preview"
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: JSON.parse(product.article) || "",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: "80px",
                              background:
                                "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1))",
                            }}
                          />
                        </div>
                        <div style={{ textAlign: "center", marginTop: "16px" }}>
                          <Button
                            type="primary"
                            onClick={() => setArticleModalVisible(true)}
                          >
                            Xem thêm
                          </Button>
                        </div>

                        <Modal
                          title="Bài viết đánh giá"
                          open={articleModalVisible}
                          centered
                          style={{
                            overflowY: "scroll",
                            overflowX: "hidden",
                            top: 20,
                            height: "80vh",
                          }}
                          onCancel={() => setArticleModalVisible(false)}
                          footer={[
                            <Button
                              key="close"
                              type="primary"
                              onClick={() => setArticleModalVisible(false)}
                            >
                              Đóng
                            </Button>,
                          ]}
                          width={800}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: JSON.parse(product.article) || "",
                            }}
                          />
                        </Modal>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDescriptions;
