import type { OrderStatus } from '../models/Order';

/**
 * Who may move an order into each next status, and from which statuses.
 * Enforced server-side so a status can never jump (e.g. delivered -> preparing)
 * regardless of what a client sends.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, { to: OrderStatus; by: Array<'vendor' | 'customer' | 'admin'> }[]> = {
  placed: [
    { to: 'accepted', by: ['vendor', 'admin'] },
    { to: 'rejected', by: ['vendor', 'admin'] },
    { to: 'cancelled', by: ['customer', 'admin'] },
  ],
  accepted: [
    { to: 'preparing', by: ['vendor', 'admin'] },
    { to: 'cancelled', by: ['customer', 'vendor', 'admin'] },
  ],
  preparing: [
    { to: 'ready_for_pickup', by: ['vendor', 'admin'] },
    { to: 'cancelled', by: ['vendor', 'admin'] },
  ],
  ready_for_pickup: [
    { to: 'out_for_delivery', by: ['vendor', 'admin'] },
    { to: 'cancelled', by: ['vendor', 'admin'] },
  ],
  out_for_delivery: [{ to: 'delivered', by: ['vendor', 'admin'] }],
  delivered: [],
  cancelled: [],
  rejected: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus, by: 'vendor' | 'customer' | 'admin'): boolean {
  return ORDER_TRANSITIONS[from].some((t) => t.to === to && t.by.includes(by));
}

export const CANCELLABLE_STATUSES: OrderStatus[] = ['placed', 'accepted', 'preparing'];
