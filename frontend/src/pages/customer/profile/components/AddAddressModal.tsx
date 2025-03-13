import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface AddAddressModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  addressForm: any;
  handleAddAddress: (values: any) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  addressForm,
  handleAddAddress,
}) => {
  return (
    <Modal
      title="Thêm địa chỉ mới"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form form={addressForm} layout="vertical" onFinish={handleAddAddress}>
        <Form.Item
          name="receiver_name"
          label="Tên người nhận"
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="city"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="ward"
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="street"
          label="Địa chỉ cụ thể"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input />
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
