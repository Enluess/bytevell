import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, sql, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, services, tickets, ticketMessages, invoices } from '../db/schema.js';
import { logAdminAction } from '../services/auditService.js';
import { sendError, Errors } from '../lib/errors.js';
import { ticketService } from '../services/ticketService.js';
import { invoiceService } from '../services/invoiceService.js';
import { serviceManager } from '../services/serviceManager.js';

// ============================================================================
// STATS
// ============================================================================

export const getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [servicesCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
        const [ticketsCount] = await db.select({ count: sql<number>`count(*)` }).from(tickets).where(eq(tickets.status, 'open'));
        const [invoicesCount] = await db.select({ count: sql<number>`count(*)` }).from(invoices).where(eq(invoices.status, 'unpaid'));

        reply.send({
            success: true,
            stats: {
                totalUsers: Number(usersCount?.count || 0),
                totalServices: Number(servicesCount?.count || 0),
                pendingTickets: Number(ticketsCount?.count || 0),
                unpaidInvoices: Number(invoicesCount?.count || 0),
            }
        });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// USERS
// ============================================================================

export const listUsers = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const page = parseInt((request.query as any).page || '1', 10);
        const limit = parseInt((request.query as any).limit || '50', 10);
        const offset = (page - 1) * limit;

        const allUsers = await db.query.users.findMany({
            orderBy: [desc(users.createdAt)],
            columns: { password: false },
            limit,
            offset,
        });
        
        const [{ count }] = await db.select({ count: sql<number>`cast(count(${users.id}) as integer)` }).from(users);

        reply.send({ 
            success: true, 
            users: allUsers,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        sendError(reply, error);
    }
};

export const getUserDetails = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: { password: false },
        });

        if (!user) throw Errors.notFound('User');

        const userServices = await db.query.services.findMany({
            where: eq(services.userId, id),
            orderBy: [desc(services.createdAt)],
        });
        const userTickets = await db.query.tickets.findMany({
            where: eq(tickets.userId, id),
            orderBy: [desc(tickets.updatedAt)],
        });
        const userInvoices = await db.query.invoices.findMany({
            where: eq(invoices.userId, id),
            orderBy: [desc(invoices.createdAt)],
        });

        reply.send({ success: true, user, services: userServices, tickets: userTickets, invoices: userInvoices });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateUserRole = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { role } = (request.body as any);
        const adminId = (request as any).userId;

        if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
            throw Errors.validation('Invalid role');
        }

        const [updatedUser] = await db.update(users)
            .set({ role })
            .where(eq(users.id, id))
            .returning({ id: users.id, email: users.email, role: users.role });

        if (!updatedUser) throw Errors.notFound('User');

        await logAdminAction({ adminId, action: 'UPDATE_USER_ROLE', targetId: id, targetType: 'USER', dataAfter: { role } });

        reply.send({ success: true, message: 'User role updated', user: updatedUser });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateUserBalance = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { balance } = (request.body as any);
        const adminId = (request as any).userId;

        const numericBalance = parseFloat(balance);
        if (isNaN(numericBalance) || numericBalance < 0) {
            throw Errors.validation('Invalid balance format');
        }

        const formattedBalance = numericBalance.toFixed(2);

        const [updatedUser] = await db.update(users)
            .set({ balance: formattedBalance })
            .where(eq(users.id, id))
            .returning({ id: users.id, email: users.email, balance: users.balance });

        if (!updatedUser) throw Errors.notFound('User');

        await logAdminAction({ adminId, action: 'UPDATE_USER_BALANCE', targetId: id, targetType: 'USER', dataAfter: { balance: formattedBalance } });

        reply.send({ success: true, message: 'User balance updated', user: updatedUser });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateUserProfile = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { name, email, tc, phone } = (request.body as any);
        const adminId = (request as any).userId;

        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (tc !== undefined) updateData.taxId = tc;
        if (phone !== undefined) updateData.phone = phone;

        if (Object.keys(updateData).length === 0) {
            throw Errors.validation('No fields provided for update');
        }

        const [updatedUser] = await db.update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning({ id: users.id, email: users.email, name: users.name, taxId: users.taxId });

        if (!updatedUser) throw Errors.notFound('User');

        await logAdminAction({ adminId, action: 'UPDATE_USER_PROFILE', targetId: id, targetType: 'USER', dataAfter: updateData });

        reply.send({ success: true, message: 'User profile updated', user: updatedUser });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// SERVICES
// ============================================================================

export const listServices = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const page = parseInt((request.query as any).page || '1', 10);
        const limit = parseInt((request.query as any).limit || '50', 10);
        
        const servicesData = await serviceManager.listAllServices(page, limit);
        reply.send({ 
            success: true, 
            services: servicesData.data,
            pagination: servicesData.pagination
        });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateServiceStatus = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { status } = (request.body as any);
        const adminId = (request as any).userId;

        const updatedService = await serviceManager.updateServiceStatus(id, status, adminId);
        reply.send({ success: true, message: 'Service status updated', service: updatedService });
    } catch (error) {
        sendError(reply, error);
    }
};

export const assignManualService = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { type, name, price, expiresAt } = (request.body as any);
        const adminId = (request as any).userId;

        const newService = await serviceManager.assignManualService(id, type, name, price, expiresAt, adminId);
        reply.send({ success: true, message: 'Service assigned successfully', service: newService });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteServiceAdmin = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;

        await serviceManager.deleteService(id, adminId);
        reply.send({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// TICKETS
// ============================================================================

export const listAllTickets = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const ticketsWithUsers = await ticketService.listAllTickets();
        reply.send({ success: true, tickets: ticketsWithUsers });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateTicketStatus = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { status } = (request.body as any);
        const adminId = (request as any).userId;

        const updatedTicket = await ticketService.updateTicketStatus(id, status, adminId);
        reply.send({ success: true, message: 'Ticket status updated', ticket: updatedTicket });
    } catch (error) {
        sendError(reply, error);
    }
};

export const getAdminTicket = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { ticket, messages } = await ticketService.getTicketWithMessages(id);
        reply.send({ success: true, ticket, ticketMessages: messages });
    } catch (error) {
        sendError(reply, error);
    }
};

export const replyAdminTicket = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { message } = (request.body as any);
        const adminId = (request as any).userId;

        const newMessage = await ticketService.replyToTicket({
            ticketId: id,
            senderId: adminId,
            senderRole: 'staff',
            message
        });

        reply.send({ success: true, message: 'Reply added successfully', ticketMessage: newMessage });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// INVOICES
// ============================================================================

export const listAllInvoices = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const invoicesWithUsers = await invoiceService.listAllInvoices();
        reply.send({ success: true, invoices: invoicesWithUsers });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateInvoiceStatusAdmin = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const { status } = (request.body as any);
        const adminId = (request as any).userId;

        const updatedInvoice = await invoiceService.updateInvoiceStatus(id, status, adminId);
        reply.send({ success: true, message: 'Invoice status updated', invoice: updatedInvoice });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteInvoiceAdmin = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;

        await invoiceService.deleteInvoice(id, adminId);
        reply.send({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        sendError(reply, error);
    }
};
