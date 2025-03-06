import React from "react";
import { Card, Typography, Divider } from "antd";
import TechnicalSpecs from "../../components/product/TechnicalSpecs";

const { Title } = Typography;

const TechnicalSpecsDemo: React.FC = () => {
  // Sample product data based on the user's provided specifications
  const product = {
    name: "iPhone 14 Pro",
    brand: "iPhone (Apple)",
    release_date: "09/2024",
  };

  const specifications = {
    configuration_and_storage: {
      operating_system: "iOS 18",
      cpu: "Apple A18 6 nhân",
      cpu_speed: "Hãng không công bố",
      gpu: "Apple GPU 5 nhân",
      ram: "8 GB",
      storage: "512 GB",
      available_storage: "497 GB",
      contacts: "Không giới hạn",
    },
    camera_and_display: {
      rear_camera_resolution: {
        main: "48 MP",
        sub: "12 MP",
      },
      rear_camera_video: [
        "HD 720p@30fps",
        "FullHD 1080p@60fps",
        "FullHD 1080p@30fps",
        "FullHD 1080p@25fps",
        "FullHD 1080p@240fps",
        "FullHD 1080p@120fps",
        "4K 2160p@60fps",
        "4K 2160p@30fps",
        "4K 2160p@25fps",
        "4K 2160p@24fps",
        "2.8K 60fps",
      ],
      rear_camera_flash: "Có",
      rear_camera_features: [
        "Điều khiển camera (Camera Control)",
        "Zoom quang học",
        "Zoom kỹ thuật số",
        "Xóa phông",
        "Toàn cảnh (Panorama)",
        "Smart HDR 5",
        "Siêu độ phân giải",
        "Siêu cận (Macro)",
        "Góc siêu rộng (Ultrawide)",
        "Dolby Vision HDR",
        "Deep Fusion",
        "Cinematic",
        "Chụp ảnh liên tục",
        "Chống rung quang học (OIS)",
        "Chế độ hành động (Action Mode)",
        "Bộ lọc màu",
        "Ban đêm (Night Mode)",
        "Photonic Engine",
      ],
      front_camera_resolution: "12 MP",
      front_camera_features: [
        "Smart HDR 5",
        "Xóa phông",
        "Trôi nhanh thời gian (Time Lapse)",
        "Retina Flash",
        "Quay video Full HD",
        "Quay video 4K",
        "Quay chậm (Slow Motion)",
        "Nhãn dán (AR Stickers)",
        "Live Photos",
        "Deep Fusion",
        "Cinematic",
        "Chụp ảnh liên tục",
        "Chụp đêm",
        "Chống rung",
        "Bộ lọc màu",
        "TrueDepth",
        "Photonic Engine",
      ],
      display_technology: "OLED",
      display_resolution: "Super Retina XDR (1179 x 2556 Pixels)",
      display_size: '6.1"',
      refresh_rate: "60 Hz",
      max_brightness: "2000 nits",
      display_glass: "Kính cường lực Ceramic Shield",
    },
    battery_and_charging: {
      battery_capacity: "22 giờ",
      battery_type: "Li-Ion",
      max_charging_support: "20 W",
      battery_features: [
        "Tiết kiệm pin",
        "Sạc pin nhanh",
        "Sạc ngược qua cáp",
        "Sạc không dây MagSafe",
        "Sạc không dây",
      ],
    },
    features: {
      advanced_security: "Mở khoá khuôn mặt Face ID",
      special_features: [
        "Âm thanh Dolby Atmos",
        "Phát hiện va chạm (Crash Detection)",
        "Loa kép",
        "HDR10+",
        "HDR10",
        "DCI-P3",
        "Công nghệ âm thanh Dolby Digital Plus",
        "Công nghệ True Tone",
        "Công nghệ hình ảnh Dolby Vision",
        "Công nghệ HLG",
        "Công nghệ âm thanh Dolby Digital",
        "Chạm 2 lần sáng màn hình",
        "Apple Pay",
      ],
      water_dust_resistance: "IP68",
      recording: "Ghi âm mặc định",
      video_playback: ["MP4", "HEVC"],
      music_playback: ["MP3", "FLAC", "Apple Lossless", "APAC", "AAC"],
    },
    connectivity: {
      mobile_network: "Hỗ trợ 5G",
      sim: "1 Nano SIM & 1 eSIM",
      wifi: ["Wi-Fi MIMO", "Wi-Fi 7"],
      gps: ["QZSS", "iBeacon", "GPS", "GLONASS", "GALILEO", "BEIDOU"],
      bluetooth: "v5.3",
      charging_port: "Type-C",
      headphone_jack: "Type-C",
      other_connections: "NFC",
    },
    design_and_material: {
      design: "Nguyên khối",
      material: "Khung nhôm & Mặt lưng kính cường lực",
      dimensions: {
        length: "147.6 mm",
        width: "71.6 mm",
        thickness: "7.8 mm",
        weight: "170 g",
      },
    },
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <Title level={2}>{product.name}</Title>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <div>
            <strong>Brand:</strong> {product.brand}
          </div>
          <div>
            <strong>Release Date:</strong> {product.release_date}
          </div>
        </div>
        <Divider />

        <TechnicalSpecs specifications={specifications} />
      </Card>
    </div>
  );
};

export default TechnicalSpecsDemo;
