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
import { CartProvider } from './context/CartContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

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
import ProtectedRoute from './components/ProtectedRoute';

import ChatManagementPage from './pages/admin/chat/ChatManagementPage';

import CheckoutInfoPage from './pages/user/CheckoutInfoPage';
import PaymentCallbackPage from './pages/user/PaymentCallbackPage';

import OrderSuccessPage from './pages/user/OrderSuccessPage';
import GuestOrderTrackingPage from './pages/user/GuestOrderTrackingPage';
import BrandPage from './pages/user/BrandPage';
import ChatWidget from './components/user/ui/ChatWidget';
import AccountPage from './pages/user/AccountPage';

type Page =
  | 'home'
  | 'stores'
  | 'brands'
  | 'products'
  | 'search' // NEW: Search page
  | 'product-detail'
  | 'checkout'
  | 'checkout-info'
  | 'order-success'
  | 'track-order' // NEW: Guest order tracking
  | 'account'
  | 'support-chat'
  | 'admin-dashboard'
  | 'admin-analytics'
  | 'admin-chat'
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
  | 'admin-coupon-detail'
  | 'payment-callback';

function App() {
  const pathToPage = (path: string): Page => {
    if (path === '/account') return 'account';
    if (path === '/support/chat') return 'support-chat';
    if (path === '/admin' || path === '/admin/') return 'admin-dashboard';
    if (path === '/admin/analytics') return 'admin-analytics';
    if (path === '/admin/chat') return 'admin-chat';

    if (path.match(/^\/admin\/products\/\d+\/images$/)) {
      return 'admin-product-images';
    }

    if (path === '/stores') return 'stores';
    if (path === '/brands') return 'brands';
    if (path === '/search') return 'search'; // NEW: Search route
    if (path === '/checkout') return 'checkout';
    if (path === '/checkout-info') return 'checkout-info';
    if (path.startsWith('/order-success/')) return 'order-success';
    if (path === '/track-order') return 'track-order'; // NEW: Guest order tracking
    if (path === '/payment/callback' || path.startsWith('/payment/callback?'))
      return 'payment-callback';

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

  // Helper function to extract search query from URL
  const getSearchQueryFromURL = (url: string): string => {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.searchParams.get('q') || '';
    } catch {
      return '';
    }
  };

  const [page, setPage] = useState<Page>(pathToPage(window.location.pathname));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [_productId, setProductId] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [productSlug, setProductSlug] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // NEW: Search keyword state
  const [userId, setUserId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [brandId, setBrandId] = useState<string>('');
  const [adminProductId, setAdminProductId] = useState<string>('');
  const [imageProductId, setImageProductId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [couponId, setCouponId] = useState<string>('');
  const [orderSuccessCode, setOrderSuccessCode] = useState<string>('');

  // Extract initial values from URL
  useEffect(() => {
    const path = window.location.pathname;
    const fullURL = window.location.href;

    // Handle search query
    if (path === '/search') {
      const query = getSearchQueryFromURL(fullURL);
      setSearchKeyword(query);
    }

    // Handle category slug
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      setCategorySlug(slug);
    }

    // Handle product slug
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      setProductSlug(slug);
    }

    // Handle order success page
    if (path.startsWith('/order-success/')) {
      const code = path.replace('/order-success/', '');
      setOrderSuccessCode(code);
    }
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);

    const pathname = to.split('?')[0];
    setPage(pathToPage(pathname));

    // Handle search navigation
    if (pathname === '/search') {
      const query = getSearchQueryFromURL(to);
      setSearchKeyword(query);
      setCategorySlug(''); // Clear category when searching
    }
    // Extract category slug from URL /products/sua-rua-mat
    else if (pathname.startsWith('/products/')) {
      const slug = pathname.replace('/products/', '');
      setCategorySlug(slug);
      setSearchKeyword(''); // Clear search when viewing category
    } else if (pathname === '/products') {
      setCategorySlug('');
      setSearchKeyword('');
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
      }
    } else if (to.startsWith('/admin/products/')) {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create' && !to.includes('/images')) {
        setAdminProductId(parts[3]);
      }
    }

    if (to.startsWith('/admin/orders/') && to !== '/admin/orders') {
      const parts = to.split('/');
      if (parts[3]) {
        const id = parts[3].replace(/\/(status|shipment|return)$/, '');
        setOrderId(id);
      }
    }

    if (to.startsWith('/admin/coupons/') && to !== '/admin/coupons') {
      const parts = to.split('/');
      if (parts[3] && parts[3] !== 'create') {
        const id = parts[3].replace('/edit', '');
        setCouponId(id);
      }
    }

    if (to.startsWith('/order-success/')) {
      const code = to.replace('/order-success/', '');
      setOrderSuccessCode(code);
    }
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      const fullURL = window.location.href;
      setPage(pathToPage(path));

      // Handle search query on back/forward
      if (path === '/search') {
        const query = getSearchQueryFromURL(fullURL);
        setSearchKeyword(query);
        setCategorySlug('');
      }
      // Update categorySlug when back/forward
      else if (path.startsWith('/products/')) {
        const slug = path.replace('/products/', '');
        setCategorySlug(slug);
        setSearchKeyword('');
      } else if (path === '/products') {
        setCategorySlug('');
        setSearchKeyword('');
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

  const isAdminPage = page.startsWith('admin-') || page === 'support-chat';

  // Admin access check component
  const AdminRoute = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredRole="ADMIN">{children}</ProtectedRoute>
  );

  return (
    <AuthProvider>
      <NotificationProvider>
        <FavoriteProvider>
          <CartProvider>
            <NavigationProvider navigate={navigate}>
              <div>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#fff',
                      color: '#363636',
                      padding: '16px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                {!isAdminPage && (
                  <Header
                    onOpenStores={() => navigate('/stores')}
                    onOpenLogin={() => setAuthOpen(true)}
                    onNavigate={navigate}
                  />
                )}
                {page === 'home' && <HomePage />}
                {page === 'stores' && <StoreLocatorPage />}
                {page === 'account' && <AccountPage />}
                {page === 'brands' && <BrandPage />}

                {/* Products page with category */}
                {page === 'products' && (
                  <ProductListPage categorySlug={categorySlug} />
                )}

                {/* NEW: Search page - reuses ProductListPage with searchKeyword */}
                {page === 'search' && (
                  <ProductListPage searchKeyword={searchKeyword} />
                )}

                {page === 'checkout' && <CheckoutPage onNavigate={navigate} />}
                {page === 'checkout-info' && (
                  <CheckoutInfoPage onNavigate={navigate} />
                )}
                {page === 'order-success' && (
                  <OrderSuccessPage
                    orderCode={orderSuccessCode}
                    onBack={() => navigate('/')}
                  />
                )}
                {page === 'track-order' && (
                  <GuestOrderTrackingPage onNavigate={navigate} />
                )}
                {page === 'product-detail' && (
                  <ProductDetailPage productSlug={productSlug} />
                )}

                {/* Admin Routes - Protected */}
                {page === 'admin-dashboard' && (
                  <AdminRoute>
                    <AdminDashboard onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-users' && (
                  <AdminRoute>
                    <UserListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-user-create' && (
                  <AdminRoute>
                    <UserCreatePage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-user-edit' && (
                  <AdminRoute>
                    <UserEditPage userId={userId} onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-user-detail' && (
                  <AdminRoute>
                    <UserDetailPage userId={userId} onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-categories' && (
                  <AdminRoute>
                    <CategoryListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-category-create' && (
                  <AdminRoute>
                    <CategoryFormPage onNavigate={navigate} mode="create" />
                  </AdminRoute>
                )}
                {page === 'admin-category-edit' && (
                  <AdminRoute>
                    <CategoryFormPage
                      categoryId={categoryId}
                      onNavigate={navigate}
                      mode="edit"
                    />
                  </AdminRoute>
                )}
                {page === 'admin-brands' && (
                  <AdminRoute>
                    <BrandListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-brand-create' && (
                  <AdminRoute>
                    <BrandFormPage onNavigate={navigate} mode="create" />
                  </AdminRoute>
                )}
                {page === 'admin-brand-edit' && (
                  <AdminRoute>
                    <BrandFormPage
                      brandId={brandId}
                      onNavigate={navigate}
                      mode="edit"
                    />
                  </AdminRoute>
                )}
                {page === 'admin-products' && (
                  <AdminRoute>
                    <AdminProductListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-product-create' && (
                  <AdminRoute>
                    <ProductCreatePage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-product-edit' && (
                  <AdminRoute>
                    <ProductEditPage
                      productId={adminProductId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-product-detail' && (
                  <AdminRoute>
                    <AdminProductDetailPage
                      productId={adminProductId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-product-images' && (
                  <AdminRoute>
                    <ProductImageManagePage
                      productId={imageProductId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-orders' && (
                  <AdminRoute>
                    <OrderListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-order-detail' && (
                  <AdminRoute>
                    <OrderDetailPage orderId={orderId} onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-order-status-update' && (
                  <AdminRoute>
                    <OrderStatusUpdatePage
                      orderId={orderId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-order-shipment' && (
                  <AdminRoute>
                    <OrderShipmentManagePage
                      orderId={orderId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-payment-methods' && (
                  <AdminRoute>
                    <PaymentMethodListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-order-return' && (
                  <AdminRoute>
                    <OrderReturnManagePage
                      orderId={orderId}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-returns' && (
                  <AdminRoute>
                    <ReturnListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-coupons' && (
                  <AdminRoute>
                    <CouponListPage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-coupon-create' && (
                  <AdminRoute>
                    <CouponCreatePage onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-coupon-edit' && (
                  <AdminRoute>
                    <CouponEditPage
                      couponId={parseInt(couponId)}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-coupon-detail' && (
                  <AdminRoute>
                    <CouponDetailPage
                      couponId={parseInt(couponId)}
                      onNavigate={navigate}
                    />
                  </AdminRoute>
                )}
                {page === 'admin-analytics' && (
                  <AdminRoute>
                    <AdminAnalytics onNavigate={navigate} />
                  </AdminRoute>
                )}
                {page === 'admin-chat' && (
                  <AdminRoute>
                    <ChatManagementPage />
                  </AdminRoute>
                )}
                {page === 'payment-callback' && (
                  <PaymentCallbackPage onNavigate={navigate} />
                )}

                {/* Chat Widget - hiển thị trên các trang user */}
                {!isAdminPage && <ChatWidget />}

                {!isAdminPage && <Footer />}
                <AuthModal
                  open={authOpen}
                  mode={authMode}
                  onClose={() => setAuthOpen(false)}
                  onSwitchMode={(m) => setAuthMode(m)}
                />
              </div>
            </NavigationProvider>
          </CartProvider>
        </FavoriteProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
