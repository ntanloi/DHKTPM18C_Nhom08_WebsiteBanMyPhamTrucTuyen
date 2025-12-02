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
      alert('Đã xóa địa chỉ!');
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Địa chỉ giao nhận</h2>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800"
          >
            + Thêm địa chỉ
          </button>
        </div>

        {addresses.map((address) => (
          <div key={address.id} className="mb-4 rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-semibold">{address.date}</span>
                  {address.isDefault && (
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-gray-700">
                  <div className="font-semibold">{address.name}</div>
                  <div>{address.phone}</div>
                  <div>{address.email}</div>
                  <div>
                    {address.street}, {address.ward}, {address.district},{' '}
                    {address.city}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 text-gray-600 hover:text-purple-600"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
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
