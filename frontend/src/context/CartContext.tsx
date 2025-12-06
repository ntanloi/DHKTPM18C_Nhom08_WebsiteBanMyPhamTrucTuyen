import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartResponse, CartItemResponse } from '../api/cart';
import { getCartByUserId, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeCartItem as removeCartItemAPI, clearCart as clearCartAPI } from '../api/cart';
import { AuthContext } from './auth-context';

const GUEST_CART_KEY = 'guest_cart';

interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productVariantId: number, quantity: number, productName?: string, variantName?: string, price?: number, imageUrl?: string) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  isGuest: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Helper functions for guest cart
const getGuestCart = (): CartResponse => {
  const stored = localStorage.getItem(GUEST_CART_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createEmptyCart();
    }
  }
  return createEmptyCart();
};

const saveGuestCart = (cart: CartResponse) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const createEmptyCart = (): CartResponse => ({
  id: 0,
  userId: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalAmount: 0,
  cartItems: [],
});

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('CartProvider must be used within AuthProvider');
  }
  const { user } = authContext;
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isGuest = !user;

  const fetchCart = async () => {
    if (isGuest) {
      // Guest user - load from localStorage
      const guestCart = getGuestCart();
      setCart(guestCart);
      return;
    }

    if (!user?.userId) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCartByUserId(user.userId);
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Không thể tải giỏ hàng');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productVariantId: number, 
    quantity: number,
    productName?: string,
    variantName?: string,
    price?: number,
    imageUrl?: string
  ) => {
    if (isGuest) {
      // Guest user - save to localStorage
      const currentCart = getGuestCart();
      const existingItemIndex = currentCart.cartItems.findIndex(
        item => item.productVariantId === productVariantId
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        currentCart.cartItems[existingItemIndex].quantity += quantity;
        currentCart.cartItems[existingItemIndex].subtotal = 
          currentCart.cartItems[existingItemIndex].quantity * currentCart.cartItems[existingItemIndex].price;
      } else {
        // Add new item
        const newItem: CartItemResponse = {
          id: Date.now(), // Temporary ID for guest
          productVariantId,
          productName: productName || 'Sản phẩm',
          variantName: variantName || '',
          quantity,
          price: price || 0,
          subtotal: quantity * (price || 0),
          imageUrl: imageUrl || '',
        };
        currentCart.cartItems.push(newItem);
      }

      // Recalculate total
      currentCart.totalAmount = currentCart.cartItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      currentCart.updatedAt = new Date().toISOString();

      saveGuestCart(currentCart);
      setCart(currentCart);
      return;
    }

    // Logged in user - call API
    if (!user?.userId) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    setLoading(true);
    setError(null);
    try {
      const data = await addToCartAPI(user.userId, { productVariantId, quantity });
      setCart(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    if (isGuest) {
      // Guest user - update localStorage
      const currentCart = getGuestCart();
      const itemIndex = currentCart.cartItems.findIndex(item => item.id === cartItemId);
      
      if (itemIndex >= 0) {
        currentCart.cartItems[itemIndex].quantity = quantity;
        currentCart.cartItems[itemIndex].subtotal = 
          quantity * currentCart.cartItems[itemIndex].price;
        
        currentCart.totalAmount = currentCart.cartItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        currentCart.updatedAt = new Date().toISOString();
        
        saveGuestCart(currentCart);
        setCart(currentCart);
      }
      return;
    }

    if (!user?.userId) {
      throw new Error('Vui lòng đăng nhập');
    }

    setLoading(true);
    setError(null);
    try {
      const data = await updateCartItemAPI(user.userId, cartItemId, { quantity });
      setCart(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Không thể cập nhật số lượng';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (isGuest) {
      // Guest user - remove from localStorage
      const currentCart = getGuestCart();
      currentCart.cartItems = currentCart.cartItems.filter(item => item.id !== cartItemId);
      
      currentCart.totalAmount = currentCart.cartItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      currentCart.updatedAt = new Date().toISOString();
      
      saveGuestCart(currentCart);
      setCart(currentCart);
      return;
    }

    if (!user?.userId) {
      throw new Error('Vui lòng đăng nhập');
    }

    setLoading(true);
    setError(null);
    try {
      const data = await removeCartItemAPI(user.userId, cartItemId);
      setCart(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Không thể xóa sản phẩm';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (isGuest) {
      // Guest user - clear localStorage
      localStorage.removeItem(GUEST_CART_KEY);
      setCart(createEmptyCart());
      return;
    }

    if (!user?.userId) {
      throw new Error('Vui lòng đăng nhập');
    }

    setLoading(true);
    setError(null);
    try {
      await clearCartAPI(user.userId);
      setCart(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Không thể xóa giỏ hàng';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, [user?.userId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartItemCount,
        isGuest,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
