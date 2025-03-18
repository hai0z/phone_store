import React, { useState } from "react";
import { Modal, Form, Select, Button, Input } from "antd";
import Location from "../../../../constants/location.json";
import { Location as LocationType } from "../../../../types";

interface AddAddressModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const location: LocationType[] = JSON.parse(JSON.stringify(Location));
  const [selectedCity, setSelectedCity] = useState<LocationType | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [addressForm] = Form.useForm();
  const handleCityChange = (value: string) => {
    const city = location.find((c) => c.code === Number(value));
    setSelectedCity(city || null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    addressForm.setFieldsValue({
      district: undefined,
      ward: undefined,
      street: undefined,
    });
  };

  const handleDistrictChange = (value: string) => {
    if (!selectedCity) return;

    const district = selectedCity.districts.find(
      (d) => d.code === Number(value)
    );
    setSelectedDistrict(district || null);
    setSelectedWard(null);
    addressForm.setFieldsValue({
      ward: undefined,
      street: undefined,
    });
  };

  const handleWardChange = (value: string) => {
    if (!selectedDistrict) return;

    const ward = selectedDistrict.wards.find(
      (w: any) => w.code === Number(value)
    );
    setSelectedWard(ward || null);
    addressForm.setFieldsValue({
      street: undefined,
    });
  };

  const onFinish = (values: any) => {
    const formattedAddress = {
      ...values,
      city_name: selectedCity?.name,
      district_name: selectedDistrict?.name,
      ward_name: selectedWard?.name,
    };
    console.log(formattedAddress);
  };

  return (
    <Modal
      title="Thêm địa chỉ mới"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form form={addressForm} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="city"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
        >
          <Select
            placeholder="Chọn tỉnh/thành phố"
            onChange={handleCityChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={location.map((city) => ({
              value: city.code,
              label: city.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
        >
          <Select
            placeholder="Chọn quận/huyện"
            onChange={handleDistrictChange}
            disabled={!selectedCity}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLocaleLowerCase()
                .includes(input.toLocaleLowerCase())
            }
            options={selectedCity?.districts.map((district: any) => ({
              value: district.code,
              label: district.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="ward"
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
        >
          <Select
            placeholder="Chọn phường/xã"
            onChange={handleWardChange}
            disabled={!selectedDistrict}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLocaleLowerCase()
                .includes(input.toLocaleLowerCase())
            }
            options={selectedDistrict?.wards.map((ward: any) => ({
              value: ward.code,
              label: ward.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="street"
          label="Địa chỉ cụ thể"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input
            placeholder="Nhập số nhà, tên đường..."
            disabled={!selectedWard}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm địa chỉ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAddressModal;
