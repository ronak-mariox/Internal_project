// Shared domain model for the Verdant Admin panel.
// Mirrors the field conventions used across the Verdant (customer), vender_app (vendor)
// and DeliveryApp (driver) React Native apps so the same records make sense on both sides.

export type ID = string;

// ---------------------------------------------------------------------------
// Catalog: categories, subcategories, products
// ---------------------------------------------------------------------------

export type CatalogStatus = 'active' | 'inactive';

export interface Subcategory {
  id: ID;
  categoryId: ID;
  name: string;
  image: string;
  productCount: number;
  status: CatalogStatus;
}

export interface Category {
  id: ID;
  name: string;
  image: string;
  colorFrom: string;
  colorTo: string;
  order: number;
  status: CatalogStatus;
  showOnHome: boolean;
  subcategories: Subcategory[];
}

export type ProductStatus =
  | 'active'
  | 'pending'
  | 'low-stock'
  | 'out-of-stock'
  | 'rejected'
  | 'draft';

export interface Product {
  id: ID;
  name: string;
  brand: string;
  image: string;
  categoryId: ID;
  categoryName: string;
  subcategoryId: ID;
  subcategoryName: string;
  vendorId: ID;
  vendorName: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  stock: number;
  reorderLevel: number;
  sku: string;
  gstRate: number;
  status: ProductStatus;
  rating: number;
  ratingCount: number;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

export type VendorStatus = 'active' | 'pending' | 'suspended' | 'rejected';
export type KycStatus = 'verified' | 'pending' | 'rejected';

export interface Vendor {
  id: ID;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  avatarColor: string;
  category: string;
  city: string;
  address: string;
  status: VendorStatus;
  kycStatus: KycStatus;
  rating: number;
  totalOrders: number;
  revenue: number;
  commissionRate: number;
  productsCount: number;
  joinedAt: string;
  gstNumber: string;
}

// ---------------------------------------------------------------------------
// Delivery partners (drivers)
// ---------------------------------------------------------------------------

export type DriverStatus = 'online' | 'offline' | 'on-delivery' | 'suspended';

export interface Driver {
  id: ID;
  name: string;
  phone: string;
  email: string;
  avatarColor: string;
  vehicleType: 'bicycle' | 'motorbike' | 'scooter' | 'other';
  vehicleNumber: string;
  zone: string;
  status: DriverStatus;
  kycStatus: KycStatus;
  rating: number;
  totalDeliveries: number;
  completionRate: number;
  earningsThisMonth: number;
  joinedAt: string;
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export type CustomerStatus = 'active' | 'blocked';

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  city: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt: string;
}

// ---------------------------------------------------------------------------
// Orders — status pipeline mirrors vender_app/src/context/OrdersContext.tsx
// ---------------------------------------------------------------------------

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

export interface OrderItem {
  productId: ID;
  name: string;
  image: string;
  qty: number;
  price: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  time: string;
}

export interface Order {
  id: ID;
  customerId: ID;
  customerName: string;
  customerPhone: string;
  vendorId: ID;
  vendorName: string;
  driverId?: ID;
  driverName?: string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery' | 'Wallet';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  status: OrderStatus;
  address: string;
  city: string;
  placedAt: string;
  statusHistory: OrderStatusEvent[];
  cancelReason?: string;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; surface: string }
> = {
  new: { label: 'New', color: 'var(--color-info)', surface: 'var(--color-info-surface)' },
  preparing: { label: 'Preparing', color: 'var(--color-orange)', surface: 'var(--color-orange-surface)' },
  'quality-check': { label: 'Quality Check', color: 'var(--color-violet)', surface: 'var(--color-violet-surface)' },
  packing: { label: 'Packing', color: 'var(--color-orange)', surface: 'var(--color-orange-surface)' },
  'ready-for-dispatch': { label: 'Ready for Dispatch', color: 'var(--color-teal)', surface: 'var(--color-teal-surface)' },
  dispatched: { label: 'Dispatched', color: 'var(--color-indigo)', surface: 'var(--color-indigo-surface)' },
  completed: { label: 'Completed', color: 'var(--color-success)', surface: 'var(--color-success-surface)' },
  cancelled: { label: 'Cancelled', color: 'var(--color-ink-500)', surface: 'var(--color-ink-100)' },
  failed: { label: 'Failed', color: 'var(--color-danger)', surface: 'var(--color-danger-surface)' },
};

// ---------------------------------------------------------------------------
// Settlements / payouts
// ---------------------------------------------------------------------------

export type SettlementStatus = 'paid' | 'processing' | 'pending' | 'failed';

export interface VendorSettlement {
  id: ID;
  vendorId: ID;
  vendorName: string;
  periodLabel: string;
  grossSales: number;
  commissionRate: number;
  commission: number;
  adjustments: number;
  netPayout: number;
  status: SettlementStatus;
  dueDate: string;
  transactionRef?: string;
}

export interface DriverPayout {
  id: ID;
  driverId: ID;
  driverName: string;
  periodLabel: string;
  deliveries: number;
  baseEarnings: number;
  incentives: number;
  totalPayout: number;
  status: SettlementStatus;
  dueDate: string;
}

// ---------------------------------------------------------------------------
// Offers / promotions
// ---------------------------------------------------------------------------

export type OfferStatus = 'active' | 'scheduled' | 'expired' | 'paused';

export interface Offer {
  id: ID;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'flat' | 'free-delivery';
  value: number;
  minOrderValue: number;
  appliesTo: string;
  usageCount: number;
  status: OfferStatus;
  startDate: string;
  endDate: string;
}

// ---------------------------------------------------------------------------
// Notifications / announcements sent from admin
// ---------------------------------------------------------------------------

export type NotificationAudience = 'customers' | 'vendors' | 'drivers' | 'all';

export interface AdminNotification {
  id: ID;
  title: string;
  body: string;
  audience: NotificationAudience;
  sentAt: string;
  reach: number;
}

// ---------------------------------------------------------------------------
// Support tickets / disputes
// ---------------------------------------------------------------------------

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: ID;
  subject: string;
  raisedBy: string;
  raisedByType: 'customer' | 'vendor' | 'driver';
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  orderId?: ID;
  createdAt: string;
  updatedAt: string;
}
