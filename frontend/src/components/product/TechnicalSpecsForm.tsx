import React from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  Collapse,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TechnicalSpecsFormProps {
  form: any;
}

const TechnicalSpecsForm: React.FC<TechnicalSpecsFormProps> = ({ form }) => {
  return (
    <Card title="Technical Specifications">
      <Collapse defaultActiveKey={["configuration_and_storage"]} expandIconPosition="end">
        <Panel header="Configuration & Storage" key="configuration_and_storage">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "operating_system"]}
                label="Operating System"
              >
                <Input placeholder="e.g. iOS 18, Android 14" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "cpu"]}
                label="CPU"
              >
                <Input placeholder="e.g. Apple A18 6 nhân" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "cpu_speed"]}
                label="CPU Speed"
              >
                <Input placeholder="e.g. 2.8 GHz" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "gpu"]}
                label="GPU"
              >
                <Input placeholder="e.g. Apple GPU 5 nhân" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "ram"]}
                label="RAM"
              >
                <Input placeholder="e.g. 8 GB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "storage"]}
                label="Storage"
              >
                <Input placeholder="e.g. 512 GB" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "available_storage"]}
                label="Available Storage"
              >
                <Input placeholder="e.g. 497 GB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "configuration_and_storage", "contacts"]}
                label="Contacts"
              >
                <Input placeholder="e.g. Không giới hạn" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel header="Camera & Display" key="camera_and_display">
          <Text strong style={{ display: "block", marginBottom: "16px" }}>
            Rear Camera Resolution
          </Text>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={[
                  "specifications",
                  "camera_and_display",
                  "rear_camera_resolution",
                  "main",
                ]}
                label="Main Camera"
              >
                <Input placeholder="e.g. 48 MP" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={[
                  "specifications",
                  "camera_and_display",
                  "rear_camera_resolution",
                  "sub",
                ]}
                label="Sub Camera"
              >
                <Input placeholder="e.g. 12 MP" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={["specifications", "camera_and_display", "rear_camera_flash"]}
            label="Rear Camera Flash"
          >
            <Input placeholder="e.g. Có" />
          </Form.Item>

          <Form.List
            name={["specifications", "camera_and_display", "rear_camera_video"]}
          >
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong>Rear Camera Video</Text>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Add Video Format
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      style={{ marginBottom: 0, width: "300px" }}
                    >
                      <Input placeholder="e.g. 4K 2160p@60fps" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <Divider dashed />

          <Form.List
            name={["specifications", "camera_and_display", "rear_camera_features"]}
          >
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong>Rear Camera Features</Text>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Add Feature
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      style={{ marginBottom: 0, width: "300px" }}
                    >
                      <Input placeholder="e.g. Smart HDR 5" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <Divider dashed />

          <Form.Item
            name={["specifications", "camera_and_display", "front_camera_resolution"]}
            label="Front Camera Resolution"
          >
            <Input placeholder="e.g. 12 MP" />
          </Form.Item>

          <Form.List
            name={["specifications", "camera_and_display", "front_camera_features"]}
          >
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong>Front Camera Features</Text>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Add Feature
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      style={{ marginBottom: 0, width: "300px" }}
                    >
                      <Input placeholder="e.g. Smart HDR 5" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <Divider dashed />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "display_technology"]}
                label="Display Technology"
              >
                <Input placeholder="e.g. OLED" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "display_resolution"]}
                label="Display Resolution"
              >
                <Input placeholder="e.g. Super Retina XDR (1179 x 2556 Pixels)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "display_size"]}
                label="Display Size"
              >
                <Input placeholder='e.g. 6.1"' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "refresh_rate"]}
                label="Refresh Rate"
              >
                <Input placeholder="e.g. 60 Hz" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "max_brightness"]}
                label="Max Brightness"
              >
                <Input placeholder="e.g. 2000 nits" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "camera_and_display", "display_glass"]}
                label="Display Glass"
              >
                <Input placeholder="e.g. Kính cường lực Ceramic Shield" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel header="Battery & Charging" key="battery_and_charging">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["specifications", "battery_and_charging", "battery_capacity"]}
                label="Battery Capacity"
              >
                <Input placeholder="e.g. 22 giờ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["specifications", "battery_and_charging", "battery_type"]}
                label="Battery Type"
              >
                <Input placeholder="e.g. Li-Ion" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={["specifications", "battery_and_charging", "max_charging_support"]}
            label="Max Charging Support"
          >
            <Input placeholder="e.g. 20 W"