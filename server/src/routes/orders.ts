import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/ordersController.js';

export default async function ordersRoutes(fastify: FastifyInstance) {
  // Customer
  fastify.post('/', { preHandler: [requireAuth] }, ctrl.createOrder);
  fastify.get('/', { preHandler: [requireAuth] }, ctrl.getOrders);
  fastify.get('/:id', { preHandler: [requireAuth] }, ctrl.getOrderById);

  // Admin
  fastify.get('/admin/all', { preHandler: [requireAuth] }, ctrl.getAllOrders);
  fastify.get('/admin/:id', { preHandler: [requireAuth] }, ctrl.getAdminOrderById);
  fastify.put('/admin/:id/status', { preHandler: [requireAuth] }, ctrl.updateOrderStatus);
}
