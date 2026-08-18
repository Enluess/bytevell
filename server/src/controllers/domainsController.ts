import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc, asc } from 'drizzle-orm';
import { domains, dnsRecords, domainRegistrars, domainTldPrices, domainEvents, users } from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// CUSTOMER - DOMAINS
// ============================================================================

export const getMyDomains = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const userDomains = await db.select().from(domains).where(eq(domains.userId, userId)).orderBy(desc(domains.createdAt));
  return reply.send({ domains: userDomains });
};

export const getDomainById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  const records = await db.select().from(dnsRecords).where(eq(dnsRecords.domainId, domain.id)).orderBy(asc(dnsRecords.type));
  const events = await db.select().from(domainEvents).where(eq(domainEvents.domainId, domain.id)).orderBy(desc(domainEvents.createdAt)).limit(20);

  return reply.send({ domain, dnsRecords: records, events });
};

export const toggleAutoRenew = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  const [updated] = await db.update(domains).set({ autoRenew: !domain.autoRenew }).where(eq(domains.id, domain.id)).returning();
  return reply.send({ domain: updated });
};

export const updateNameservers = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const body = (request.body as any) as any;
  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  const [updated] = await db.update(domains).set({ nameservers: body.nameservers }).where(eq(domains.id, domain.id)).returning();
  return reply.send({ domain: updated });
};

// ============================================================================
// CUSTOMER - DNS RECORDS
// ============================================================================

export const addDnsRecord = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const body = (request.body as any) as any;

  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  const [record] = await db.insert(dnsRecords).values({
    domainId: domain.id,
    type: body.type,
    name: body.name,
    content: body.content,
    ttl: body.ttl || 3600,
    priority: body.priority || null,
    proxied: body.proxied ?? false,
  }).returning();

  return reply.code(201).send({ record });
};

export const updateDnsRecord = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const body = (request.body as any) as any;

  // Verify domain ownership
  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  const updateData: any = {};
  if (body.type !== undefined) updateData.type = body.type;
  if (body.name !== undefined) updateData.name = body.name;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.ttl !== undefined) updateData.ttl = body.ttl;
  if (body.priority !== undefined) updateData.priority = body.priority;

  const [updated] = await db.update(dnsRecords).set(updateData)
    .where(and(eq(dnsRecords.id, (request.params as any).recordId), eq(dnsRecords.domainId, domain.id)))
    .returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'DNS record not found', 404);
  return reply.send({ record: updated });
};

export const deleteDnsRecord = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const userId = getUserId(request);
  const [domain] = await db.select().from(domains)
    .where(and(eq(domains.id, (request.params as any).id), eq(domains.userId, userId)))
    .limit(1);
  if (!domain) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);

  await db.delete(dnsRecords).where(and(eq(dnsRecords.id, (request.params as any).recordId), eq(dnsRecords.domainId, domain.id)));
  return reply.send({ success: true });
};

// ============================================================================
// ADMIN - DOMAINS
// ============================================================================

export const getAllDomains = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const all = await db.select({
    id: domains.id,
    domainName: domains.domainName,
    tld: domains.tld,
    status: domains.status,
    userId: domains.userId,
    userName: users.name,
    userEmail: users.email,
    expirationDate: domains.expirationDate,
    autoRenew: domains.autoRenew,
    createdAt: domains.createdAt,
  }).from(domains)
    .leftJoin(users, eq(domains.userId, users.id))
    .orderBy(desc(domains.createdAt));
  return reply.send({ domains: all });
};

export const adminUpdateDomain = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.status !== undefined) updateData.status = body.status;
  if (body.expirationDate !== undefined) updateData.expirationDate = new Date(body.expirationDate);
  if (body.nameservers !== undefined) updateData.nameservers = body.nameservers;
  if (body.autoRenew !== undefined) updateData.autoRenew = body.autoRenew;

  const [updated] = await db.update(domains).set(updateData).where(eq(domains.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Domain not found', 404);
  return reply.send({ domain: updated });
};

// ============================================================================
// ADMIN - REGISTRARS
// ============================================================================

export const getRegistrars = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const registrars = await db.select().from(domainRegistrars).orderBy(domainRegistrars.name);
  return reply.send({ registrars });
};

export const createRegistrar = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [registrar] = await db.insert(domainRegistrars).values({
    name: body.name,
    type: body.type || 'manual',
    apiUrl: body.apiUrl || null,
    credentials: body.credentials || null,
    status: 'active',
    config: body.config || null,
  }).returning();
  return reply.code(201).send({ registrar });
};

// ============================================================================
// ADMIN - TLD PRICING
// ============================================================================

export const getTldPrices = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const prices = await db.select({
    id: domainTldPrices.id,
    registrarId: domainTldPrices.registrarId,
    registrarName: domainRegistrars.name,
    tld: domainTldPrices.tld,
    registerPrice: domainTldPrices.registerPrice,
    renewPrice: domainTldPrices.renewPrice,
    transferPrice: domainTldPrices.transferPrice,
    currency: domainTldPrices.currency,
    isActive: domainTldPrices.isActive,
  }).from(domainTldPrices)
    .leftJoin(domainRegistrars, eq(domainTldPrices.registrarId, domainRegistrars.id))
    .orderBy(domainTldPrices.tld);
  return reply.send({ prices });
};

export const upsertTldPrice = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;

  if (body.id) {
    const [updated] = await db.update(domainTldPrices).set({
      registerPrice: body.registerPrice,
      renewPrice: body.renewPrice,
      transferPrice: body.transferPrice,
      currency: body.currency || 'TRY',
      isActive: body.isActive ?? true,
    }).where(eq(domainTldPrices.id, body.id)).returning();
    return reply.send({ price: updated });
  }

  const [price] = await db.insert(domainTldPrices).values({
    registrarId: body.registrarId,
    tld: body.tld,
    registerPrice: body.registerPrice,
    renewPrice: body.renewPrice,
    transferPrice: body.transferPrice,
    currency: body.currency || 'TRY',
    isActive: body.isActive ?? true,
  }).returning();
  return reply.code(201).send({ price });
};
