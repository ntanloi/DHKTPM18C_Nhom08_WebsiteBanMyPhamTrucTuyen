import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAddress } from '../../../hooks/useAddress';

interface Address {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

interface AddressModalProps {
  show: boolean;
  onClose: () => void;
  type: 'add' | 'edit';
  address: Address | null;
}

export default function AddressModal({
  show,
  onClose,
  type,
  address,
}: AddressModalProps) {
  const { provinces, districts, wards, fetchDistricts, fetchWards } = useAddress();
  
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    street: '',
    isDefault: false,
  });

  useEffect(() => {
    if (address && show) {
      setFormData({
        label: address.date || '',
        name: address.name || '',
        email: address.email || '',
        phone: address.phone || '',
        city: address.city || '',
        district: address.district || '',
        ward: address.ward || '',
        street: address.street || '',
        isDefault: address.isDefault || false,
      });
    } else if (!show) {
      // Reset form when modal closes
      setFormData({
        label: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        street: '',
        isDefault: false,
      });
    }
  }, [address, show]);

  if (!show) return null;

  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.city || !formData.district || !formData.ward || !formData.street) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    alert('Đã lưu địa chỉ!');
    onClose();
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = provinces.find(p => p.name === e.target.value);
    if (selectedProvince) {
      setFormData(prev => ({
        ...prev,
        city: selectedProvince.name,
        district: '',
        ward: '',
      }));
      fetchDistricts(selectedProvince.code);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = districts.find(d => d.name === e.target.value);
    if (selectedDistrict) {
      setFormData(prev => ({
        ...prev,
        district: selectedDistrict.name,
        ward: '',
      }));
      fetchWards(selectedDistrict.code);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      ward: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
      {' '}
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
          <div>
            <input
              type="text"
              placeholder="Tên địa chỉ (vd: Văn phòng, Nhà, ...)"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="col-span-2 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="tel"
            placeholder="Số điện thoại (vd: 0867418359)"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-5 w-5"
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>

          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-purple-600 py-3 font-semibold text-white transition hover:shadow-lg"
          >
            LƯU
          </button>
        </div>
      </div>
    </div>
  );
}
