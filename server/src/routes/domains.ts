import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/domainsController.js';

export default async function domainsRoutes(fastify: FastifyInstance) {
  // Customer - Domains
  fastify.get('/', { preHandler: [requireAuth] }, ctrl.getMyDomains);
  fastify.get('/:id', { preHandler: [requireAuth] }, ctrl.getDomainById);
  fastify.post('/:id/auto-renew', { preHandler: [requireAuth] }, ctrl.toggleAutoRenew);
  fastify.put('/:id/nameservers', { preHandler: [requireAuth] }, ctrl.updateNameservers);

  // Customer - DNS Records
  fastify.post('/:id/dns', { preHandler: [requireAuth] }, ctrl.addDnsRecord);
  fastify.put('/:id/dns/:recordId', { preHandler: [requireAuth] }, ctrl.updateDnsRecord);
  fastify.delete('/:id/dns/:recordId', { preHandler: [requireAuth] }, ctrl.deleteDnsRecord);

  // Admin
  fastify.get('/admin/all', { preHandler: [requireAuth] }, ctrl.getAllDomains);
  fastify.put('/admin/:id', { preHandler: [requireAuth] }, ctrl.adminUpdateDomain);
  fastify.get('/admin/registrars', { preHandler: [requireAuth] }, ctrl.getRegistrars);
  fastify.post('/admin/registrars', { preHandler: [requireAuth] }, ctrl.createRegistrar);
  fastify.get('/admin/tld-prices', { preHandler: [requireAuth] }, ctrl.getTldPrices);
  fastify.post('/admin/tld-prices', { preHandler: [requireAuth] }, ctrl.upsertTldPrice);
}
