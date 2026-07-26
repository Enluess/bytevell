import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, services } from '../db/schema.js';

export const getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const [usersCountResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [servicesCountResult] = await db.select({ count: sql<number>`count(*)` }).from(services);
        
        reply.send({
            stats: {
                totalUsers: Number(usersCountResult?.count || 0),
                totalServices: Number(servicesCountResult?.count || 0),
            }
        });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const allUsers = await db.query.users.findMany({
            orderBy: [desc(users.createdAt)],
            columns: {
                password: false // Exclude password from the response
            }
        });
        
        reply.send({ users: allUsers });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const updateUserRole = async (request: FastifyRequest<{ Params: { id: string }, Body: { role: string } }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const { role } = request.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return reply.status(400).send({ message: 'Invalid role' });
        }

        const [updatedUser] = await db.update(users)
            .set({ role })
            .where(eq(users.id, id))
            .returning({ id: users.id, email: users.email, role: users.role });

        if (!updatedUser) {
            return reply.status(404).send({ message: 'User not found' });
        }

        reply.send({ message: 'User role updated', user: updatedUser });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const updateUserBalance = async (request: FastifyRequest<{ Params: { id: string }, Body: { balance: string } }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const { balance } = request.body;

        const numericBalance = parseFloat(balance);
        if (isNaN(numericBalance) || numericBalance < 0) {
            return reply.status(400).send({ message: 'Invalid balance format' });
        }

        const formattedBalance = numericBalance.toFixed(2);

        const [updatedUser] = await db.update(users)
            .set({ balance: formattedBalance })
            .where(eq(users.id, id))
            .returning({ id: users.id, email: users.email, balance: users.balance });

        if (!updatedUser) {
            return reply.status(404).send({ message: 'User not found' });
        }

        reply.send({ message: 'User balance updated', user: updatedUser });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const listServices = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const allServices = await db.query.services.findMany({
            orderBy: [desc(services.createdAt)],
            with: {
                // To get user info, we might need a relation. Let's do a join if 'with' doesn't work out of the box because we didn't define relations.
                // Wait, relations are not defined in schema.ts, so 'with' will fail. 
            }
        });
        // We will do a manual join or just return services and fetch users on client, 
        // better yet, let's do a left join here to return user email.
        
        const servicesWithUsers = await db
            .select({
                id: services.id,
                type: services.type,
                name: services.name,
                status: services.status,
                ipAddress: services.ipAddress,
                price: services.price,
                createdAt: services.createdAt,
                expiresAt: services.expiresAt,
                userId: services.userId,
                userEmail: users.email,
                userName: users.name
            })
            .from(services)
            .leftJoin(users, eq(services.userId, users.id))
            .orderBy(desc(services.createdAt));

        reply.send({ services: servicesWithUsers });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const updateServiceStatus = async (request: FastifyRequest<{ Params: { id: string }, Body: { status: string } }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const { status } = request.body;

        if (!['active', 'suspended', 'cancelled'].includes(status)) {
            return reply.status(400).send({ message: 'Invalid status' });
        }

        const [updatedService] = await db.update(services)
            .set({ status })
            .where(eq(services.id, id))
            .returning();

        if (!updatedService) {
            return reply.status(404).send({ message: 'Service not found' });
        }

        reply.send({ message: 'Service status updated', service: updatedService });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};
