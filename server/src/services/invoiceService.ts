import { db } from '../db/index.js';
import { invoices, users, transactions } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { events } from '../events/emitter.js';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { logAdminAction } from './auditService.js';

export const invoiceService = {
    async listUserInvoices(userId: string) {
        return await db.query.invoices.findMany({
            where: eq(invoices.userId, userId),
            orderBy: [desc(invoices.createdAt)]
        });
    },

    async listAllInvoices() {
        return await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                total: invoices.total,
                paidAmount: invoices.paidAmount,
                currency: invoices.currency,
                status: invoices.status,
                dueDate: invoices.dueDate,
                createdAt: invoices.createdAt,
                userId: invoices.userId,
                userEmail: users.email,
                userName: users.name,
            })
            .from(invoices)
            .leftJoin(users, eq(invoices.userId, users.id))
            .orderBy(desc(invoices.createdAt));
    },

    async payInvoice(invoiceId: string, userId: string) {
        // Run as a database transaction
        return await db.transaction(async (tx) => {
            const invoice = await tx.query.invoices.findFirst({
                where: eq(invoices.id, invoiceId)
            });

            if (!invoice || invoice.userId !== userId) {
                throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);
            }

            if (invoice.status === 'paid') {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invoice is already paid', 400);
            }

            const user = await tx.query.users.findFirst({
                where: eq(users.id, userId)
            });

            if (!user) {
                throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
            }

            const amountToPay = parseFloat(invoice.total);
            const currentBalance = parseFloat(user.balance);

            if (currentBalance < amountToPay) {
                throw new AppError(ErrorCodes.INSUFFICIENT_BALANCE, 'Insufficient account balance', 400);
            }

            const newBalance = (currentBalance - amountToPay).toFixed(2);

            await tx.update(users)
                .set({ balance: newBalance })
                .where(eq(users.id, userId));

            await tx.insert(transactions).values({
                userId,
                type: 'payment',
                amount: (-amountToPay).toFixed(2),
                balanceBefore: currentBalance.toFixed(2),
                balanceAfter: newBalance,
                invoiceId: invoiceId,
                description: `Payment for Invoice #${invoiceId.split('-')[0].toUpperCase()}`,
            });

            const [updatedInvoice] = await tx.update(invoices)
                .set({
                    status: 'paid',
                    paidAt: new Date(),
                    paidAmount: invoice.total
                })
                .where(eq(invoices.id, invoiceId))
                .returning();

            // Emit event
            await events.emit('invoice.paid', { invoiceId: invoice.id, userId, paymentId: 'internal_balance' });

            return updatedInvoice;
        });
    },

    async updateInvoiceStatus(invoiceId: string, status: string, adminId: string) {
        const [updatedInvoice] = await db.update(invoices)
            .set({ status })
            .where(eq(invoices.id, invoiceId))
            .returning();

        if (!updatedInvoice) throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);

        await logAdminAction({ adminId, action: 'UPDATE_INVOICE_STATUS', targetId: invoiceId, targetType: 'INVOICE', dataAfter: { status } });

        if (status === 'paid') {
            await events.emit('invoice.paid', { invoiceId: invoiceId, userId: updatedInvoice.userId, paymentId: 'admin_manual' });
        }

        return updatedInvoice;
    },

    async deleteInvoice(invoiceId: string, adminId: string) {
        const [deletedInvoice] = await db.delete(invoices).where(eq(invoices.id, invoiceId)).returning();
        if (!deletedInvoice) throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);

        await logAdminAction({ adminId, action: 'DELETE_INVOICE', targetId: invoiceId, targetType: 'INVOICE' });
        return deletedInvoice;
    }
};
