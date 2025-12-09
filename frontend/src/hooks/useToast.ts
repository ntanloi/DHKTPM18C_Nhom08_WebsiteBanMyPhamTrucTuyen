import { useState } from 'react';
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

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};