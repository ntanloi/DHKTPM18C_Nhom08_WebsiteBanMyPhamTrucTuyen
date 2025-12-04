import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import AddressModal from './AddressModal';

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

interface AddressesTabProps {
  addresses: Address[];
}

export default function AddressesTab({ addresses }: AddressesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      alert(`Đã xóa địa chỉ với ID: ${id}!`);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Địa chỉ giao nhận
          </h2>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-[rgb(235,97,164)] px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90"
          >
            + Thêm địa chỉ
          </button>
        </div>

        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="mb-4 rounded-lg border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {address.date}
                    </span>
                    {address.isDefault && (
                      <span className="rounded-full bg-[rgb(235,97,164)]/10 px-3 py-1 text-xs font-medium text-[rgb(235,97,164)]">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="font-medium text-gray-900">
                      {address.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <div>{address.phone}</div>
                      <div className="text-gray-400">•</div>
                      <div>{address.email}</div>
                    </div>
                    <div className="text-gray-600">
                      {address.street}, {address.ward}, {address.district},{' '}
                      {address.city}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-[rgb(235,97,164)]"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-red-600"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📍</div>
            <h3 className="mb-2 text-xl font-medium text-gray-700">
              Chưa có địa chỉ
            </h3>
            <p className="mb-6 text-gray-500">
              Thêm địa chỉ để nhận hàng thuận tiện hơn
            </p>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-[rgb(235,97,164)] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90"
            >
              + Thêm địa chỉ mới
            </button>
          </div>
        )}
      </div>

      <AddressModal
        show={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        address={selectedAddress}
      />
    </>
  );
}
