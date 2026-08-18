import { db } from '../../db/index.js';
import { invoices } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { AppError, ErrorCodes } from '../../lib/errors.js';

export const bankTransferProvider = {
    async getTransferInstructions(invoiceId: string, userId: string) {
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, invoiceId)
        });

        if (!invoice || invoice.userId !== userId) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);
        }

        if (invoice.status === 'paid') {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invoice already paid', 400);
        }

        return {
            instructions: 'Please transfer the exact amount to the following bank account. Include your Invoice Number in the transfer description.',
            bankDetails: {
                bankName: 'Global Cloud Bank',
                accountName: 'Bytevell Inc.',
                iban: 'TR12 3456 7890 1234 5678 90',
                swift: 'GLCLTRIS',
            },
            reference: invoice.invoiceNumber,
            amountToPay: `${invoice.currency} ${invoice.total}`
        };
    }
};
