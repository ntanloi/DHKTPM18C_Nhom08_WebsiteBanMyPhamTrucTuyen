import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import AddressModal from './AddressModal';
import { deleteAddress } from '../../../api/address';
import type { AddressResponse } from '../../../api/address';
import { Toast } from './Toast';
import { useToast } from '../../../hooks/useToast';

interface AddressesTabProps {
  addresses: AddressResponse[];
  onUpdate?: () => void;
  userId?: number;
}

export default function AddressesTab({
  addresses,
  onUpdate,
  userId,
}: AddressesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const handleEdit = (address: AddressResponse) => {
    setSelectedAddress(address);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      setDeletingId(id);
      await deleteAddress(id);
      showToast('Đã xóa địa chỉ thành công!', 'success');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Có lỗi xảy ra khi xóa địa chỉ', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (onUpdate) onUpdate();
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
                      {address.recipientName}
                    </span>
                    {address.isDefault && (
                      <span className="rounded-full bg-[rgb(235,97,164)]/10 px-3 py-1 text-xs font-medium text-[rgb(235,97,164)]">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-4">
                      <div>{address.recipientPhone}</div>
                    </div>
                    <div className="text-gray-600">
                      {address.streetAddress}, {address.ward},{' '}
                      {address.district}, {address.city}
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
                    disabled={deletingId === address.id}
                    className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
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
        onClose={handleModalClose}
        type={modalType}
        address={selectedAddress}
        userId={userId}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}
