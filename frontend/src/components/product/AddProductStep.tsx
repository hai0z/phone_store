import React from "react";
import { Steps } from "antd";

interface AddProductStepProps {
  current: number;
}

const AddProductStep: React.FC<AddProductStepProps> = ({ current }) => {
  const items = [
    {
      title: "Thông tin cơ bản",
      description: "Tên, mô tả, thương hiệu,...",
    },
    {
      title: "Màu sắc và hình ảnh",
      description: "Chọn màu và upload ảnh",
    },
    {
      title: "Cấu hình và giá",
      description: "RAM, bộ nhớ, giá bán,...",
    },
  ];

  return <Steps current={current} items={items} style={{ marginBottom: 24 }} />;
};

export default AddProductStep;
