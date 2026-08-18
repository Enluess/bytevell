import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const getUserFromToken = async (request: FastifyRequest) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
};

export const getNotifications = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);

        const userNotifications = await db.query.notifications.findMany({
            where: eq(notifications.userId, userId),
            orderBy: [desc(notifications.createdAt)]
        });

        reply.send({ notifications: userNotifications });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const markAsRead = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { id } = (request.params as any);

        const result = await db.update(notifications)
            .set({ isRead: true })
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
            .returning();

        if (result.length === 0) {
            return reply.status(404).send({ message: 'Notification not found' });
        }

        reply.send({ message: 'Notification marked as read successfully', notification: result[0] });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};
