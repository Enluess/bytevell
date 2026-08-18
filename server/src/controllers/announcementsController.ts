import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { announcements } from '../db/schema.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// PUBLIC
export const getAnnouncements = async (request: FastifyRequest, reply: FastifyReply) => {
  const list = await db.select().from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.isPinned), desc(announcements.publishedAt));
  return reply.send({ announcements: list });
};

export const getAnnouncementById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const [item] = await db.select().from(announcements)
    .where(and(eq(announcements.id, (request.params as any).id), eq(announcements.isPublished, true)))
    .limit(1);
  if (!item) throw new AppError(ErrorCodes.NOT_FOUND, 'Announcement not found', 404);
  return reply.send({ announcement: item });
};

// ADMIN
export const adminGetAnnouncements = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const list = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  return reply.send({ announcements: list });
};

export const createAnnouncement = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [item] = await db.insert(announcements).values({
    title: body.title,
    content: body.content,
    type: body.type || 'info',
    isPublished: body.isPublished ?? false,
    isPinned: body.isPinned ?? false,
    publishedAt: body.isPublished ? new Date() : null,
  }).returning();
  return reply.code(201).send({ announcement: item });
};

export const updateAnnouncement = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;
  if (body.isPublished !== undefined) {
    updateData.isPublished = body.isPublished;
    if (body.isPublished) updateData.publishedAt = new Date();
  }

  const [updated] = await db.update(announcements).set(updateData).where(eq(announcements.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Announcement not found', 404);
  return reply.send({ announcement: updated });
};

export const deleteAnnouncement = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(announcements).where(eq(announcements.id, (request.params as any).id));
  return reply.send({ success: true });
};
