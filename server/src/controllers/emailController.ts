import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, desc } from 'drizzle-orm';
import { emailTemplates, emailLogs } from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// EMAIL TEMPLATES (Admin)
// ============================================================================

export const getTemplates = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const templates = await db.select().from(emailTemplates).orderBy(emailTemplates.slug);
  return reply.send({ templates });
};

export const getTemplateById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, (request.params as any).id)).limit(1);
  if (!template) throw new AppError(ErrorCodes.NOT_FOUND, 'Template not found', 404);
  return reply.send({ template });
};

export const updateTemplate = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.subject !== undefined) updateData.subject = body.subject;
  if (body.bodyHtml !== undefined) updateData.bodyHtml = body.bodyHtml;
  if (body.bodyText !== undefined) updateData.bodyText = body.bodyText;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const [updated] = await db.update(emailTemplates).set(updateData).where(eq(emailTemplates.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Template not found', 404);
  return reply.send({ template: updated });
};

export const createTemplate = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [template] = await db.insert(emailTemplates).values({
    slug: body.slug,
    name: body.name,
    subject: body.subject,
    bodyHtml: body.bodyHtml,
    bodyText: body.bodyText || null,
    variables: body.variables || null,
    isActive: body.isActive ?? true,
  }).returning();
  return reply.code(201).send({ template });
};

// ============================================================================
// EMAIL LOGS
// ============================================================================

export const getMyEmailHistory = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const logs = await db.select().from(emailLogs).where(eq(emailLogs.userId, userId)).orderBy(desc(emailLogs.createdAt)).limit(100);
  return reply.send({ emails: logs });
};

export const getAllEmailLogs = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const logs = await db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt)).limit(200);
  return reply.send({ emails: logs });
};
