import './App.css';
import Footer from './components/user/layout/Footer';
import HomePage from './pages/user/HomePage';
import Header from './components/user/layout/Header';
import StoreLocatorPage from './pages/user/StoreLocatorPage';
import { useEffect, useState } from 'react';
import AuthModal from './components/user/ui/AuthModal';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/user/ProductDetailPage';

type Page = 'home' | 'stores' | 'products' | 'product-detail'; // thêm Products loi

function App() {
  const pathToPage = (path: string): Page => {
    if (path === '/stores') return 'stores';
    if (path.startsWith('/products/')) return 'products';
    if (path.startsWith('/product/')) return 'product-detail'; // THÊM DÒNG NÀY
    return 'home';
  }; //sửa đoạn này nưữa loi

  const [page, setPage] = useState<Page>(pathToPage(window.location.pathname));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [productCategory, setProductCategory] = useState<string>('');
  const [productId, setProductId] = useState<string>(''); //thêm dòng này loi

  const navigate = (to: string) => {
    //loi yo
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setPage(pathToPage(to));

    // Extract category from URL loii
    if (to.startsWith('/products/')) {
      const category = to.replace('/products/', '');
      setProductCategory(category);
    }

    // THÊM: Extract product ID from URL
    if (to.startsWith('/product/')) {
      const id = to.replace('/product/', '');
      setProductId(id);
    }
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      setPage(pathToPage(path));

      // Update productCategory or productId based on path
      if (path.startsWith('/products/')) {
        const category = path.replace('/products/', '');
        setProductCategory(category);
      } else if (path.startsWith('/product/')) {
        const id = path.replace('/product/', '');
        setProductId(id);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div>
      <Header
        onOpenStores={() => navigate('/stores')}
        onOpenLogin={() => setAuthOpen(true)}
      />
      {page === 'home' && <HomePage />}
      {page === 'stores' && <StoreLocatorPage />}
      {page === 'products' && <ProductListPage />} {/* sửa lại đoạn này */}
      {page === 'product-detail' && <ProductDetailPage productId={productId} />}
      <Footer />
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
      />
    </div>
  );
}

export default App;
