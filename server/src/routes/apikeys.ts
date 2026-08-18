import { FastifyInstance } from 'fastify';
import { getApiKeys, createApiKey, revokeApiKey } from '../controllers/apiKeysController.js';

export default async function (fastify: FastifyInstance) {
    fastify.get('/', getApiKeys);
    fastify.post('/', createApiKey);
    fastify.delete('/:id', revokeApiKey);
}
