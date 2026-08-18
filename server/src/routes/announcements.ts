import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/announcementsController.js';

export default async function announcementsRoutes(fastify: FastifyInstance) {
  // Public
  fastify.get('/', ctrl.getAnnouncements);
  fastify.get('/:id', ctrl.getAnnouncementById);

  // Admin
  fastify.get('/admin/all', { preHandler: [requireAuth] }, ctrl.adminGetAnnouncements);
  fastify.post('/', { preHandler: [requireAuth] }, ctrl.createAnnouncement);
  fastify.put('/:id', { preHandler: [requireAuth] }, ctrl.updateAnnouncement);
  fastify.delete('/:id', { preHandler: [requireAuth] }, ctrl.deleteAnnouncement);
}
