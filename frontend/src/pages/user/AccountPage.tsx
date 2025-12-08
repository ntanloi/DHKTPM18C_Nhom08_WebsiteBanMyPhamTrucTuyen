import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/user/ui/Sidebar';
import AccountTab from '../../components/user/ui/AccountTab';
import OrdersTab from '../../components/user/ui/OrdersTab';
import AddressesTab from '../../components/user/ui/AddressesTab';
import CouponsTab from '../../components/user/ui/CouponsTab';
import { getUserById } from '../../api/user';
import { getOrdersByUserId } from '../../api/order';
import { getAddressesByUserId } from '../../api/address';
import { getActiveCoupons } from '../../api/coupon';
import type { UserResponse } from '../../api/user';
import type { OrderResponse } from '../../api/order';
import type { AddressResponse } from '../../api/address';
import type { CouponResponse } from '../../api/coupon';

export default function AccountPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);

  // Data states
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Load user data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.userId) {
        console.log('⚠️ No user ID, skipping data load');
        return;
      }

      try {
        setLoading(true);
        console.log('📡 Loading account data for user:', user.userId);

        // Load user data first (required)
        console.log('1️⃣ Loading user data...');
        const userRes = await getUserById(user.userId);
        console.log('✅ User data loaded:', userRes);
        setUserData(userRes);

        // Load other data (optional - don't block if they fail)
        console.log('2️⃣ Loading orders...');
        const ordersRes = await getOrdersByUserId(user.userId).catch((err) => {
          console.warn('⚠️ Failed to load orders:', err);
          return [];
        });
        console.log('✅ Orders loaded:', ordersRes.length);
        setOrders(ordersRes);

        console.log('3️⃣ Loading addresses...');
        const addressesRes = await getAddressesByUserId(user.userId).catch(
          (err) => {
            console.warn('⚠️ Failed to load addresses:', err);
            return [];
          },
        );
        console.log('✅ Addresses loaded:', addressesRes.length);
        setAddresses(addressesRes);

        console.log('4️⃣ Loading coupons...');
        const couponsRes = await getActiveCoupons().catch((err) => {
          console.warn('⚠️ Failed to load coupons:', err);
          return [];
        });
        console.log('✅ Coupons loaded:', couponsRes.length);
        setCoupons(couponsRes);

        console.log('🎉 All data loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading account data:', error);
        // Still set loading to false even if user data fails
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.userId]);

  // Reload specific data
  const reloadOrders = async () => {
    if (!user?.userId) return;
    try {
      const ordersRes = await getOrdersByUserId(user.userId);
      setOrders(ordersRes);
    } catch (error) {
      console.error('Error reloading orders:', error);
    }
  };

  const reloadAddresses = async () => {
    if (!user?.userId) return;
    try {
      const addressesRes = await getAddressesByUserId(user.userId);
      setAddresses(addressesRes);
    } catch (error) {
      console.error('Error reloading addresses:', error);
    }
  };

  const reloadUserData = async () => {
    if (!user?.userId) return;
    try {
      const userRes = await getUserById(user.userId);
      setUserData(userRes);
    } catch (error) {
      console.error('Error reloading user data:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'account':
        return <AccountTab user={userData} onUpdate={reloadUserData} />;
      case 'orders':
        return <OrdersTab orders={orders} onUpdate={reloadOrders} />;
      case 'addresses':
        return (
          <AddressesTab
            addresses={addresses}
            onUpdate={reloadAddresses}
            userId={user?.userId}
          />
        );
      case 'coupons':
        return <CouponsTab coupons={coupons} />;
      default:
        return null;
    }
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Show loading state while fetching user data
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Đang tải thông tin tài khoản...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={userData}
          />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
