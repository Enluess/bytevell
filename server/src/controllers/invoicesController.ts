import { FastifyRequest, FastifyReply } from 'fastify';
import { getUserId } from '../middleware/auth.js';
import { sendError, AppError, ErrorCodes } from '../lib/errors.js';
import { invoiceService } from '../services/invoiceService.js';
import { db } from '../db/index.js';
import { invoices, invoiceItems, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateInvoicePdf, InvoiceData } from '../lib/pdf.js';

export const listInvoices = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const userInvoices = await invoiceService.listUserInvoices(userId);
        reply.send({ success: true, invoices: userInvoices });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const payInvoice = async (
    request: FastifyRequest<any>,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);
        const { method } = (request.body as any) || { method: 'balance' };
        
        if (method === 'balance') {
            const updatedInvoice = await invoiceService.payInvoice(id, userId);
            return reply.send({ success: true, message: 'Invoice paid successfully via balance', invoice: updatedInvoice });
        }

        return reply.status(400).send({ success: false, error: { message: 'Invalid payment method' } });
    } catch (error: any) {
        sendError(reply, error);
    }
};

import { stripeProvider } from '../services/payments/stripe.js';
import { bankTransferProvider } from '../services/payments/bankTransfer.js';

export const checkoutStripe = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);
        const { successUrl, cancelUrl } = (request.body as any);

        const result = await stripeProvider.createCheckoutSession(id, userId, successUrl, cancelUrl);
        return reply.send({ success: true, url: result.url });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const checkoutBankTransfer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);

        const result = await bankTransferProvider.getTransferInstructions(id, userId);
        return reply.send({ success: true, data: result });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const getInvoicePdf = async (
    request: FastifyRequest<any>,
    reply: FastifyReply
) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);

        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, id),
        });

        if (!invoice || invoice.userId !== userId) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
        }

        const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));

        const invoiceData: InvoiceData = {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            createdAt: invoice.createdAt.toISOString(),
            dueDate: invoice.dueDate.toISOString(),
            status: invoice.status,
            subtotal: parseFloat(invoice.subtotal),
            tax: parseFloat(invoice.taxAmount),
            total: parseFloat(invoice.total),
            currency: invoice.currency,
            customer: {
                name: user.name || '',
                email: user.email,
            },
            items: items.map(i => ({
                description: i.description,
                amount: parseFloat(i.total),
                taxRate: parseFloat(i.taxRate),
            })),
        };

        const pdfBuffer = await generateInvoicePdf(invoiceData);

        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
        return reply.send(pdfBuffer);
    } catch (error: any) {
        sendError(reply, error);
    }
};
