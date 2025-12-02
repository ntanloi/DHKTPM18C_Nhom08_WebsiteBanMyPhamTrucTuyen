import { X } from 'lucide-react';

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
  if (!show) return null;

  const handleSave = () => {
    alert('Đã lưu địa chỉ!');
    onClose();
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
              defaultValue={address?.date}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên"
              defaultValue={address?.name.split(' ')[0]}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Họ"
              defaultValue={address?.name.split(' ').slice(1).join(' ')}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            defaultValue={address?.email}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="tel"
            placeholder="+ 84"
            defaultValue={address?.phone}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <select
            defaultValue={address?.city}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          >
            <option>Tỉnh/Thành phố</option>
            <option>Hồ Chí Minh</option>
            <option>Hà Nội</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select
              defaultValue={address?.district}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            >
              <option>Quận/huyện</option>
              <option>Quận Gò Vấp</option>
            </select>
            <select
              defaultValue={address?.ward}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
            >
              <option>Phường/xã</option>
              <option>Phường 5</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Tòa nhà, số nhà, tên đường"
            defaultValue={address?.street}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={address?.isDefault}
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
