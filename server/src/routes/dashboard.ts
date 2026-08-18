import { FastifyInstance } from 'fastify';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

export default async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get('/stats', { preHandler: [requireAuth] }, getDashboardStats);
}
