import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';

const fastify = Fastify({
    logger: true,
});

const PORT = Number(process.env.PORT) || 5000;

async function start() {
    // CORS
    await fastify.register(cors);

    // Routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(servicesRoutes, { prefix: '/api/services' });
    await fastify.register(adminRoutes, { prefix: '/api/admin' });

    // Health check
    fastify.get('/api/health', async () => {
        return { status: 'ok', message: 'API is running' };
    });

    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
