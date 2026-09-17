import type { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { HttpError } from '../lib/httpError';
import { toSafeJson } from '../lib/sanitize';
import { canTransition } from '../lib/orderStatus';
import type { OrderStatus } from '../models/Order';

export async function listMyOrders(req: Request, res: Response) {
  const { status } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = { vendorId: req.user!.id };
  if (status) filter.status = status;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders.map((o) => toSafeJson(o)));
}

export async function getMyOrder(req: Request, res: Response) {
  const order = await Order.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!order) throw new HttpError(404, 'Order not found');
  res.json(toSafeJson(order));
}

export async function updateOrderStatus(req: Request, res: Response) {
  const order = await Order.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!order) throw new HttpError(404, 'Order not found');

  const nextStatus = req.body.status as OrderStatus;
  if (!canTransition(order.status, nextStatus, 'vendor')) {
    throw new HttpError(409, `Cannot move order from "${order.status}" to "${nextStatus}"`);
  }

  if (nextStatus === 'rejected') {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId, 'variants.id': item.variantId }, { $inc: { 'variants.$.stock': item.quantity } });
    }
  }

  const now = new Date();
  order.status = nextStatus;
  order.statusHistory.push({ status: nextStatus, at: now, note: req.body.note });
  if (nextStatus === 'rejected') order.cancelledBy = 'vendor';
  if (nextStatus === 'delivered') order.deliveredAt = now;
  await order.save();

  res.json(toSafeJson(order));
}
