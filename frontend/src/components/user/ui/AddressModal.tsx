import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAddress } from '../../../hooks/useAddress';
import { createAddress, updateAddress } from '../../../api/address';
import type { AddressResponse } from '../../../api/address';
import { Toast } from './Toast';
import { useToast } from '../../../hooks/useToast';

interface AddressModalProps {
  show: boolean;
  onClose: () => void;
  type: 'add' | 'edit';
  address: AddressResponse | null;
  userId?: number;
}

export default function AddressModal({
  show,
  onClose,
  type,
  address,
  userId,
}: AddressModalProps) {
  const { provinces, districts, wards, fetchDistricts, fetchWards } =
    useAddress();
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    city: '',
    district: '',
    ward: '',
    streetAddress: '',
    isDefault: false,
  });

  useEffect(() => {
    if (address && show) {
      setFormData({
        recipientName: address.recipientName || '',
        recipientPhone: address.recipientPhone || '',
        city: address.city || '',
        district: address.district || '',
        ward: address.ward || '',
        streetAddress: address.streetAddress || '',
        isDefault: address.isDefault || false,
      });
    } else if (!show) {
      setFormData({
        recipientName: '',
        recipientPhone: '',
        city: '',
        district: '',
        ward: '',
        streetAddress: '',
        isDefault: false,
      });
    }
  }, [address, show]);

  if (!show) return null;

  const handleSave = async () => {
    if (
      !formData.recipientName ||
      !formData.recipientPhone ||
      !formData.city ||
      !formData.district ||
      !formData.ward ||
      !formData.streetAddress
    ) {
      showToast('Vui lòng điền đầy đủ thông tin!', 'warning');
      return;
    }

    if (!userId) {
      showToast('Không tìm thấy thông tin người dùng!', 'error');
      return;
    }

    try {
      setLoading(true);

      if (type === 'add') {
        await createAddress(userId, formData);
        showToast('Đã thêm địa chỉ thành công!', 'success');
      } else if (address) {
        await updateAddress(address.id, formData);
        showToast('Đã cập nhật địa chỉ thành công!', 'success');
      }

      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Có lỗi xảy ra khi lưu địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = provinces.find((p) => p.name === e.target.value);
    if (selectedProvince) {
      setFormData((prev) => ({
        ...prev,
        city: selectedProvince.name,
        district: '',
        ward: '',
      }));
      fetchDistricts(selectedProvince.code);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = districts.find((d) => d.name === e.target.value);
    if (selectedDistrict) {
      setFormData((prev) => ({
        ...prev,
        district: selectedDistrict.name,
        ward: '',
      }));
      fetchWards(selectedDistrict.code);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      ward: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between bg-white px-6 py-4">
          <h3 className="text-xl font-bold">
            {type === 'add' ? 'Thêm địa chỉ' : 'Chỉnh sửa địa chỉ'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <input
            type="text"
            placeholder="Họ và tên người nhận"
            value={formData.recipientName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recipientName: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="tel"
            placeholder="Số điện thoại (vd: 0867418359)"
            value={formData.recipientPhone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recipientPhone: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={formData.city}
            onChange={handleProvinceChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.district}
              onChange={handleDistrictChange}
              disabled={!formData.city}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            <select
              value={formData.ward}
              onChange={handleWardChange}
              disabled={!formData.district}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Tòa nhà, số nhà, tên đường"
            value={formData.streetAddress}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                streetAddress: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-purple-600 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'ĐANG LƯU...' : 'LƯU'}
          </button>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
