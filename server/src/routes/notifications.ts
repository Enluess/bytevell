import { FastifyInstance } from 'fastify';
import { getNotifications, markAsRead } from '../controllers/notificationsController.js';

export default async function (fastify: FastifyInstance) {
    fastify.get('/', getNotifications);
    fastify.put('/:id/read', markAsRead);
}
