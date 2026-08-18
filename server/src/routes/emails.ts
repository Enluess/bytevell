import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/emailController.js';

export default async function emailRoutes(fastify: FastifyInstance) {
  // Customer - Email History
  fastify.get('/history', { preHandler: [requireAuth] }, ctrl.getMyEmailHistory);

  // Admin - Email Templates
  fastify.get('/templates', { preHandler: [requireAuth] }, ctrl.getTemplates);
  fastify.get('/templates/:id', { preHandler: [requireAuth] }, ctrl.getTemplateById);
  fastify.put('/templates/:id', { preHandler: [requireAuth] }, ctrl.updateTemplate);
  fastify.post('/templates', { preHandler: [requireAuth] }, ctrl.createTemplate);

  // Admin - All Email Logs
  fastify.get('/logs', { preHandler: [requireAuth] }, ctrl.getAllEmailLogs);
}
