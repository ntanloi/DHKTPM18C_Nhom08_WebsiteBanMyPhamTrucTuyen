import type { Shipment } from '../types/Shipment';
import { mockOrders } from '../mocks/orderMockData';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockShipmentService = {
  /**
   * GET /api/orders/{orderId}/shipment
   */
  getShipmentByOrderId: async (orderId: number): Promise<Shipment | null> => {
    await delay(300);
    const order = mockOrders.find((o) => o.id === orderId);
    return order?.shipment || null;
  },

  /**
   * POST /api/orders/{orderId}/shipment
   */
  createShipment: async (
    orderId: number,
    data: Partial<Shipment>,
  ): Promise<Shipment> => {
    await delay(500);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Generate new shipment ID
    const allShipmentIds = mockOrders
      .map((o) => o.shipment?.id || 0)
      .filter((id) => id > 0);
    const newId =
      allShipmentIds.length > 0 ? Math.max(...allShipmentIds) + 1 : 1;

    const newShipment: Shipment = {
      id: newId,
      orderId,
      status: data.status || 'PENDING',
      trackingCode: data.trackingCode || '',
      shippingProviderName: data.shippingProviderName || '',
      shippedAt: data.shippedAt || '',
      deliveredAt: data.deliveredAt || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update order in mock data
    order.shipment = newShipment;

    return newShipment;
  },

  /**
   * PUT /api/orders/{orderId}/shipment
   */
  updateShipment: async (
    orderId: number,
    data: Partial<Shipment>,
  ): Promise<Shipment> => {
    await delay(500);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order || !order.shipment) {
      throw new Error('Shipment not found');
    }

    // Update shipment data
    order.shipment = {
      ...order.shipment,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Auto-update status based on shipment status
    if (data.status === 'SHIPPED' && order.status === 'PROCESSING') {
      order.status = 'SHIPPED';
    } else if (data.status === 'DELIVERED' && order.status === 'SHIPPED') {
      order.status = 'DELIVERED';
    }

    return order.shipment;
  },

  /**
   * PATCH /api/orders/{orderId}/shipment/tracking
   */
  updateTrackingCode: async (
    orderId: number,
    trackingCode: string,
    shippingProviderName: string,
  ): Promise<Shipment> => {
    await delay(400);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order || !order.shipment) {
      throw new Error('Shipment not found');
    }

    order.shipment = {
      ...order.shipment,
      trackingCode,
      shippingProviderName,
      updatedAt: new Date().toISOString(),
    };

    return order.shipment;
  },

  /**
   * POST /api/orders/{orderId}/shipment/mark-shipped
   */
  markAsShipped: async (orderId: number): Promise<Shipment> => {
    await delay(500);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order || !order.shipment) {
      throw new Error('Shipment not found');
    }

    order.shipment = {
      ...order.shipment,
      status: 'SHIPPED',
      shippedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update order status
    order.status = 'SHIPPED';

    return order.shipment;
  },

  /**
   * POST /api/orders/{orderId}/shipment/mark-delivered
   */
  markAsDelivered: async (orderId: number): Promise<Shipment> => {
    await delay(500);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order || !order.shipment) {
      throw new Error('Shipment not found');
    }

    order.shipment = {
      ...order.shipment,
      status: 'DELIVERED',
      deliveredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update order status
    order.status = 'DELIVERED';

    return order.shipment;
  },
};

// Service wrapper with feature flag
const USE_MOCK = false; // Set to true for development without backend

export const shipmentService = USE_MOCK
  ? mockShipmentService
  : mockShipmentService; // Replace with real service when available
