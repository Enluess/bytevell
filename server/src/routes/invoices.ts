import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { listInvoices, payInvoice, getInvoicePdf, checkoutStripe, checkoutBankTransfer } from '../controllers/invoicesController.js';

export default async function invoicesRoutes(fastify: FastifyInstance) {
    fastify.get('/', { preHandler: [requireAuth] }, listInvoices as any);
    fastify.get('/:id/pdf', { preHandler: [requireAuth] }, getInvoicePdf as any);
    fastify.post('/:id/pay', { preHandler: [requireAuth] }, payInvoice as any);
    fastify.post('/:id/checkout/stripe', { preHandler: [requireAuth] }, checkoutStripe as any);
    fastify.get('/:id/checkout/bank-transfer', { preHandler: [requireAuth] }, checkoutBankTransfer as any);
}
