import { FastifyInstance } from 'fastify';
import { purchaseService, listServices, getService, actionService } from '../controllers/servicesController.js';

export default async function servicesRoutes(fastify: FastifyInstance) {
    fastify.post('/purchase', purchaseService);
    fastify.get('/', listServices);
    fastify.get('/:id', getService);
    fastify.post('/:id/action', actionService);
}
