// Payment Method Icon Utilities
import codIcon from '../assets/images/cod.png';
import momoIcon from '../assets/images/momo.png';
import visaIcon from '../assets/images/visa.png';
import masterIcon from '../assets/images/master.png';
import napasIcon from '../assets/images/napas.png';

export const getPaymentIcon = (iconCode: string | null | undefined): string => {
  if (!iconCode) return codIcon;
  
  const iconMap: Record<string, string> = {
    'cod': codIcon,
    'momo': momoIcon,
    'visa': visaIcon,
    'master': masterIcon,
    'napas': napasIcon,
    'vnpay': napasIcon, // Use napas icon for vnpay
    'zalopay': momoIcon, // Use momo icon for zalopay as fallback
    'bank': napasIcon,
  };
  
  const lowerCode = iconCode.toLowerCase();
  return iconMap[lowerCode] || codIcon;
};

export const getPaymentIconEmoji = (code: string): string => {
  const emojiMap: Record<string, string> = {
    COD: '💵',
    BANK_TRANSFER: '🏦',
    CREDIT_CARD: '💳',
    MOMO: '📱',
    ZALOPAY: '💰',
    VNPAY: '🔷',
  };
  return emojiMap[code] || '💳';
};
