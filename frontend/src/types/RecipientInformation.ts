import type { Order } from './Order';

export interface RecipientInformation {
  id: number;
  recipientPhone: string;
  shippingRecipientAddress: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  isAnotherReceiver: boolean;
  createdAt: string;
  order?: Order;
}
