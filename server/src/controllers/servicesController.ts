import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { services, users } from '../db/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware-like function to get user from token
const getUserFromToken = async (request: FastifyRequest) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
};

export const purchaseService = async (request: FastifyRequest<{ Body: { type: string, name: string, price: string } }>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { type, name, price } = request.body;

        // Verify user and balance
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user) {
            return reply.status(404).send({ message: 'User not found' });
        }

        const numericPrice = parseFloat(price);
        const currentBalance = parseFloat(user.balance);

        if (isNaN(numericPrice) || numericPrice < 0) {
            return reply.status(400).send({ message: 'Invalid price format' });
        }

        if (currentBalance < numericPrice) {
            return reply.status(400).send({ message: 'Yetersiz bakiye (Insufficient balance)' });
        }

        // Deduct balance and create service
        const newBalance = (currentBalance - numericPrice).toFixed(2);
        
        await db.update(users)
            .set({ balance: newBalance })
            .where(eq(users.id, userId));

        const [service] = await db.insert(services).values({
            userId,
            type,
            name,
            price,
            ipAddress: type === 'web' ? null : `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Mock IP
        }).returning();

        reply.status(201).send({ message: 'Service purchased successfully', service, newBalance });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const listServices = async (request: FastifyRequest<{ Querystring: { type?: string } }>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { type } = request.query;

        let userServices;
        
        if (type) {
            userServices = await db.query.services.findMany({
                where: (services, { eq, and }) => and(eq(services.userId, userId), eq(services.type, type)),
                orderBy: [desc(services.createdAt)]
            });
        } else {
            userServices = await db.query.services.findMany({
                where: eq(services.userId, userId),
                orderBy: [desc(services.createdAt)]
            });
        }

        reply.send({ services: userServices });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const getService = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { id } = request.params;

        const service = await db.query.services.findFirst({
            where: (services, { eq, and }) => and(eq(services.userId, userId), eq(services.id, id))
        });

        if (!service) {
            return reply.status(404).send({ message: 'Service not found' });
        }

        reply.send({ service });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};

export const actionService = async (request: FastifyRequest<{ Params: { id: string }, Body: { action: string } }>, reply: FastifyReply) => {
    try {
        const userId = await getUserFromToken(request);
        const { id } = request.params;
        const { action } = request.body;

        const service = await db.query.services.findFirst({
            where: (services, { eq, and }) => and(eq(services.userId, userId), eq(services.id, id))
        });

        if (!service) {
            return reply.status(404).send({ message: 'Service not found' });
        }

        // Mock action success
        reply.send({ message: `Action '${action}' executed successfully on service ${service.name}` });
    } catch (error: any) {
        reply.status(error.message === 'No token provided' ? 401 : 500).send({ message: error.message || 'Server error', error });
    }
};
