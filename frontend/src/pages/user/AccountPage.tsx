import { useState } from 'react';
import Header from '../../components/user/layout/Header';
import Footer from '../../components/user/layout/Footer';
import Sidebar from '../../components/user/ui/Sidebar';
import AccountTab from '../../components/user/ui/AccountTab';
import OrdersTab from '../../components/user/ui/OrdersTab';
import AddressesTab from '../../components/user/ui/AddressesTab';
import CouponsTab from '../../components/user/ui/CouponsTab';

// Mock Data
const mockUser = {
  firstName: 'Nguyen Tan',
  lastName: 'Loi',
  email: 'nguyenloldt.052017@gmail.com',
  phone: '+84867418359',
  points: 0,
  pointsToNextLevel: 100,
};

const mockOrders = [
  {
    id: '#BW9HID6C',
    date: '12/01/2025',
    status: 'Đã hủy',
    items: 2,
    total: 286000,
    address: '206/16, đường số 20, Phường 5, Quận Gò Vấp, Hồ Chí Minh',
  },
];

const mockAddresses = [
  {
    id: 1,
    date: '206/16',
    name: 'Nguyen Tan Loi',
    phone: '84867418359',
    email: 'nguyenloldt.052017@gmail.com',
    city: 'Hồ Chí Minh',
    district: 'Quận Gò Vấp',
    ward: 'Phường 5',
    street: 'đường số 20',
    isDefault: true,
  },
];

const mockCoupons = [
  {
    id: 1,
    code: 'WELCOME50',
    description: 'Giảm 50.000đ cho đơn hàng đầu tiên',
    isActive: true,
    discountType: 'fixed' as const,
    discountValue: 50000,
    minOrderValue: 200000,
    maxUsageValue: 50000,
    validFrom: '2025-01-01',
    validTo: '2025-03-31',
  },
  {
    id: 2,
    code: 'MAKEUP20',
    description: 'Giảm 20% cho sản phẩm trang điểm',
    isActive: true,
    discountType: 'percentage' as const,
    discountValue: 20,
    minOrderValue: 300000,
    maxUsageValue: 100000,
    validFrom: '2025-01-15',
    validTo: '2025-02-28',
  },
  {
    id: 3,
    code: 'SKINCARE15',
    description: 'Giảm 15% cho sản phẩm dưỡng da',
    isActive: true,
    discountType: 'percentage' as const,
    discountValue: 15,
    minOrderValue: 250000,
    maxUsageValue: 75000,
    validFrom: '2025-01-10',
    validTo: '2025-04-30',
  },
  {
    id: 4,
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn từ 199k',
    isActive: true,
    discountType: 'shipping' as const,
    discountValue: 0,
    minOrderValue: 199000,
    maxUsageValue: 30000,
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab user={mockUser} />;
      case 'orders':
        return <OrdersTab orders={mockOrders} />;
      case 'addresses':
        return <AddressesTab addresses={mockAddresses} />;
      case 'coupons':
        return <CouponsTab coupons={mockCoupons} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={mockUser}
          />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
