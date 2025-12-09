import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    variant: 'danger',
    onConfirm: () => {},
    onCancel: () => {},
    loading: false,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title: options.title || 'Xác nhận',
        message: options.message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        variant: options.variant || 'danger',
        loading: false,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, open: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setConfirmState(prev => ({ ...prev, loading }));
  }, []);

  return {
    confirm,
    confirmState,
    setLoading,
  };
};