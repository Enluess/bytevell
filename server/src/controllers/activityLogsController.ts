import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { activityLogs } from '../db/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const getUserFromToken = async (request: FastifyRequest) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
};

export const getActivityLogs = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);

        const logs = await db.query.activityLogs.findMany({
            where: eq(activityLogs.userId, userId),
            orderBy: [desc(activityLogs.createdAt)]
        });

        reply.send({ activityLogs: logs });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};
