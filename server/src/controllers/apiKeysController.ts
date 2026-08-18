import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { apiKeys } from '../db/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const getUserFromToken = async (request: FastifyRequest) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
};

export const getApiKeys = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);

        const keys = await db.query.apiKeys.findMany({
            where: eq(apiKeys.userId, userId),
            orderBy: [desc(apiKeys.createdAt)]
        });

        reply.send({ apiKeys: keys });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const createApiKey = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { name } = (request.body as any);

        const rawKey = crypto.randomBytes(32).toString('hex');
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        const [apiKey] = await db.insert(apiKeys).values({
            userId,
            name,
            keyHash,
        }).returning();

        reply.status(201).send({ message: 'API key created successfully', apiKey: { ...apiKey, rawKey } });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const revokeApiKey = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { id } = (request.params as any);

        const result = await db.delete(apiKeys)
            .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)))
            .returning();

        if (result.length === 0) {
            return reply.status(404).send({ message: 'API key not found' });
        }

        reply.send({ message: 'API key revoked successfully' });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};
