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

type Page = 'home' | 'stores' | 'products' | 'product-detail' | 'checkout';

function App() {
  const pathToPage = (path: string): Page => {
    if (path === '/stores') return 'stores';
    if (path === '/checkout') return 'checkout';
    if (path.startsWith('/products') || path === '/products') return 'products';
    if (path.startsWith('/product/')) return 'product-detail';
    return 'home';
  };

  const [page, setPage] = useState<Page>(pathToPage(window.location.pathname));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [productId, setProductId] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');

  // Extract initial categorySlug from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      setCategorySlug(slug);
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

    // Extract product ID from URL
    if (pathname.startsWith('/product/')) {
      const id = pathname.replace('/product/', '');
      setProductId(id);
    }
  };

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

      // Update productId based on path
      if (path.startsWith('/product/')) {
        const id = path.replace('/product/', '');
        setProductId(id);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <NavigationProvider navigate={navigate}>
      <div>
        <Header
          onOpenStores={() => navigate('/stores')}
          onOpenLogin={() => setAuthOpen(true)}
          onNavigate={navigate}
        />
        {page === 'home' && <HomePage />}
        {page === 'stores' && <StoreLocatorPage />}
        {page === 'products' && <ProductListPage categorySlug={categorySlug} />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'product-detail' && (
          <ProductDetailPage productId={productId} />
        )}
        <Footer />
        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      </div>
    </NavigationProvider>
  );
}

export default App;
