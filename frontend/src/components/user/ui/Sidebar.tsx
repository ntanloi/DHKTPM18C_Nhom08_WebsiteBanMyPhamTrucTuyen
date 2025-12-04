interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    firstName: string;
    lastName: string;
    points: number;
    pointsToNextLevel: number;
  };
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
}: SidebarProps) {
  const menuItems = [
    { id: 'account', label: 'Tài khoản', icon: '' },
    { id: 'orders', label: 'Đơn hàng', icon: '' },
    { id: 'addresses', label: 'Địa chỉ giao nhận', icon: '' },
    { id: 'coupons', label: 'Ưu đãi của tôi', icon: '' },
  ];

  return (
    <div className="w-80 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl">
          👤
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {user.firstName} {user.lastName}
        </h3>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-[rgb(235,97,164)]/10 font-semibold text-[rgb(235,97,164)]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
