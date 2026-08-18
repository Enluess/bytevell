import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { coupons, couponUsages, users } from '../db/schema.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// PUBLIC - Validate Coupon
// ============================================================================

export const validateCoupon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const { code } = (request.body as any) as any;
  if (!code) throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon code is required', 400);

  const [coupon] = await db.select().from(coupons).where(and(eq(coupons.code, code), eq(coupons.isActive, true))).limit(1);
  if (!coupon) throw new AppError(ErrorCodes.NOT_FOUND, 'Invalid coupon code', 404);

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon has expired', 400);
  }
  if (coupon.startsAt && new Date() < coupon.startsAt) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon is not yet active', 400);
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Coupon usage limit reached', 400);
  }

  return reply.send({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      isRecurring: coupon.isRecurring,
    },
  });
};

// ============================================================================
// ADMIN
// ============================================================================

export const getCoupons = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const all = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return reply.send({ coupons: all });
};

export const createCoupon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;

  const [coupon] = await db.insert(coupons).values({
    code: body.code.toUpperCase(),
    description: body.description || null,
    type: body.type,
    value: body.value,
    currency: body.currency || null,
    appliesToProducts: body.appliesToProducts || null,
    appliesToGroups: body.appliesToGroups || null,
    isRecurring: body.isRecurring ?? false,
    isFirstOrderOnly: body.isFirstOrderOnly ?? false,
    usageLimit: body.usageLimit || null,
    usageLimitPerCustomer: body.usageLimitPerCustomer || 1,
    minimumOrderAmount: body.minimumOrderAmount || null,
    startsAt: body.startsAt ? new Date(body.startsAt) : null,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    isActive: body.isActive ?? true,
  }).returning();

  return reply.code(201).send({ coupon });
};

export const updateCoupon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  
  if (body.code !== undefined) updateData.code = body.code.toUpperCase();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.value !== undefined) updateData.value = body.value;
  if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
  if (body.isFirstOrderOnly !== undefined) updateData.isFirstOrderOnly = body.isFirstOrderOnly;
  if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit;
  if (body.usageLimitPerCustomer !== undefined) updateData.usageLimitPerCustomer = body.usageLimitPerCustomer;
  if (body.minimumOrderAmount !== undefined) updateData.minimumOrderAmount = body.minimumOrderAmount;
  if (body.startsAt !== undefined) updateData.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const [updated] = await db.update(coupons).set(updateData).where(eq(coupons.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Coupon not found', 404);
  return reply.send({ coupon: updated });
};

export const deleteCoupon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(couponUsages).where(eq(couponUsages.couponId, (request.params as any).id));
  await db.delete(coupons).where(eq(coupons.id, (request.params as any).id));
  return reply.send({ success: true });
};
