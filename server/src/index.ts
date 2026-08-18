import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';
import invoicesRoutes from './routes/invoices.js';
import ticketsRoutes from './routes/tickets.js';
import dashboardRoutes from './routes/dashboard.js';
import activityRoutes from './routes/activity.js';
import apiKeysRoutes from './routes/apikeys.js';
import notificationsRoutes from './routes/notifications.js';
import infrastructureRoutes from './routes/infrastructure.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import couponsRoutes from './routes/coupons.js';
import financeRoutes from './routes/finance.js';
import kbRoutes from './routes/kb.js';
import announcementsRoutes from './routes/announcements.js';
import domainsRoutes from './routes/domains.js';
import emailRoutes from './routes/emails.js';
import { registerNotificationHandlers } from './events/handlers/notificationHandlers.js';
import { jobWorker } from './jobs/worker.js';

import rateLimit from '@fastify/rate-limit';

const fastify = Fastify({
    logger: false,
});

const PORT = Number(process.env.PORT) || 5000;

async function start() {
    // Register global event handlers
    registerNotificationHandlers();
    jobWorker.start();
    
    // Start Cron Jobs
    const { startCronJobs } = await import('./jobs/cron.js');
    startCronJobs();

    // Rate Limiting
    await fastify.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute'
    });

    // CORS
    await fastify.register(cors, {
        origin: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    // Routes - Auth & Core
    await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
    await fastify.register(servicesRoutes, { prefix: '/api/v1/services' });
    await fastify.register(adminRoutes, { prefix: '/api/v1/admin' });
    await fastify.register(invoicesRoutes, { prefix: '/api/v1/invoices' });
    await fastify.register(ticketsRoutes, { prefix: '/api/v1/tickets' });
    await fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
    await fastify.register(activityRoutes, { prefix: '/api/v1/activity' });
    await fastify.register(apiKeysRoutes, { prefix: '/api/v1/apikeys' });
    await fastify.register(notificationsRoutes, { prefix: '/api/v1/notifications' });
    await fastify.register(infrastructureRoutes, { prefix: '/api/v1/admin/infrastructure' });

    // Routes - FOSSBilling Parity
    await fastify.register(productsRoutes, { prefix: '/api/v1/products' });
    await fastify.register(ordersRoutes, { prefix: '/api/v1/orders' });
    await fastify.register(couponsRoutes, { prefix: '/api/v1/coupons' });
    await fastify.register(financeRoutes, { prefix: '/api/v1/finance' });
    await fastify.register(kbRoutes, { prefix: '/api/v1/kb' });
    await fastify.register(announcementsRoutes, { prefix: '/api/v1/announcements' });
    await fastify.register(domainsRoutes, { prefix: '/api/v1/domains' });
    await fastify.register(emailRoutes, { prefix: '/api/v1/emails' });

    // Webhooks
    const webhooksRoutes = (await import('./routes/webhooks.js')).default;
    await fastify.register(webhooksRoutes, { prefix: '/api/v1/webhooks' });

    // Health check
    fastify.get('/api/v1/health', async () => {
        return { status: 'ok', message: 'API is running' };
    });

    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening on port ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Graceful Shutdown
const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    
    // Stop accepting new jobs
    jobWorker.stop();
    console.log('[Shutdown] Job worker stopped.');

    // Close fastify (stops accepting new requests, finishes ongoing ones)
    try {
        await fastify.close();
        console.log('[Shutdown] Fastify server closed.');
    } catch (err) {
        console.error('[Shutdown] Error closing Fastify:', err);
    }

    // Close DB pool
    try {
        const { client } = await import('./db/index.js');
        await client.end();
        console.log('[Shutdown] Database connection closed.');
    } catch (err) {
        console.error('[Shutdown] Error closing Database:', err);
    }

    console.log('[Shutdown] Complete. Exiting process.');
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
