import { useState } from 'react';
import { updateUser } from '../../../api/user';
import type { UserResponse } from '../../../api/user';

interface AccountTabProps {
  user: UserResponse | null;
  onUpdate?: () => void;
}

export default function AccountTab({ user, onUpdate }: AccountTabProps) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    birthDay: user?.birthDay || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setMessage(null);

      await updateUser(user.id, formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Tài khoản</h2>

      {message && (
        <div
          className={`mb-4 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <input
            type="date"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-[rgb(235,97,164)] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
