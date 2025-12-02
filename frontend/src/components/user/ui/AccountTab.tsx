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
      <h2 className="mb-6 text-2xl font-bold">Tài khoản</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={user.firstName}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={user.lastName}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              defaultValue={user.phone}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-gradient-to-r from-yellow-500 to-purple-600 px-8 py-3 font-semibold text-white transition hover:shadow-lg"
        >
          LƯU
        </button>
      </div>
    </div>
  );
}
