import Stripe from 'stripe';
import { db } from '../../db/index.js';
import { invoices } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { invoiceService } from '../invoiceService.js';
import { AppError, ErrorCodes } from '../../lib/errors.js';

// Initialize Stripe (uses dummy key if not set in env)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any });

export const stripeProvider = {
    async createCheckoutSession(invoiceId: string, userId: string, successUrl: string, cancelUrl: string) {
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, invoiceId)
        });

        if (!invoice || invoice.userId !== userId) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Invoice not found', 404);
        }

        if (invoice.status === 'paid') {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invoice already paid', 400);
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: invoice.currency.toLowerCase(),
                        product_data: {
                            name: `Invoice #${invoice.invoiceNumber}`,
                        },
                        // Amount is in cents
                        unit_amount: Math.round(parseFloat(invoice.total) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: invoiceId,
            metadata: {
                invoiceId: invoiceId,
                userId: userId,
            },
        });

        return { url: session.url };
    },

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy';
        let event;

        try {
            event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err: any) {
            console.error(`[Stripe Webhook] Error: ${err.message}`);
            throw new AppError(ErrorCodes.VALIDATION_ERROR, `Webhook Error: ${err.message}`, 400);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const invoiceId = session.metadata?.invoiceId;
            const userId = session.metadata?.userId;

            if (invoiceId && userId) {
                try {
                    console.log(`[Stripe Webhook] Processing payment for invoice ${invoiceId}`);
                    // Process payment internally (bypass the balance check since they paid externally)
                    await invoiceService.updateInvoiceStatus(invoiceId, 'paid', 'system');
                } catch (error) {
                    console.error(`[Stripe Webhook] Error paying invoice ${invoiceId}:`, error);
                }
            }
        }

        return { received: true };
    }
};
