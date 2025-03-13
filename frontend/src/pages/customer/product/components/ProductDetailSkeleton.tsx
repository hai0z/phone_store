import React from "react";
import { Skeleton, Row, Col, Card, Space, Divider } from "antd";

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <Skeleton.Input active style={{ width: 400, height: 24 }} />
      </div>

      <Row gutter={[24, 24]} style={{ padding: "0 24px" }}>
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Col span={24}>
              <Skeleton.Image active style={{ width: 450, height: 400 }} />
            </Col>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {[...Array(5)].map((_, index) => (
                <Skeleton.Image
                  key={index}
                  active
                  style={{ width: 80, height: 80 }}
                />
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 12 }}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "80%" }} />
            <Space
              direction="vertical"
              style={{ width: "100%", marginTop: 16 }}
            >
              <Skeleton.Input active style={{ width: "40%", height: 32 }} />
              <Skeleton.Input active style={{ width: "60%", height: 24 }} />
              <Divider />
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
              <div>
                <Skeleton.Button active style={{ width: 120, height: 40 }} />
                <Skeleton.Button
                  active
                  style={{ width: 120, height: 40, marginLeft: 16 }}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24, paddingInline: "24px" }}>
        <Col span={24}>
          <Card style={{ borderRadius: 12 }}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "30%" }} />
            <Skeleton.Input
              active
              block
              style={{ height: 40, marginBottom: 16 }}
            />
            <Skeleton active paragraph={{ rows: 10 }} title={false} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24, paddingInline: "24px" }}>
        <Col span={24}>
          <Card style={{ borderRadius: 12 }}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "40%" }} />
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: "center" }}>
                  <Skeleton.Input
                    active
                    style={{ width: "40%", height: 40, marginBottom: 8 }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: "60%", height: 24, marginBottom: 16 }}
                  />
                  <Skeleton active paragraph={{ rows: 4 }} title={false} />
                </div>
              </Col>
              <Col xs={24} md={16}>
                <div style={{ marginBottom: 24 }}>
                  <Skeleton
                    active
                    paragraph={{ rows: 3 }}
                    title={{ width: "30%" }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <Skeleton
                    active
                    paragraph={{ rows: 3 }}
                    title={{ width: "30%" }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <Skeleton
                    active
                    paragraph={{ rows: 3 }}
                    title={{ width: "30%" }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Skeleton.Button active style={{ width: 150, height: 40 }} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailSkeleton;
