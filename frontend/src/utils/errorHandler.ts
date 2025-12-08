/**
 * Error handling utilities for API errors
 * Provides consistent error messages and handling across the application
 */

export interface ErrorInfo {
  message: string;
  canRetry: boolean;
  shouldRedirect?: string;
  supportContact?: string;
}

/**
 * Parse API error and return user-friendly error information
 */
export const parseApiError = (err: any): ErrorInfo => {
  // Network error (no response from server)
  if (err.request && !err.response) {
    // Check if it's a timeout
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return {
        message: 'Yêu cầu quá thời gian. Vui lòng thử lại.',
        canRetry: true,
      };
    }
    
    // General network error
    return {
      message: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.',
      canRetry: true,
    };
  }

  // Server responded with error status
  if (err.response) {
    const status = err.response.status;
    const message = err.response.data?.message || 'Có lỗi xảy ra';

    switch (status) {
      case 400:
        return {
          message: `Dữ liệu không hợp lệ: ${message}`,
          canRetry: false,
        };

      case 401:
        return {
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          canRetry: false,
          shouldRedirect: '/login',
        };

      case 403:
        return {
          message: 'Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.',
          canRetry: false,
        };

      case 404:
        return {
          message: 'Không tìm thấy dữ liệu yêu cầu.',
          canRetry: false,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: 'Lỗi server. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.',
          canRetry: true,
          supportContact: 'Email: support@beautybox.com | Hotline: 1900-xxxx',
        };

      default:
        return {
          message: message || 'Có lỗi xảy ra. Vui lòng thử lại.',
          canRetry: true,
        };
    }
  }

  // Other errors
  return {
    message: err.message || 'Có lỗi không xác định xảy ra.',
    canRetry: false,
  };
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (errorInfo: ErrorInfo): string => {
  let message = errorInfo.message;
  
  if (errorInfo.supportContact) {
    message += `\n\n${errorInfo.supportContact}`;
  }
  
  return message;
};
