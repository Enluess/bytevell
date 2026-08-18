import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { services, invoices, tickets, users } from '../db/schema.js';
import { eq, sql, and, desc } from 'drizzle-orm';
import { getUserId } from '../middleware/auth.js';
import { sendError } from '../lib/errors.js';

export const getDashboardStats = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        
        // Ensure user exists and get balance
        const [user] = await db.select({ balance: users.balance, name: users.name }).from(users).where(eq(users.id, userId));

        const activeServicesResult = await db.select({ count: sql<number>`count(*)` })
            .from(services)
            .where(and(eq(services.userId, userId), eq(services.status, 'active')));
            
        const unpaidInvoicesResult = await db.select({ count: sql<number>`count(*)` })
            .from(invoices)
            .where(and(eq(invoices.userId, userId), eq(invoices.status, 'unpaid')));
            
        const openTicketsResult = await db.select({ count: sql<number>`count(*)` })
            .from(tickets)
            .where(and(eq(tickets.userId, userId), eq(tickets.status, 'open')));
        
        const recentServices = await db.query.services.findMany({
            where: eq(services.userId, userId),
            orderBy: [desc(services.createdAt)],
            limit: 5
        });

        const recentInvoices = await db.query.invoices.findMany({
            where: eq(invoices.userId, userId),
            orderBy: [desc(invoices.createdAt)],
            limit: 5
        });

        reply.send({
            success: true,
            stats: {
                activeServices: Number(activeServicesResult[0].count),
                unpaidInvoices: Number(unpaidInvoicesResult[0].count),
                openTickets: Number(openTicketsResult[0].count),
                balance: user?.balance || '0.00'
            },
            recentServices,
            recentInvoices
        });
    } catch (error) {
        sendError(reply, error);
    }
};
