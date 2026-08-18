import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { currencies, taxRules, users, transactions } from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// CURRENCIES (Admin)
// ============================================================================

export const getCurrencies = async (request: FastifyRequest, reply: FastifyReply) => {
  const all = await db.select().from(currencies).orderBy(desc(currencies.isDefault));
  return reply.send({ currencies: all });
};

export const createCurrency = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [currency] = await db.insert(currencies).values({
    code: body.code.toUpperCase(),
    name: body.name,
    symbol: body.symbol,
    decimalPlaces: body.decimalPlaces || 2,
    exchangeRate: body.exchangeRate || '1.000000',
    isDefault: body.isDefault ?? false,
    isActive: body.isActive ?? true,
  }).returning();
  return reply.code(201).send({ currency });
};

export const updateCurrency = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.symbol !== undefined) updateData.symbol = body.symbol;
  if (body.decimalPlaces !== undefined) updateData.decimalPlaces = body.decimalPlaces;
  if (body.exchangeRate !== undefined) updateData.exchangeRate = body.exchangeRate;
  if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const [updated] = await db.update(currencies).set(updateData).where(eq(currencies.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Currency not found', 404);
  return reply.send({ currency: updated });
};

export const deleteCurrency = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(currencies).where(eq(currencies.id, (request.params as any).id));
  return reply.send({ success: true });
};

// ============================================================================
// TAX RULES (Admin)
// ============================================================================

export const getTaxRules = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const all = await db.select().from(taxRules).orderBy(desc(taxRules.priority));
  return reply.send({ taxRules: all });
};

export const createTaxRule = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [rule] = await db.insert(taxRules).values({
    name: body.name,
    rate: body.rate,
    country: body.country || 'TR',
    state: body.state || null,
    appliesToProductTypes: body.appliesToProductTypes || null,
    isInclusive: body.isInclusive ?? false,
    isActive: body.isActive ?? true,
    priority: body.priority || 0,
  }).returning();
  return reply.code(201).send({ taxRule: rule });
};

export const updateTaxRule = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.rate !== undefined) updateData.rate = body.rate;
  if (body.country !== undefined) updateData.country = body.country;
  if (body.state !== undefined) updateData.state = body.state;
  if (body.appliesToProductTypes !== undefined) updateData.appliesToProductTypes = body.appliesToProductTypes;
  if (body.isInclusive !== undefined) updateData.isInclusive = body.isInclusive;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.priority !== undefined) updateData.priority = body.priority;

  const [updated] = await db.update(taxRules).set(updateData).where(eq(taxRules.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Tax rule not found', 404);
  return reply.send({ taxRule: updated });
};

export const deleteTaxRule = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(taxRules).where(eq(taxRules.id, (request.params as any).id));
  return reply.send({ success: true });
};

// ============================================================================
// WALLET (Customer)
// ============================================================================

export const getBalance = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const [user] = await db.select({ balance: users.balance, currency: users.currency }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
  return reply.send({ balance: user.balance, currency: user.currency });
};

export const getTransactionHistory = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const txns = await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  return reply.send({ transactions: txns });
};

// ============================================================================
// WALLET (Admin)
// ============================================================================

export const addCredit = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { userId } = (request.params as any);
  const body = (request.body as any) as any;
  const amount = parseFloat(body.amount);
  if (isNaN(amount) || amount <= 0) throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invalid amount', 400);

  const [user] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);

  const balanceBefore = parseFloat(user.balance);
  const balanceAfter = balanceBefore + amount;

  await db.update(users).set({ balance: balanceAfter.toFixed(2) }).where(eq(users.id, userId));

  await db.insert(transactions).values({
    userId,
    type: 'credit',
    amount: amount.toFixed(2),
    currency: 'TRY',
    balanceBefore: balanceBefore.toFixed(2),
    balanceAfter: balanceAfter.toFixed(2),
    description: body.description || 'Manual credit by admin',
    adminId: getUserId(request),
  });

  return reply.send({ success: true, newBalance: balanceAfter.toFixed(2) });
};

export const deductCredit = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { userId } = (request.params as any);
  const body = (request.body as any) as any;
  const amount = parseFloat(body.amount);
  if (isNaN(amount) || amount <= 0) throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invalid amount', 400);

  const [user] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);

  const balanceBefore = parseFloat(user.balance);
  const balanceAfter = balanceBefore - amount;

  await db.update(users).set({ balance: balanceAfter.toFixed(2) }).where(eq(users.id, userId));

  await db.insert(transactions).values({
    userId,
    type: 'debit',
    amount: (-amount).toFixed(2),
    currency: 'TRY',
    balanceBefore: balanceBefore.toFixed(2),
    balanceAfter: balanceAfter.toFixed(2),
    description: body.description || 'Manual deduction by admin',
    adminId: getUserId(request),
  });

  return reply.send({ success: true, newBalance: balanceAfter.toFixed(2) });
};
