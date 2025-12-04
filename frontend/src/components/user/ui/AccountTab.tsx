interface AccountTabProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function AccountTab({ user }: AccountTabProps) {
  const handleSave = () => {
    alert('Đã lưu thông tin tài khoản!');
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Tài khoản</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={user.firstName}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={user.lastName}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              defaultValue={user.phone}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-lg bg-[rgb(235,97,164)] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
