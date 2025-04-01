import React, { useState } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  Input,
  Checkbox,
  message,
  notification,
} from "antd";
import Location from "../../../../constants/location.json";
import { Location as LocationType } from "../../../../types";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

interface AddAddressModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  onAddAddress: () => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  onAddAddress,
}) => {
  const location: LocationType[] = JSON.parse(JSON.stringify(Location));
  const [selectedCity, setSelectedCity] = useState<LocationType | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [addressForm] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const { user } = useAuth();
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

  const onFinish = async (values: any) => {
    const formattedAddress = {
      ...values,
      city_name: selectedCity?.name,
      district_name: selectedDistrict?.name,
      ward_name: selectedWard?.name,
    };
    console.table(formattedAddress);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/customers/${user?.customer_id}/addresses`,
        {
          customer_id: user?.customer_id,
          address: `${formattedAddress.street}, ${formattedAddress.ward_name}, ${formattedAddress.district_name}, ${formattedAddress.city_name}`,
          is_default: values.is_default || false,
        }
      );
      if (response.status === 201) {
        setIsModalVisible(false);
        addressForm.resetFields();
        notificationApi.success({
          message: "Thêm địa chỉ thành công",
        });
        onAddAddress();
      } else {
        notificationApi.error({
          message: "Thêm địa chỉ thất bại",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Thêm địa chỉ mới"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {notificationContextHolder}
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
              (option?.label ?? ("" as any))
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

        <Form.Item name="is_default" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              addressForm.setFieldsValue({
                is_default: e.target.checked,
              });
            }}
          >
            Đặt làm địa chỉ mặc định
          </Checkbox>
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
