import cron from 'node-cron';
import { db } from '../db/index.js';
import { services, invoices, invoiceItems } from '../db/schema.js';
import { eq, and, lte, isNull, sql } from 'drizzle-orm';

export function startCronJobs() {
    console.log('[Cron] Initializing scheduled tasks...');

    // Daily at 00:00 - Generate Invoices for Services nearing expiration
    cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Running daily invoice generation...');
        try {
            // Find active services that expire in exactly 7 days
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);
            
            const expiringServices = await db.select().from(services).where(
                and(
                    eq(services.status, 'active'),
                    lte(services.nextDueDate, targetDate),
                    // In a real app we'd track if we already generated an invoice for this period
                )
            );

            for (const service of expiringServices) {
                // Determine price (normally fetched from product/pricing, using service.recurringAmount if it existed, for simplicity we use 0)
                const price = 0; // Replace with actual recurring price fetch

                if (price > 0) {
                    const [invoice] = await db.insert(invoices).values({
                        invoiceNumber: `INV-${Date.now()}-${service.id.substring(0,4)}`,
                        userId: service.userId,
                        subtotal: price.toFixed(2),
                        taxAmount: '0.00',
                        total: price.toFixed(2),
                        currency: 'TRY', // default currency
                        status: 'unpaid',
                        dueDate: service.nextDueDate || new Date(),
                        notes: `Renewal for service ${service.name}`,
                    }).returning();

                    await db.insert(invoiceItems).values({
                        invoiceId: invoice.id,
                        description: `Renewal - ${service.name}`,
                        quantity: 1,
                        unitPrice: price.toFixed(2),
                        taxRate: '0.00',
                        taxAmount: '0.00',
                        total: price.toFixed(2),
                        serviceId: service.id
                    });

                    console.log(`[Cron] Generated invoice ${invoice.invoiceNumber} for service ${service.id}`);
                }
            }
        } catch (error) {
            console.error('[Cron] Error generating invoices:', error);
        }
    });

    // Daily at 01:00 - Suspend overdue services
    cron.schedule('0 1 * * *', async () => {
        console.log('[Cron] Running overdue service suspension...');
        try {
            const today = new Date();
            const overdueServices = await db.select().from(services).where(
                and(
                    eq(services.status, 'active'),
                    lte(services.nextDueDate, today)
                )
            );

            for (const service of overdueServices) {
                // In a complete system, we would trigger an action or event to suspend the server/domain
                await db.update(services).set({ status: 'suspended' }).where(eq(services.id, service.id));
                console.log(`[Cron] Suspended overdue service ${service.id}`);
            }
        } catch (error) {
            console.error('[Cron] Error suspending services:', error);
        }
    });

    console.log('[Cron] Scheduled tasks registered.');
}
