import { FastifyRequest, FastifyReply } from 'fastify';
import { getUserId } from '../middleware/auth.js';
import { sendError } from '../lib/errors.js';
import { ticketService } from '../services/ticketService.js';

export const listTickets = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const userTickets = await ticketService.listUserTickets(userId);
        reply.send({ success: true, tickets: userTickets });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const getTicket = async (
    request: FastifyRequest<any>,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);
        
        const { ticket, messages } = await ticketService.getTicketWithMessages(id, userId);
        reply.send({ success: true, ticket, messages });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const createTicket = async (
    request: FastifyRequest<any>,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const { subject, message, priority } = (request.body as any);
        
        const ticket = await ticketService.createTicket({ userId, subject, message, priority });
        reply.status(201).send({ success: true, message: 'Ticket created', ticket });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const replyTicket = async (
    request: FastifyRequest<any>,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);
        const { message } = (request.body as any);
        
        const msg = await ticketService.replyToTicket({
            ticketId: id,
            senderId: userId,
            senderRole: 'USER',
            message
        });

        reply.send({ success: true, message: 'Replied successfully', reply: msg });
    } catch (error: any) {
        sendError(reply, error);
    }
};
