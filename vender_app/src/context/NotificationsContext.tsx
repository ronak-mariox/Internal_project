import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type NotificationCategory =
  | 'new-order'
  | 'order-cancellation'
  | 'low-stock'
  | 'out-of-stock'
  | 'payment'
  | 'settlement'
  | 'product-approval'
  | 'kyc-status'
  | 'store-status'
  | 'system-alert'
  | 'announcement';

export type NotificationTab = 'all' | 'unread' | 'orders' | 'payments' | 'system';
export type NotificationGroup = 'Today' | 'Yesterday' | 'Earlier';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  subtitle: string;
  timeLabel: string;
  group: NotificationGroup;
  read: boolean;
  tabs: NotificationTab[];
  orderId?: string;
  settlementId?: string;
  productName?: string;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NTF-2024-8825',
    category: 'new-order',
    title: 'New Order #VD9284',
    subtitle: 'Rajesh Kumar · ₹428',
    timeLabel: '2 min ago',
    group: 'Today',
    read: false,
    tabs: ['orders'],
    orderId: 'ORD-8821',
  },
  {
    id: 'NTF-2024-8824',
    category: 'low-stock',
    title: 'Amul Full Cream Milk going low',
    subtitle: '8 units left',
    timeLabel: '15 min ago',
    group: 'Today',
    read: false,
    tabs: ['system'],
    productName: 'Amul Full Cream Milk',
  },
  {
    id: 'NTF-2024-8828',
    category: 'order-cancellation',
    title: 'Order #ORD-8814 Cancelled',
    subtitle: 'Anita Singh · Ordered by mistake',
    timeLabel: '35 min ago',
    group: 'Today',
    read: false,
    tabs: ['orders'],
    orderId: 'ORD-8814',
  },
  {
    id: 'NTF-2024-8827',
    category: 'payment',
    title: 'Payment Received',
    subtitle: 'Order #ORD-8814 · ₹445',
    timeLabel: '40 min ago',
    group: 'Today',
    read: false,
    tabs: ['payments'],
    orderId: 'ORD-8814',
  },
  {
    id: 'NTF-2024-8826',
    category: 'product-approval',
    title: 'Product Approved',
    subtitle: 'Fortune Sunflower Oil 1L is now live',
    timeLabel: '50 min ago',
    group: 'Today',
    read: false,
    tabs: ['system'],
    productName: 'Fortune Sunflower Oil 1L',
  },
  {
    id: 'NTF-2024-8823',
    category: 'settlement',
    title: 'Settlement ₹37,582 credited',
    subtitle: 'STL-2024-0089',
    timeLabel: '1 hour ago',
    group: 'Today',
    read: false,
    tabs: ['payments'],
    settlementId: 'STL-2024-0089',
  },
  {
    id: 'NTF-2024-8822',
    category: 'out-of-stock',
    title: 'Tata Salt 1kg out of stock',
    subtitle: 'Action needed',
    timeLabel: '2 hours ago',
    group: 'Today',
    read: true,
    tabs: ['system'],
    productName: 'Tata Salt (500g)',
  },
  {
    id: 'NTF-2024-8821',
    category: 'kyc-status',
    title: 'KYC documents approved',
    subtitle: 'Account fully verified',
    timeLabel: 'Yesterday',
    group: 'Yesterday',
    read: true,
    tabs: ['system'],
  },
  {
    id: 'NTF-2024-8820',
    category: 'announcement',
    title: 'New Verdant policy update',
    subtitle: 'Important changes to commission',
    timeLabel: '3 days ago',
    group: 'Earlier',
    read: true,
    tabs: ['system'],
  },
  {
    id: 'NTF-2024-8819',
    category: 'store-status',
    title: 'Store temporarily closed',
    subtitle: 'Auto-closed outside operating hours',
    timeLabel: '3 days ago',
    group: 'Earlier',
    read: true,
    tabs: ['system'],
  },
  {
    id: 'NTF-2024-8818',
    category: 'system-alert',
    title: 'Scheduled maintenance tonight',
    subtitle: '12:00 AM – 2:00 AM · App may be unavailable',
    timeLabel: '4 days ago',
    group: 'Earlier',
    read: true,
    tabs: ['system'],
  },
];

type NotificationsContextValue = {
  notifications: AppNotification[];
  getNotification: (id: string) => AppNotification | undefined;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  undoMarkAllAsRead: (previous: AppNotification[]) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const getNotification = useCallback(
    (id: string) => notifications.find(item => item.id === id),
    [notifications],
  );

  const unreadCount = useMemo(() => notifications.filter(item => !item.read).length, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  }, []);

  const undoMarkAllAsRead = useCallback((previous: AppNotification[]) => {
    setNotifications(previous);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      getNotification,
      unreadCount,
      markAsRead,
      markAllAsRead,
      undoMarkAllAsRead,
      dismissNotification,
      clearAll,
    }),
    [notifications, getNotification, unreadCount, markAsRead, markAllAsRead, undoMarkAllAsRead, dismissNotification, clearAll],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
