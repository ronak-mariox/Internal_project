import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { colors } from '../theme';
import { IconName } from '../icons/Icon';

export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'quality-check'
  | 'packing'
  | 'ready-for-dispatch'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type OrderProduct = {
  name: string;
  price: number;
  qty: number;
};

export type DeliveryPartner = {
  name: string;
  vehicle: string;
  plate: string;
};

export type OrderStatusEvent = {
  status: OrderStatus;
  time: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  location: string;
  addressLine1: string;
  addressLine2: string;
  timeLabel: string;
  amount: number;
  deliveryCharge: number;
  paymentMethod: string;
  status: OrderStatus;
  products: OrderProduct[];
  specialInstructions?: string;
  deliveryPartner?: DeliveryPartner;
  cancelReason?: string;
  failReason?: string;
  rating?: number;
  review?: string;
  statusHistory: OrderStatusEvent[];
  distanceLabel?: string;
  loyaltyLabel?: string;
  cancelledBy?: 'customer' | 'vendor';
};

export type OrderStatusMeta = {
  label: string;
  color: string;
  background: string;
  icon: IconName;
};

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  new: { label: 'New Order', color: '#1570EF', background: '#EFF8FF', icon: 'shopping-cart' },
  preparing: { label: 'Preparing', color: colors.warningDark, background: colors.warningSurface, icon: 'package' },
  'quality-check': { label: 'Quality Check', color: '#7C3AED', background: '#F5F3FF', icon: 'check-circle' },
  packing: { label: 'Packing', color: '#EA580C', background: '#FFF7ED', icon: 'layers' },
  'ready-for-dispatch': { label: 'Ready to Dispatch', color: '#0891B2', background: '#ECFEFF', icon: 'truck' },
  dispatched: { label: 'Dispatched', color: '#4338CA', background: '#EEF2FF', icon: 'truck' },
  completed: { label: 'Completed', color: colors.primary, background: colors.primarySurface, icon: 'check-circle' },
  cancelled: { label: 'Cancelled', color: colors.error, background: colors.errorSurface, icon: 'x-circle' },
  failed: { label: 'Failed', color: '#374151', background: '#F3F4F6', icon: 'alert-circle' },
};

const CATALOG_NAMES = [
  'Tata Salt (500g)',
  'Amul Full Cream Milk (500ml)',
  'Fortune Sunflower Oil (1L)',
  'Maggi Masala Noodles (70g)',
  'Britannia Bread (400g)',
  'Surf Excel Detergent (1kg)',
  'Colgate Toothpaste (200g)',
  'Parle-G Biscuits (200g)',
  "Lay's Classic Salted (52g)",
  'Amul Butter (100g)',
];

function synthesizeProducts(itemsCount: number, subtotal: number): OrderProduct[] {
  const base = Math.floor(subtotal / itemsCount);
  const remainder = subtotal - base * itemsCount;
  return Array.from({ length: itemsCount }).map((_, index) => ({
    name: CATALOG_NAMES[index % CATALOG_NAMES.length],
    price: index === 0 ? base + remainder : base,
    qty: 1,
  }));
}

const DELIVERY_CHARGE = 30;

function seedOrders(): Order[] {
  return [
    {
      id: 'ORD-8821',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      itemsCount: 4,
      location: 'Sector 5, Noida',
      addressLine1: '42, Shastri Nagar, Sector 5',
      addressLine2: 'Noida, Uttar Pradesh 201301',
      timeLabel: '10:34 AM',
      amount: 428,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'new',
      products: [
        { name: 'Tata Salt (500g)', price: 20, qty: 2 },
        { name: 'Amul Full Cream Milk (500ml)', price: 58, qty: 3 },
        { name: 'Fortune Sunflower Oil (1L)', price: 132, qty: 1 },
        { name: 'Maggi Masala Noodles (70g)', price: 13, qty: 4 },
      ],
      specialInstructions:
        'Please pack the oil bottle carefully with extra wrap. Call before delivery — gate code is 4512.',
      statusHistory: [{ status: 'new', time: '10:34 AM' }],
      distanceLabel: '2.4 km away',
      loyaltyLabel: '🏆 Regular',
    },
    {
      id: 'ORD-8820',
      customerName: 'Priya Singh',
      customerPhone: '+91 98123 45678',
      itemsCount: 2,
      location: 'Rohini, Delhi',
      addressLine1: '18, Pocket C, Rohini Sector 7',
      addressLine2: 'Delhi 110085',
      timeLabel: '9:58 AM',
      amount: 156,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'preparing',
      products: synthesizeProducts(2, 156 - DELIVERY_CHARGE),
      statusHistory: [
        { status: 'new', time: '9:40 AM' },
        { status: 'preparing', time: '9:58 AM' },
      ],
    },
    {
      id: 'ORD-8819',
      customerName: 'Amit Sharma',
      customerPhone: '+91 97001 22334',
      itemsCount: 6,
      location: 'Dwarka, Delhi',
      addressLine1: 'B-204, Sector 12, Dwarka',
      addressLine2: 'Delhi 110078',
      timeLabel: '9:22 AM',
      amount: 892,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'quality-check',
      products: synthesizeProducts(6, 892 - DELIVERY_CHARGE),
      statusHistory: [
        { status: 'new', time: '8:58 AM' },
        { status: 'preparing', time: '9:05 AM' },
        { status: 'quality-check', time: '9:22 AM' },
      ],
    },
    {
      id: 'ORD-8818',
      customerName: 'Sunita Rao',
      customerPhone: '+91 96543 21098',
      itemsCount: 3,
      location: 'Saket, Delhi',
      addressLine1: 'C-45, Saket',
      addressLine2: 'Delhi 110017',
      timeLabel: '8:45 AM',
      amount: 234,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'packing',
      products: synthesizeProducts(3, 234 - DELIVERY_CHARGE),
      statusHistory: [
        { status: 'new', time: '8:22 AM' },
        { status: 'preparing', time: '8:30 AM' },
        { status: 'quality-check', time: '8:38 AM' },
        { status: 'packing', time: '8:45 AM' },
      ],
    },
    {
      id: 'ORD-8817',
      customerName: 'Vikram Mehta',
      customerPhone: '+91 95432 10987',
      itemsCount: 5,
      location: 'Vasant Kunj, Delhi',
      addressLine1: 'D-12, Vasant Kunj',
      addressLine2: 'Delhi 110070',
      timeLabel: '8:10 AM',
      amount: 578,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'ready-for-dispatch',
      products: synthesizeProducts(5, 578 - DELIVERY_CHARGE),
      statusHistory: [
        { status: 'new', time: '7:44 AM' },
        { status: 'preparing', time: '7:52 AM' },
        { status: 'quality-check', time: '8:00 AM' },
        { status: 'packing', time: '8:06 AM' },
        { status: 'ready-for-dispatch', time: '8:10 AM' },
      ],
    },
    {
      id: 'ORD-8816',
      customerName: 'Deepa Nair',
      customerPhone: '+91 94321 09876',
      itemsCount: 2,
      location: 'Hauz Khas, Delhi',
      addressLine1: '7, Hauz Khas Village',
      addressLine2: 'Delhi 110016',
      timeLabel: 'Yesterday',
      amount: 324,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'dispatched',
      products: synthesizeProducts(2, 324 - DELIVERY_CHARGE),
      deliveryPartner: { name: 'Raju', vehicle: 'Hero Splendor', plate: 'DL 4C AR 2211' },
      statusHistory: [
        { status: 'new', time: 'Yesterday, 6:10 PM' },
        { status: 'preparing', time: 'Yesterday, 6:18 PM' },
        { status: 'quality-check', time: 'Yesterday, 6:24 PM' },
        { status: 'packing', time: 'Yesterday, 6:30 PM' },
        { status: 'ready-for-dispatch', time: 'Yesterday, 6:36 PM' },
        { status: 'dispatched', time: 'Yesterday, 6:42 PM' },
      ],
    },
    {
      id: 'ORD-8815',
      customerName: 'Rahul Gupta',
      customerPhone: '+91 93210 98765',
      itemsCount: 1,
      location: 'Lajpat Nagar, Delhi',
      addressLine1: '22, Lajpat Nagar II',
      addressLine2: 'Delhi 110024',
      timeLabel: 'Yesterday',
      amount: 196,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'completed',
      products: synthesizeProducts(1, 196 - DELIVERY_CHARGE),
      rating: 4.7,
      review: 'Excellent service!',
      statusHistory: [
        { status: 'new', time: 'Yesterday, 4:02 PM' },
        { status: 'preparing', time: 'Yesterday, 4:08 PM' },
        { status: 'quality-check', time: 'Yesterday, 4:14 PM' },
        { status: 'packing', time: 'Yesterday, 4:18 PM' },
        { status: 'ready-for-dispatch', time: 'Yesterday, 4:22 PM' },
        { status: 'dispatched', time: 'Yesterday, 4:28 PM' },
        { status: 'completed', time: 'Yesterday, 4:52 PM' },
      ],
    },
    {
      id: 'ORD-8814',
      customerName: 'Anita Singh',
      customerPhone: '+91 92109 87654',
      itemsCount: 3,
      location: 'Karol Bagh, Delhi',
      addressLine1: '9, Karol Bagh Market',
      addressLine2: 'Delhi 110005',
      timeLabel: 'Yesterday',
      amount: 445,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'cancelled',
      products: synthesizeProducts(3, 445 - DELIVERY_CHARGE),
      cancelReason: 'Ordered by mistake',
      cancelledBy: 'customer',
      statusHistory: [
        { status: 'new', time: 'Yesterday, 2:10 PM' },
        { status: 'cancelled', time: 'Yesterday, 2:16 PM' },
      ],
    },
    {
      id: 'ORD-8813',
      customerName: 'Kiran Patel',
      customerPhone: '+91 91098 76543',
      itemsCount: 2,
      location: 'Pitampura, Delhi',
      addressLine1: '55, Pitampura',
      addressLine2: 'Delhi 110034',
      timeLabel: '2 days ago',
      amount: 278,
      deliveryCharge: DELIVERY_CHARGE,
      paymentMethod: 'Paid via UPI · Razorpay',
      status: 'failed',
      products: synthesizeProducts(2, 278 - DELIVERY_CHARGE),
      failReason: 'Payment gateway timeout',
      statusHistory: [
        { status: 'new', time: '2 days ago, 11:04 AM' },
        { status: 'failed', time: '2 days ago, 11:09 AM' },
      ],
    },
  ];
}

function nowLabel() {
  return new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

type OrdersContextValue = {
  orders: Order[];
  getOrder: (orderId: string) => Order | undefined;
  ordersByStatus: (statuses: OrderStatus[]) => Order[];
  acceptOrder: (orderId: string) => void;
  acceptAllNew: () => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  cancelAcceptedOrder: (orderId: string, reason: string) => void;
  startQualityCheck: (orderId: string) => void;
  passQualityCheck: (orderId: string) => void;
  failQualityCheck: (orderId: string) => void;
  markPacked: (orderId: string) => void;
  handoverToPartner: (orderId: string) => void;
  replaceOrderItem: (orderId: string, targetName: string, replacement: OrderProduct) => void;
  removeOrderItem: (orderId: string, targetName: string) => void;
  completeOrder: (orderId: string, outcome?: { rating?: number; review?: string }) => void;
  assignDeliveryPartner: (orderId: string, partner: DeliveryPartner) => void;
};

function recalcTotals(products: OrderProduct[], deliveryCharge: number) {
  const subtotal = products.reduce((sum, product) => sum + product.price * product.qty, 0);
  const itemsCount = products.reduce((sum, product) => sum + product.qty, 0);
  return { amount: subtotal + deliveryCharge, itemsCount };
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

function advance(order: Order, status: OrderStatus, extra?: Partial<Order>): Order {
  return {
    ...order,
    ...extra,
    status,
    statusHistory: [...order.statusHistory, { status, time: nowLabel() }],
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  const updateOrder = useCallback((orderId: string, updater: (order: Order) => Order) => {
    setOrders(prev => prev.map(order => (order.id === orderId ? updater(order) : order)));
  }, []);

  const acceptOrder = useCallback(
    (orderId: string) => updateOrder(orderId, order => advance(order, 'preparing')),
    [updateOrder],
  );

  const acceptAllNew = useCallback(() => {
    setOrders(prev => prev.map(order => (order.status === 'new' ? advance(order, 'preparing') : order)));
  }, []);

  const rejectOrder = useCallback(
    (orderId: string, reason = 'Rejected by vendor') =>
      updateOrder(orderId, order =>
        advance(order, 'cancelled', { cancelReason: reason, cancelledBy: 'vendor' }),
      ),
    [updateOrder],
  );

  const cancelAcceptedOrder = useCallback(
    (orderId: string, reason: string) =>
      updateOrder(orderId, order =>
        advance(order, 'cancelled', { cancelReason: reason, cancelledBy: 'vendor' }),
      ),
    [updateOrder],
  );

  const startQualityCheck = useCallback(
    (orderId: string) => updateOrder(orderId, order => advance(order, 'quality-check')),
    [updateOrder],
  );

  const passQualityCheck = useCallback(
    (orderId: string) => updateOrder(orderId, order => advance(order, 'packing')),
    [updateOrder],
  );

  const failQualityCheck = useCallback(
    (orderId: string) =>
      updateOrder(orderId, order => advance(order, 'failed', { failReason: 'Failed quality check' })),
    [updateOrder],
  );

  const markPacked = useCallback(
    (orderId: string) => updateOrder(orderId, order => advance(order, 'ready-for-dispatch')),
    [updateOrder],
  );

  const handoverToPartner = useCallback(
    (orderId: string) =>
      updateOrder(orderId, order =>
        advance(order, 'dispatched', {
          deliveryPartner: order.deliveryPartner ?? {
            name: 'Raju',
            vehicle: 'Hero Splendor',
            plate: 'DL 4C AR 2211',
          },
        }),
      ),
    [updateOrder],
  );

  const replaceOrderItem = useCallback(
    (orderId: string, targetName: string, replacement: OrderProduct) =>
      updateOrder(orderId, order => {
        const products = order.products.map(product => (product.name === targetName ? replacement : product));
        return { ...order, products, ...recalcTotals(products, order.deliveryCharge) };
      }),
    [updateOrder],
  );

  const removeOrderItem = useCallback(
    (orderId: string, targetName: string) =>
      updateOrder(orderId, order => {
        const products = order.products.filter(product => product.name !== targetName);
        return { ...order, products, ...recalcTotals(products, order.deliveryCharge) };
      }),
    [updateOrder],
  );

  const completeOrder = useCallback(
    (orderId: string, outcome?: { rating?: number; review?: string }) =>
      updateOrder(orderId, order =>
        advance(order, 'completed', { rating: outcome?.rating, review: outcome?.review }),
      ),
    [updateOrder],
  );

  const assignDeliveryPartner = useCallback(
    (orderId: string, partner: DeliveryPartner) =>
      updateOrder(orderId, order => ({ ...order, deliveryPartner: partner })),
    [updateOrder],
  );

  const getOrder = useCallback((orderId: string) => orders.find(order => order.id === orderId), [orders]);

  const ordersByStatus = useCallback(
    (statuses: OrderStatus[]) => orders.filter(order => statuses.includes(order.status)),
    [orders],
  );

  const value = useMemo(
    () => ({
      orders,
      getOrder,
      ordersByStatus,
      acceptOrder,
      acceptAllNew,
      rejectOrder,
      cancelAcceptedOrder,
      startQualityCheck,
      passQualityCheck,
      failQualityCheck,
      markPacked,
      handoverToPartner,
      replaceOrderItem,
      removeOrderItem,
      completeOrder,
      assignDeliveryPartner,
    }),
    [
      orders,
      getOrder,
      ordersByStatus,
      acceptOrder,
      acceptAllNew,
      rejectOrder,
      cancelAcceptedOrder,
      startQualityCheck,
      passQualityCheck,
      failQualityCheck,
      markPacked,
      handoverToPartner,
      replaceOrderItem,
      removeOrderItem,
      completeOrder,
      assignDeliveryPartner,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
