import React from "react";
import {
  Collapse,
  Typography,
  Table,
  Tag,
  List,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface SpecificationProps {
  specifications: {
    configuration_and_storage?: {
      operating_system?: string;
      cpu?: string;
      cpu_speed?: string;
      gpu?: string;
      ram?: string;
      storage?: string;
      available_storage?: string;
      contacts?: string;
    };
    camera_and_display?: {
      rear_camera_resolution?: {
        main?: string;
        sub?: string;
      };
      rear_camera_video?: string[];
      rear_camera_flash?: string;
      rear_camera_features?: string[];
      front_camera_resolution?: string;
      front_camera_features?: string[];
      display_technology?: string;
      display_resolution?: string;
      display_size?: string;
      refresh_rate?: string;
      max_brightness?: string;
      display_glass?: string;
    };
    battery_and_charging?: {
      battery_capacity?: string;
      battery_type?: string;
      max_charging_support?: string;
      battery_features?: string[];
    };
    features?: {
      advanced_security?: string;
      special_features?: string[];
      water_dust_resistance?: string;
      recording?: string;
      video_playback?: string[];
      music_playback?: string[];
    };
    connectivity?: {
      mobile_network?: string;
      sim?: string;
      wifi?: string[];
      gps?: string[];
      bluetooth?: string;
      charging_port?: string;
      headphone_jack?: string;
      other_connections?: string;
    };
    design_and_material?: {
      design?: string;
      material?: string;
      dimensions?: {
        length?: string;
        width?: string;
        thickness?: string;
        weight?: string;
      };
    };
  };
}

const TechnicalSpecs: React.FC<SpecificationProps> = ({ specifications }) => {
  // Helper function to render key-value pairs
  const renderKeyValuePairs = (data: Record<string, any>) => {
    return Object.entries(data || {}).map(([key, value]) => {
      // Skip rendering if value is an object (except for rear_camera_resolution) or array
      if (
        (typeof value === "object" &&
          key !== "rear_camera_resolution" &&
          key !== "dimensions" &&
          !Array.isArray(value)) ||
        value === undefined
      ) {
        return null;
      }

      // Format the key for display
      const formattedKey = key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Render arrays as tags
      if (Array.isArray(value)) {
        return (
          <Row key={key} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Text strong>{formattedKey}:</Text>
              <div style={{ marginTop: 8 }}>
                {value.map((item, index) => (
                  <Tag
                    color="blue"
                    key={index}
                    style={{ margin: "4px" }}
                    icon={<CheckCircleOutlined />}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </Col>
          </Row>
        );
      }

      // Special handling for rear camera resolution
      if (key === "rear_camera_resolution" && typeof value === "object") {
        return (
          <Row key={key} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Text strong>{formattedKey}:</Text>
              <div style={{ marginLeft: 24, marginTop: 8 }}>
                {Object.entries(value).map(([camKey, camValue]) => (
                  <div key={camKey}>
                    <Text>
                      {camKey.charAt(0).toUpperCase() + camKey.slice(1)}:{" "}
                      {camValue}
                    </Text>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        );
      }

      // Special handling for dimensions
      if (key === "dimensions" && typeof value === "object") {
        return (
          <Row key={key} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Text strong>{formattedKey}:</Text>
              <div style={{ marginLeft: 24, marginTop: 8 }}>
                {Object.entries(value).map(([dimKey, dimValue]) => (
                  <div key={dimKey}>
                    <Text>
                      {dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}:{" "}
                      {dimValue}
                    </Text>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        );
      }

      // Default rendering for simple key-value pairs
      return (
        <Row key={key} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Text strong>{formattedKey}:</Text>
          </Col>
          <Col span={16}>
            <Text>{value}</Text>
          </Col>
        </Row>
      );
    });
  };

  return (
    <Card title={<Title level={4}>Technical Specifications</Title>}>
      <Collapse
        defaultActiveKey={["configuration_and_storage"]}
        expandIconPosition="end"
      >
        {specifications.configuration_and_storage && (
          <Panel
            header="Configuration & Storage"
            key="configuration_and_storage"
          >
            {renderKeyValuePairs(specifications.configuration_and_storage)}
          </Panel>
        )}

        {specifications.camera_and_display && (
          <Panel header="Camera & Display" key="camera_and_display">
            {renderKeyValuePairs(specifications.camera_and_display)}
          </Panel>
        )}

        {specifications.battery_and_charging && (
          <Panel header="Battery & Charging" key="battery_and_charging">
            {renderKeyValuePairs(specifications.battery_and_charging)}
          </Panel>
        )}

        {specifications.features && (
          <Panel header="Features" key="features">
            {renderKeyValuePairs(specifications.features)}
          </Panel>
        )}

        {specifications.connectivity && (
          <Panel header="Connectivity" key="connectivity">
            {renderKeyValuePairs(specifications.connectivity)}
          </Panel>
        )}

        {specifications.design_and_material && (
          <Panel header="Design & Material" key="design_and_material">
            {renderKeyValuePairs(specifications.design_and_material)}
          </Panel>
        )}
      </Collapse>
    </Card>
  );
};

export default TechnicalSpecs;
