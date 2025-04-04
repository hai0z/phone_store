import React from "react";
import { Carousel, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BannerSlider.css";

const { Title, Paragraph } = Typography;

interface BannerImage {
  image_id: number;
  banner_id: number;
  image_url: string;
  title: string;
  description: string | null;
  position: number;
  link_url: string | null;
  created_at: string;
}

interface Banner {
  banner_id: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  images: BannerImage[];
}

const fetchActiveBanners = async (): Promise<Banner[]> => {
  const { data } = await axios.get(
    "http://localhost:8080/api/v1/banners/active"
  );
  return data;
};

const BannerSlider: React.FC = () => {
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery<Banner[]>({
    queryKey: ["activeBanners"],
    queryFn: fetchActiveBanners,
  });

  if (isLoading) {
    return (
      <div
        className="banner-loading"
        style={{
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (
    error ||
    !banners ||
    banners.length === 0 ||
    !banners[0].images ||
    banners[0].images.length === 0
  ) {
    return null; // Không hiển thị gì nếu không có banner
  }

  // Lấy banner đầu tiên có ảnh
  const banner = banners[0];
  const sortedImages = [...banner.images].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="banner-slider-container" style={{ marginBottom: "30px" }}>
      <Carousel autoplay effect="fade" dots={true} className="banner-carousel">
        {sortedImages.map((image) => (
          <div key={image.image_id} className="banner-slide">
            {image.link_url ? (
              <Link to={image.link_url}>
                <div className="banner-image-container">
                  <img
                    src={image.image_url}
                    alt={image.title || "Banner"}
                    className="banner-image"
                  />
                  {(image.title || image.description) && (
                    <div className="banner-content">
                      {image.title && (
                        <Title level={3} className="banner-title">
                          {image.title}
                        </Title>
                      )}
                      {image.description && (
                        <Paragraph className="banner-description">
                          {image.description}
                        </Paragraph>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="banner-image-container">
                <img
                  src={image.image_url}
                  alt={image.title || "Banner"}
                  className="banner-image"
                />
                {(image.title || image.description) && (
                  <div className="banner-content">
                    {image.title && (
                      <Title level={3} className="banner-title">
                        {image.title}
                      </Title>
                    )}
                    {image.description && (
                      <Paragraph className="banner-description">
                        {image.description}
                      </Paragraph>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSlider;
