import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/couponsController.js';

export default async function couponsRoutes(fastify: FastifyInstance) {
  // Public
  fastify.post('/validate', { preHandler: [requireAuth] }, ctrl.validateCoupon);

  // Admin
  fastify.get('/', { preHandler: [requireAuth] }, ctrl.getCoupons);
  fastify.post('/', { preHandler: [requireAuth] }, ctrl.createCoupon);
  fastify.put('/:id', { preHandler: [requireAuth] }, ctrl.updateCoupon);
  fastify.delete('/:id', { preHandler: [requireAuth] }, ctrl.deleteCoupon);
}
