import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import * as infrastructureController from '../controllers/infrastructureController.js';

export default async function (fastify: FastifyInstance) {
    // Apply auth and admin middleware to all routes in this plugin
    fastify.addHook('onRequest', requireAuth);
    fastify.addHook('preHandler', requireAdmin);

    // Datacenters
    fastify.get('/datacenters', infrastructureController.listDatacenters);
    fastify.post('/datacenters', infrastructureController.createDatacenter);
    fastify.delete('/datacenters/:id', infrastructureController.deleteDatacenter);

    // Servers
    fastify.get('/servers', infrastructureController.listServers);
    fastify.post('/servers', infrastructureController.createServer);
    fastify.delete('/servers/:id', infrastructureController.deleteServer);

    // IPs
    fastify.get('/ips', infrastructureController.listIps);
    fastify.post('/ips', infrastructureController.createIp);
    fastify.delete('/ips/:id', infrastructureController.deleteIp);
}
