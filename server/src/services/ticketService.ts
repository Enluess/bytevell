import { db } from '../db/index.js';
import { tickets, ticketMessages, users } from '../db/schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';
import { events } from '../events/emitter.js';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { logAdminAction } from './auditService.js';

export const ticketService = {
    async createTicket(params: { userId: string, subject: string, message: string, priority?: string }) {
        if (!params.subject || !params.message) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Subject and message are required', 400);
        }

        const [ticket] = await db.insert(tickets).values({
            userId: params.userId,
            subject: params.subject,
            priority: params.priority || 'medium',
            status: 'open'
        }).returning();

        await db.insert(ticketMessages).values({
            ticketId: ticket.id,
            senderId: params.userId,
            senderRole: 'USER',
            message: params.message
        });

        // Emit events
        await events.emit('ticket.created', { ticketId: ticket.id, userId: params.userId, subject: params.subject });
        await events.emit('ticket.replied', { ticketId: ticket.id, userId: params.userId, senderRole: 'USER' });

        return ticket;
    },

    async replyToTicket(params: { ticketId: string, senderId: string, senderRole: string, message: string }) {
        if (!params.message) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Message is required', 400);
        }

        const ticket = await db.query.tickets.findFirst({
            where: eq(tickets.id, params.ticketId)
        });

        if (!ticket) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Ticket not found', 404);
        }

        const [msg] = await db.insert(ticketMessages).values({
            ticketId: params.ticketId,
            senderId: params.senderId,
            senderRole: params.senderRole,
            message: params.message
        }).returning();

        const newStatus = params.senderRole === 'USER' ? 'customer_reply' : 'staff_reply';

        await db.update(tickets)
            .set({ status: newStatus, updatedAt: new Date(), lastReplyAt: params.senderRole !== 'USER' ? new Date() : ticket.lastReplyAt })
            .where(eq(tickets.id, params.ticketId));

        if (params.senderRole !== 'USER') {
            await logAdminAction({ adminId: params.senderId, action: 'REPLY_TICKET', targetId: params.ticketId, targetType: 'TICKET' });
        }

        await events.emit('ticket.replied', { ticketId: params.ticketId, userId: ticket.userId, senderRole: params.senderRole });

        return msg;
    },

    async updateTicketStatus(ticketId: string, status: string, adminId: string) {
        const [updatedTicket] = await db.update(tickets)
            .set({ status })
            .where(eq(tickets.id, ticketId))
            .returning();

        if (!updatedTicket) throw new AppError(ErrorCodes.NOT_FOUND, 'Ticket not found', 404);

        await logAdminAction({ adminId, action: 'UPDATE_TICKET_STATUS', targetId: ticketId, targetType: 'TICKET', dataAfter: { status } });
        
        return updatedTicket;
    },

    async getTicketWithMessages(ticketId: string, userId?: string) {
        let whereCondition = eq(tickets.id, ticketId);
        if (userId) {
            whereCondition = and(whereCondition, eq(tickets.userId, userId)) as any;
        }

        const [ticketWithUser] = await db
            .select({
                id: tickets.id,
                subject: tickets.subject,
                status: tickets.status,
                priority: tickets.priority,
                createdAt: tickets.createdAt,
                updatedAt: tickets.updatedAt,
                userId: tickets.userId,
                userEmail: users.email,
                userName: users.name,
            })
            .from(tickets)
            .leftJoin(users, eq(tickets.userId, users.id))
            .where(whereCondition);

        if (!ticketWithUser) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Ticket not found', 404);
        }

        const messages = await db
            .select()
            .from(ticketMessages)
            .where(eq(ticketMessages.ticketId, ticketId))
            .orderBy(asc(ticketMessages.createdAt));

        return { ticket: ticketWithUser, messages };
    },

    async listUserTickets(userId: string) {
        return await db.query.tickets.findMany({
            where: eq(tickets.userId, userId),
            orderBy: [desc(tickets.updatedAt)]
        });
    },

    async listAllTickets() {
        return await db
            .select({
                id: tickets.id,
                subject: tickets.subject,
                status: tickets.status,
                priority: tickets.priority,
                createdAt: tickets.createdAt,
                updatedAt: tickets.updatedAt,
                userId: tickets.userId,
                userEmail: users.email,
                userName: users.name,
            })
            .from(tickets)
            .leftJoin(users, eq(tickets.userId, users.id))
            .orderBy(desc(tickets.updatedAt));
    }
};
