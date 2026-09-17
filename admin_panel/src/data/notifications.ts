import type { AdminNotification, SupportTicket } from '@/types';
import { daysAgo, hoursAgo, createRng, pick, intBetween } from '@/lib/rng';
import { customers } from './customers';
import { vendors } from './vendors';
import { drivers } from './drivers';
import { orders } from './orders';

export const adminNotifications: AdminNotification[] = [
  { id: 'ntf-001', title: 'Weekend Free Delivery is live', body: 'FREEDEL promo pushed to all customers for the weekend.', audience: 'customers', sentAt: hoursAgo(6), reach: 48210 },
  { id: 'ntf-002', title: 'New commission slab effective 1 Oct', body: 'Updated commission rates have been communicated to all active vendors.', audience: 'vendors', sentAt: daysAgo(1), reach: 312 },
  { id: 'ntf-003', title: 'Surge zone bonus — Sector 62', body: 'Extra ₹20/delivery bonus active for the next 3 hours in Sector 62, Noida.', audience: 'drivers', sentAt: hoursAgo(2), reach: 46 },
  { id: 'ntf-004', title: 'Scheduled maintenance tonight', body: 'Platform will be briefly unavailable between 2–2:30 AM IST for maintenance.', audience: 'all', sentAt: daysAgo(2), reach: 52890 },
  { id: 'ntf-005', title: 'GST invoice update rolled out', body: 'Vendors can now download consolidated monthly GST invoices from Payments.', audience: 'vendors', sentAt: daysAgo(4), reach: 312 },
];

const rng = createRng(321);
const subjects = [
  'Order items missing on delivery', 'Refund not received', 'Wrong item delivered', 'Delivery partner rude behaviour',
  'App crashing on checkout', 'Unable to update store timings', 'Payout delayed for last week', 'Customer unreachable at address',
  'Duplicate charge on card', 'Product listing rejected without reason',
];
const categories = ['Order Issue', 'Payment', 'Delivery', 'Account', 'Technical', 'Catalog'];

export const supportTickets: SupportTicket[] = Array.from({ length: 22 }, (_, i) => {
  const raisedByType = pick(rng, ['customer', 'vendor', 'driver'] as const);
  const raisedBy = raisedByType === 'customer' ? pick(rng, customers).name : raisedByType === 'vendor' ? pick(rng, vendors).ownerName : pick(rng, drivers).name;
  const created = intBetween(rng, 1, 20);
  const order = rng() > 0.4 ? pick(rng, orders) : undefined;
  return {
    id: `TCK-${(5200 + i).toString()}`,
    subject: pick(rng, subjects),
    raisedBy,
    raisedByType,
    category: pick(rng, categories),
    priority: pick(rng, ['low', 'medium', 'high', 'urgent'] as const),
    status: pick(rng, ['open', 'in-progress', 'resolved', 'escalated'] as const),
    orderId: order?.id,
    createdAt: daysAgo(created),
    updatedAt: daysAgo(Math.max(created - intBetween(rng, 0, created), 0)),
  };
}).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
