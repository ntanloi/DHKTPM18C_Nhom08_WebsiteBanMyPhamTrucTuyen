import type { User } from './User';
import type { OrderItem } from './OrderItem';
import type { Payment } from './Payment';
import type { Return } from './Return';
import type { Shipment } from './Shipment';
import type { OrderStatusHistory } from './OrderStatusHistory';
import type { RecipientInformation } from './RecipientInformation';

export interface Order {
  id: number;
  userId: number;
  status: string;
  subtotal: number;
  totalAmount: number;
  notes: string;
  discountAmount: number;
  shippingFee: number;
  estimateDeliveryFrom: string;
  estimateDeliveryTo: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  orderItems?: OrderItem[];
  payment?: Payment;
  returnInfo?: Return;
  shipment?: Shipment;
  orderStatusHistory?: OrderStatusHistory;
  recipientInformation?: RecipientInformation;
}
