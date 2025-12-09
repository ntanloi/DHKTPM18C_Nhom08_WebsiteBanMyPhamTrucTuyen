import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { AuthContext } from './auth-context';
import {
  getFavoritesByUserId,
  createFavorite,
  deleteFavorite,
  deleteFavoriteByUserAndProduct,
  type FavoriteListResponse,
} from '../api/favoriteList';

interface FavoriteContextType {
  favorites: FavoriteListResponse[];
  loading: boolean;
  error: string | null;
  favoriteCount: number;
  isFavorited: (productId: number) => boolean;
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  removeFavoriteById: (favoriteId: number) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [favorites, setFavorites] = useState<FavoriteListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getFavoritesByUserId(user.userId);
      setFavorites(data);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      setError('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (productId: number): boolean => {
    return favorites.some((fav) => fav.productId === productId);
  };

  const addToFavorites = async (productId: number) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm vào yêu thích');
    }

    try {
      const newFavorite = await createFavorite({
        userId: user.userId,
        productId,
      });
      setFavorites((prev) => [...prev, newFavorite]);
    } catch (err: any) {
      console.error('Error adding to favorites:', err);
      throw new Error(
        err.response?.data?.error || 'Không thể thêm vào yêu thích',
      );
    }
  };

  const removeFromFavorites = async (productId: number) => {
    if (!user) return;

    try {
      await deleteFavoriteByUserAndProduct(user.userId, productId);
      setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
    } catch (err: any) {
      console.error('Error removing from favorites:', err);
      throw new Error('Không thể xóa khỏi yêu thích');
    }
  };

  const removeFavoriteById = async (favoriteId: number) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      throw new Error('Không thể xóa sản phẩm yêu thích');
    }
  };

  const clearAllFavorites = async () => {
    try {
      await Promise.all(favorites.map((fav) => deleteFavorite(fav.id)));
      setFavorites([]);
    } catch (err: any) {
      console.error('Error clearing favorites:', err);
      throw new Error('Không thể xóa tất cả sản phẩm yêu thích');
    }
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const value: FavoriteContextType = {
    favorites,
    loading,
    error,
    favoriteCount: favorites.length,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    removeFavoriteById,
    clearAllFavorites,
    refreshFavorites,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
