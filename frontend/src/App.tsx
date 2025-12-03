import './App.css';
import Footer from './components/user/layout/Footer';
import HomePage from './pages/user/HomePage';
import Header from './components/user/layout/Header';
import StoreLocatorPage from './pages/user/StoreLocatorPage';
import { useEffect, useState } from 'react';
import AuthModal from './components/user/ui/AuthModal';
import ProductListPage from './pages/user/ProductListPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CheckoutPage from './pages/user/CheckoutPage';
import { NavigationProvider } from './context/NavigationContext';
import { AuthProvider } from './context/AuthContext';

import UserListPage from './pages/admin/user/UserListPage';
import UserCreatePage from './pages/admin/user/UserCreatePage';
import UserEditPage from './pages/admin/user/UserEditPage';
import UserDetailPage from './pages/admin/user/UserDetailPage';

import CategoryListPage from './pages/admin/category/CategoryListPage';
import CategoryFormPage from './pages/admin/category/CategoryFormPage';

import BrandListPage from './pages/admin/brand/BrandListPage';
import BrandFormPage from './pages/admin/brand/BrandFormPage';

import AdminProductListPage from './pages/admin/product/ProductListPage';
import ProductCreatePage from './pages/admin/product/ProductCreatePage';
import ProductEditPage from './pages/admin/product/ProductEditPage';
import AdminProductDetailPage from './pages/admin/product/ProductDetailPage';

import ProductImageManagePage from './pages/admin/product/ProductImageManagePage';

import OrderListPage from './pages/admin/order/OrderListPage';
import OrderDetailPage from './pages/admin/order/OrderDetailPage';
import OrderStatusUpdatePage from './pages/admin/order/OrderStatusUpdatePage';
import OrderShipmentManagePage from './pages/admin/order/OrderShipmentManagePage';
import PaymentMethodListPage from './pages/admin/payment/PaymentMethodListPage';
import OrderReturnManagePage from './pages/admin/order/OrderReturnManagePage';
import ReturnListPage from './pages/admin/return/ReturnListPage';

import CouponListPage from './pages/admin/coupon/CouponListPage';
import CouponCreatePage from './pages/admin/coupon/CouponCreatePage';
import CouponEditPage from './pages/admin/coupon/CouponEditPage';
import CouponDetailPage from './pages/admin/coupon/CouponDetailPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/analytic/AdminAnalytics';

import CheckoutInfoPage from './pages/user/CheckoutInfoPage';

import OrderSuccessPage from './pages/user/OrderSuccessPage';
import OTPModal from './components/user/ui/OTPModal';
import BrandPage from './pages/user/BrandPage';
import AccountPage from './pages/user/AccountPage';

type Page =
  | 'home'
  | 'stores'
  | 'brands'
  | 'products'
  | 'product-detail'
  | 'checkout'
  | 'checkout-info'
  | 'order-success'
  | 'account'
  | 'admin-dashboard'
  | 'admin-analytics'
  | 'admin-users'
  | 'admin-user-create'
  | 'admin-user-edit'
  | 'admin-user-detail'
  | 'admin-categories'
  | 'admin-category-create'
  | 'admin-category-edit'
  | 'admin-brands'
  | 'admin-brand-create'
  | 'admin-brand-edit'
  | 'admin-products'
  | 'admin-product-create'
  | 'admin-product-edit'
  | 'admin-product-detail'
  | 'admin-product-images'
  | 'admin-orders'
  | 'admin-order-detail'
  | 'admin-order-status-update'
  | 'admin-order-shipment'
  | 'admin-payment-methods'
  | 'admin-order-return'
  | 'admin-returns'
  | 'admin-coupons'
  | 'admin-coupon-create'
  | 'admin-coupon-edit'
  | 'admin-coupon-detail';

function App() {
  const pathToPage = (path: string): Page => {
    if (path === '/account') return 'account';
    if (path === '/admin' || path === '/admin/') return 'admin-dashboard';
    if (path === '/admin/analytics') return 'admin-analytics';

    if (path.match(/^\/admin\/products\/\d+\/images$/)) {
      return 'admin-product-images';
    }

    if (path === '/stores') return 'stores';
    if (path === '/brands') return 'brands';
    if (path === '/checkout') return 'checkout';
    if (path === '/checkout-info') return 'checkout-info';
    if (path.startsWith('/order-success/')) return 'order-success';

    if (path.startsWith('/products') || path === '/products') return 'products';
    if (path.startsWith('/product/')) return 'product-detail';

    if (path === '/admin/users') return 'admin-users';
    if (path === '/admin/users/create') return 'admin-user-create';
    if (path.startsWith('/admin/users/') && path.endsWith('/edit'))
      return 'admin-user-edit';
    if (
      path.startsWith('/admin/users/') &&
      !path.endsWith('/edit') &&
      path !== '/admin/users/create'
    )
      return 'admin-user-detail';

    if (path === '/admin/categories') return 'admin-categories';
    if (path === '/admin/categories/create') return 'admin-category-create';
    if (path.startsWith('/admin/categories/') && path.endsWith('/edit'))
      return 'admin-category-edit';

    if (path === '/admin/brands') return 'admin-brands';
    if (path === '/admin/brands/create') return 'admin-brand-create';
    if (path.startsWith('/admin/brands/') && path.endsWith('/edit'))
      return 'admin-brand-edit';

    if (path === '/admin/products') return 'admin-products';
    if (path === '/admin/products/create') return 'admin-product-create';
    if (path.startsWith('/admin/products/') && path.endsWith('/edit'))
      return 'admin-product-edit';

    if (
      path.startsWith('/admin/products/') &&
      !path.endsWith('/edit') &&
      !path.includes('/images') &&
      path !== '/admin/products/create'
    )
      return 'admin-product-detail';

    if (path === '/admin/orders') return 'admin-orders';
    if (path === '/admin/payment-methods') return 'admin-payment-methods';
    if (path === '/admin/returns') return 'admin-returns';

    if (path.startsWith('/admin/orders/') && path.endsWith('/return'))
      return 'admin-order-return';

    if (path.startsWith('/admin/orders/') && path.endsWith('/status'))
      return 'admin-order-status-update';

    if (path.startsWith('/admin/orders/') && path.endsWith('/shipment'))
      return 'admin-order-shipment';

    if (
      path.startsWith('/admin/orders/') &&
      !path.endsWith('/status') &&
      path !== '/admin/orders'
    )
      return 'admin-order-detail';

    if (path === '/admin/coupons') return 'admin-coupons';
    if (path === '/admin/coupons/create') return 'admin-coupon-create';

    if (path.startsWith('/admin/coupons/') && path.endsWith('/edit'))
      return 'admin-coupon-edit';

    if (
      path.startsWith('/admin/coupons/') &&
      !path.endsWith('/edit') &&
      path !== '/admin/coupons/create'
    )
      return 'admin-coupon-detail';

    return 'home';
  };

  const [page, setPage] = useState<Page>(pathToPage(window.location.pathname));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOTP, setShowOTP] = useState(false);

  const [_productId, setProductId] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [productSlug, setProductSlug] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [brandId, setBrandId] = useState<string>('');
  const [adminProductId, setAdminProductId] = useState<string>('');
  const [imageProductId, setImageProductId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [couponId, setCouponId] = useState<string>(''); // THÊM
  const [orderSuccessCode, setOrderSuccessCode] = useState<string>('');

  // Extract initial categorySlug from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      setCategorySlug(slug);
    }

    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      setProductSlug(slug);
    }
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);

    const pathname = to.split('?')[0];
    setPage(pathToPage(pathname));

    // Extract category slug from URL /products/sua-rua-mat
    if (pathname.startsWith('/products/')) {
      const slug = pathname.replace('/products/', '');
      setCategorySlug(slug);
    } else if (pathname === '/products') {
      setCategorySlug('');
    }

    if (pathname.startsWith('/product/')) {
      const slug = pathname.replace('/product/', '');
      setProductSlug(slug);
    } else if (pathname === '/product') {
      setProductSlug('');
    }

    // Extract product ID from URL
    if (pathname.startsWith('/product/')) {
      const id = pathname.replace('/product/', '');
      setProductId(id);
    }

    if (to.startsWith('/admin/users/')) {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create') {
        setUserId(parts[3]);
      }
    }

    if (to.startsWith('/admin/categories/')) {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create') {
        setCategoryId(parts[3]);
      }
    }

    if (to.startsWith('/admin/brands/')) {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create') {
        setBrandId(parts[3]);
      }
    }

    if (to.match(/^\/admin\/products\/\d+\/images$/)) {
      const match = to.match(/\/admin\/products\/(\d+)\/images/);
      if (match) {
        setImageProductId(match[1]);
        console.log('✅ Image Product ID:', match[1]);
      }
    } else if (to.startsWith('/admin/products/')) {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create' && !to.includes('/images')) {
        setAdminProductId(parts[3]);
        console.log('✅ Admin Product ID:', parts[3]);
      }
    }

    if (to.startsWith('/admin/orders/') && to !== '/admin/orders') {
      const parts = to.split('/');
      if (parts[3]) {
        const id = parts[3].replace(/\/(status|shipment|return)$/, '');
        setOrderId(id);
        console.log('✅ Order ID:', id);
      }
    }

    if (to.startsWith('/admin/coupons/') && to !== '/admin/coupons') {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create') {
        const id = parts[3].replace('/edit', '');
        setCouponId(id);
        console.log('✅ Coupon ID:', id);
      }
    }

    if (to.startsWith('/order-success/')) {
      const code = to.replace('/order-success/', '');
      setOrderSuccessCode(code);
      console.log('✅ Order Success Code:', code);
    }
  };

  {
    console.log(productSlug);
  }

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      setPage(pathToPage(path));

      // Update categorySlug when back/forward
      if (path.startsWith('/products/')) {
        const slug = path.replace('/products/', '');
        setCategorySlug(slug);
      } else if (path === '/products') {
        setCategorySlug('');
      }

      if (path.startsWith('/order-success/')) {
        const code = path.replace('/order-success/', '');
        setOrderSuccessCode(code);
      }

      // Update productId based on path
      if (path.startsWith('/product/')) {
        const id = path.replace('/product/', '');
        setProductId(id);
      } else if (path.startsWith('/admin/users/')) {
        const parts = path.split('/');
        if (parts[3] && parts[3] !== 'create') {
          setUserId(parts[3]);
        }
      } else if (path.startsWith('/admin/categories/')) {
        const parts = path.split('/');
        if (parts[3] && parts[3] !== 'create') {
          setCategoryId(parts[3]);
        }
      } else if (path.startsWith('/admin/brands/')) {
        const parts = path.split('/');
        if (parts[3] && parts[3] !== 'create') {
          setBrandId(parts[3]);
        }
      } else if (path.match(/^\/admin\/products\/\d+\/images$/)) {
        const match = path.match(/\/admin\/products\/(\d+)\/images/);
        if (match) {
          setImageProductId(match[1]);
        }
      } else if (path.startsWith('/admin/products/')) {
        const parts = path.split('/');
        if (parts[3] && parts[3] !== 'create' && !path.includes('/images')) {
          setAdminProductId(parts[3]);
        }
      }

      if (path.startsWith('/admin/orders/') && path !== '/admin/orders') {
        const parts = path.split('/');
        if (parts[3]) {
          const id = parts[3].replace(/\/(status|shipment|return)$/, '');
          setOrderId(id);
        }
      }

      if (path.startsWith('/admin/coupons/') && path !== '/admin/coupons') {
        const parts = path.split('/');
        if (parts[3] && parts[3] !== 'create') {
          const id = parts[3].replace('/edit', '');
          setCouponId(id);
        }
      }
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const isAdminPage = page.startsWith('admin-');

  return (
    <AuthProvider>
      <NavigationProvider navigate={navigate}>
        <div>
        {!isAdminPage && (
          <Header
            onOpenStores={() => navigate('/stores')}
            onOpenLogin={() => setAuthOpen(true)}
            onNavigate={navigate}
          />
        )}
        {page === 'home' && <HomePage />}
        {page === 'stores' && <StoreLocatorPage />}{' '}
        {page === 'account' && <AccountPage />}
        {page === 'brands' && <BrandPage />}
        {page === 'products' && <ProductListPage categorySlug={categorySlug} />}
        {page === 'checkout' && <CheckoutPage onNavigate={navigate} />}
        {page === 'checkout-info' && (
          <>
            <CheckoutInfoPage
              isLoggedIn={false}
              onPlaceOrder={() => setShowOTP(true)}
            />
            <OTPModal
              isOpen={showOTP}
              onClose={() => setShowOTP(false)}
              onVerify={() => {
                setShowOTP(false);
                navigate('/order-success/BW9HID6C');
              }}
            />
          </>
        )}
        {/* ← THÊM PHẦN NÀY */}
        {page === 'order-success' && (
          <OrderSuccessPage
            orderCode={orderSuccessCode}
            onBack={() => navigate('/')}
          />
        )}
        {page === 'product-detail' && (
          <ProductDetailPage productSlug={productSlug} />
        )}
        {page === 'admin-dashboard' && <AdminDashboard onNavigate={navigate} />}
        {page === 'admin-users' && <UserListPage onNavigate={navigate} />}
        {page === 'admin-user-create' && (
          <UserCreatePage onNavigate={navigate} />
        )}
        {page === 'admin-user-edit' && (
          <UserEditPage userId={userId} onNavigate={navigate} />
        )}
        {page === 'admin-user-detail' && (
          <UserDetailPage userId={userId} onNavigate={navigate} />
        )}
        {page === 'admin-categories' && (
          <CategoryListPage onNavigate={navigate} />
        )}
        {page === 'admin-category-create' && (
          <CategoryFormPage onNavigate={navigate} mode="create" />
        )}
        {page === 'admin-category-edit' && (
          <CategoryFormPage
            categoryId={categoryId}
            onNavigate={navigate}
            mode="edit"
          />
        )}
        {page === 'admin-brands' && <BrandListPage onNavigate={navigate} />}
        {page === 'admin-brand-create' && (
          <BrandFormPage onNavigate={navigate} mode="create" />
        )}
        {page === 'admin-brand-edit' && (
          <BrandFormPage brandId={brandId} onNavigate={navigate} mode="edit" />
        )}
        {page === 'admin-products' && (
          <AdminProductListPage onNavigate={navigate} />
        )}
        {page === 'admin-product-create' && (
          <ProductCreatePage onNavigate={navigate} />
        )}
        {page === 'admin-product-edit' && (
          <ProductEditPage productId={adminProductId} onNavigate={navigate} />
        )}
        {page === 'admin-product-detail' && (
          <AdminProductDetailPage
            productId={adminProductId}
            onNavigate={navigate}
          />
        )}
        {page === 'admin-product-images' && (
          <ProductImageManagePage
            productId={imageProductId}
            onNavigate={navigate}
          />
        )}
        {page === 'admin-orders' && <OrderListPage onNavigate={navigate} />}
        {page === 'admin-order-detail' && (
          <OrderDetailPage orderId={orderId} onNavigate={navigate} />
        )}
        {page === 'admin-order-status-update' && (
          <OrderStatusUpdatePage orderId={orderId} onNavigate={navigate} />
        )}
        {page === 'admin-order-shipment' && (
          <OrderShipmentManagePage orderId={orderId} onNavigate={navigate} />
        )}
        {page === 'admin-payment-methods' && (
          <PaymentMethodListPage onNavigate={navigate} />
        )}
        {page === 'admin-order-return' && (
          <OrderReturnManagePage orderId={orderId} onNavigate={navigate} />
        )}
        {page === 'admin-returns' && <ReturnListPage onNavigate={navigate} />}
        {page === 'admin-coupons' && <CouponListPage onNavigate={navigate} />}
        {page === 'admin-coupon-create' && (
          <CouponCreatePage onNavigate={navigate} />
        )}
        {page === 'admin-coupon-edit' && (
          <CouponEditPage couponId={parseInt(couponId)} onNavigate={navigate} />
        )}
        {page === 'admin-coupon-detail' && (
          <CouponDetailPage
            couponId={parseInt(couponId)}
            onNavigate={navigate}
          />
        )}
        {page === 'admin-analytics' && <AdminAnalytics onNavigate={navigate} />}
        {!isAdminPage && <Footer />}
        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      </div>
    </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
