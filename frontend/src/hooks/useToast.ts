import { useState, useCallback } from 'react';
import type { ToastType } from '../components/user/ui/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: '', type: 'info' });
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
