import { FastifyInstance } from 'fastify';
import { listTickets, getTicket, createTicket, replyTicket } from '../controllers/ticketsController.js';
import { requireAuth } from '../middleware/auth.js';

export default async function ticketsRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', requireAuth);
    
    fastify.get('/', listTickets);
    fastify.get('/:id', getTicket);
    fastify.post('/', createTicket);
    fastify.post('/:id/reply', replyTicket);
}
