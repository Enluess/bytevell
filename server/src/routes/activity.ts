import { FastifyInstance } from 'fastify';
import { getActivityLogs } from '../controllers/activityLogsController.js';

export default async function (fastify: FastifyInstance) {
    fastify.get('/', getActivityLogs);
}
