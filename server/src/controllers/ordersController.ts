import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  orders, orderItems, orderItemOptions, products, productPrices,
  invoices, invoiceItems, services, users, coupons, couponUsages,
  taxRules
} from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { randomBytes } from 'crypto';

// ============================================================================
// HELPERS
// ============================================================================

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString('hex').toUpperCase();
  return `BV-${ts}-${rand}`;
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = randomBytes(4).toString('hex').toUpperCase();
  return `INV-${year}-${rand}`;
}

// ============================================================================
// CUSTOMER
// ============================================================================

export const createOrder = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const body = (request.body as any) as any;
  // body: { items: [{ productId, billingCycle, quantity?, options?: [{ optionId, valueId }] }], couponCode? }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Order must have at least one item', 400);
  }

  let subtotal = 0;
  let totalSetup = 0;
  let totalTax = 0;
  let discountAmount = 0;
  const orderItemsData: any[] = [];

  for (const item of body.items) {
    const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
    if (!product) throw new AppError(ErrorCodes.NOT_FOUND, `Product ${item.productId} not found`, 404);
    if (product.status !== 'active') throw new AppError(ErrorCodes.VALIDATION_ERROR, `Product ${product.name} is not available`, 400);

    // Check stock
    if (product.stockControl && product.stockQuantity !== null && product.stockQuantity <= 0) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, `Product ${product.name} is out of stock`, 400);
    }

    // Get price for billing cycle
    const [price] = await db.select().from(productPrices)
      .where(and(
        eq(productPrices.productId, item.productId),
        eq(productPrices.billingCycle, item.billingCycle),
        eq(productPrices.isActive, true)
      )).limit(1);

    if (!price) throw new AppError(ErrorCodes.NOT_FOUND, `No pricing found for ${product.name} with cycle ${item.billingCycle}`, 404);

    const qty = item.quantity || 1;
    const itemRecurring = parseFloat(price.recurringPrice) * qty;
    const itemSetup = parseFloat(price.setupFee) * qty;
    
    subtotal += itemRecurring;
    totalSetup += itemSetup;

    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      billingCycle: item.billingCycle,
      setupFee: price.setupFee,
      recurringPrice: price.recurringPrice,
      quantity: qty,
      options: item.options || [],
    });
  }

  // Apply tax
  const activeTaxRules = await db.select().from(taxRules).where(eq(taxRules.isActive, true));
  for (const rule of activeTaxRules) {
    const rate = parseFloat(rule.rate);
    if (rule.isInclusive) {
      // Tax already included in price
    } else {
      totalTax += (subtotal * rate) / 100;
    }
  }

  // Apply coupon
  let couponId: string | null = null;
  if (body.couponCode) {
    const [coupon] = await db.select().from(coupons)
      .where(and(eq(coupons.code, body.couponCode), eq(coupons.isActive, true)))
      .limit(1);

    if (coupon) {
      // Check expiry
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon has expired', 400);
      }
      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon usage limit reached', 400);
      }

      if (coupon.type === 'percentage') {
        discountAmount = (subtotal * parseFloat(coupon.value)) / 100;
      } else {
        discountAmount = parseFloat(coupon.value);
      }
      couponId = coupon.id;
    }
  }

  const total = subtotal + totalSetup + totalTax - discountAmount;

  // Create order
  const [order] = await db.insert(orders).values({
    orderNumber: generateOrderNumber(),
    userId,
    subtotal: subtotal.toFixed(2),
    taxAmount: totalTax.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    total: total.toFixed(2),
    currency: 'TRY',
    couponId,
    status: 'pending_payment',
    ipAddress: request.ip,
  }).returning();

  // Create order items
  for (const item of orderItemsData) {
    const [orderItem] = await db.insert(orderItems).values({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      billingCycle: item.billingCycle,
      setupFee: item.setupFee,
      recurringPrice: item.recurringPrice,
      quantity: item.quantity,
    }).returning();

    // Create order item options
    for (const opt of item.options) {
      await db.insert(orderItemOptions).values({
        orderItemId: orderItem.id,
        optionId: opt.optionId,
        optionValueId: opt.valueId,
        optionName: opt.optionName || 'Option',
        valueName: opt.valueName || 'Value',
        priceModifier: opt.priceModifier || '0.00',
      });
    }
  }

  // Create invoice
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const [invoice] = await db.insert(invoices).values({
    invoiceNumber: generateInvoiceNumber(),
    userId,
    orderId: order.id,
    subtotal: subtotal.toFixed(2),
    taxAmount: totalTax.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    total: total.toFixed(2),
    currency: 'TRY',
    status: 'unpaid',
    dueDate,
    type: 'standard',
  }).returning();

  // Create invoice items
  for (const item of orderItemsData) {
    const lineTotal = (parseFloat(item.recurringPrice) + parseFloat(item.setupFee)) * item.quantity;
    await db.insert(invoiceItems).values({
      invoiceId: invoice.id,
      description: `${item.productName} (${item.billingCycle})${parseFloat(item.setupFee) > 0 ? ' + kurulum' : ''}`,
      quantity: item.quantity,
      unitPrice: (parseFloat(item.recurringPrice) + parseFloat(item.setupFee)).toFixed(2),
      taxRate: activeTaxRules.length > 0 ? activeTaxRules[0].rate : '0.00',
      taxAmount: ((lineTotal * (activeTaxRules.length > 0 ? parseFloat(activeTaxRules[0].rate) : 0)) / 100).toFixed(2),
      total: lineTotal.toFixed(2),
      productId: item.productId,
    });
  }

  // Update order with invoice
  await db.update(orders).set({ invoiceId: invoice.id }).where(eq(orders.id, order.id));

  // Update coupon usage
  if (couponId) {
    await db.update(coupons).set({ usageCount: sql`${coupons.usageCount} + 1` }).where(eq(coupons.id, couponId));
    await db.insert(couponUsages).values({
      couponId,
      userId,
      orderId: order.id,
      discountAmount: discountAmount.toFixed(2),
      currency: 'TRY',
    });
  }

  return reply.code(201).send({ order, invoice });
};

export const getOrders = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  return reply.send({ orders: userOrders });
};

export const getOrderById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, (request.params as any).id), eq(orders.userId, userId))).limit(1);
  if (!order) throw new AppError(ErrorCodes.NOT_FOUND, 'Order not found', 404);

  const items = await db.select({
    id: orderItems.id,
    productId: orderItems.productId,
    productName: orderItems.productName,
    billingCycle: orderItems.billingCycle,
    setupFee: orderItems.setupFee,
    recurringPrice: orderItems.recurringPrice,
    quantity: orderItems.quantity,
    serviceId: orderItems.serviceId,
  }).from(orderItems).where(eq(orderItems.orderId, order.id));

  return reply.send({ order, items });
};

// ============================================================================
// ADMIN
// ============================================================================

export const getAllOrders = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  
  const allOrders = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    userName: users.name,
    userEmail: users.email,
    subtotal: orders.subtotal,
    taxAmount: orders.taxAmount,
    discountAmount: orders.discountAmount,
    total: orders.total,
    currency: orders.currency,
    status: orders.status,
    fraudStatus: orders.fraudStatus,
    createdAt: orders.createdAt,
  })
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .orderBy(desc(orders.createdAt));

  return reply.send({ orders: allOrders });
};

export const getAdminOrderById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  
  const [order] = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    userName: users.name,
    userEmail: users.email,
    subtotal: orders.subtotal,
    taxAmount: orders.taxAmount,
    discountAmount: orders.discountAmount,
    total: orders.total,
    currency: orders.currency,
    status: orders.status,
    fraudStatus: orders.fraudStatus,
    fraudNotes: orders.fraudNotes,
    adminNotes: orders.adminNotes,
    invoiceId: orders.invoiceId,
    ipAddress: orders.ipAddress,
    createdAt: orders.createdAt,
  })
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .where(eq(orders.id, (request.params as any).id))
  .limit(1);

  if (!order) throw new AppError(ErrorCodes.NOT_FOUND, 'Order not found', 404);

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return reply.send({ order, items });
};

export const updateOrderStatus = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.status) updateData.status = body.status;
  if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;
  if (body.fraudStatus !== undefined) updateData.fraudStatus = body.fraudStatus;
  if (body.fraudNotes !== undefined) updateData.fraudNotes = body.fraudNotes;

  const [updated] = await db.update(orders).set(updateData).where(eq(orders.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Order not found', 404);
  return reply.send({ order: updated });
};
