import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { getStats, listUsers, updateUserRole, updateUserBalance, listServices, updateServiceStatus } from '../controllers/adminController.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware to check if user is admin
const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return reply.status(401).send({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
        if (decoded.role !== 'ADMIN') {
            return reply.status(403).send({ message: 'Forbidden: Admin access required' });
        }
        
        // We can attach userId to request if needed
        (request as any).userId = decoded.userId;
    } catch (error) {
        return reply.status(401).send({ message: 'Invalid token' });
    }
};

export default async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', requireAdmin);

    fastify.get('/stats', getStats);
    
    fastify.get('/users', listUsers);
    fastify.put('/users/:id/role', updateUserRole);
    fastify.put('/users/:id/balance', updateUserBalance);
    
    fastify.get('/services', listServices);
    fastify.put('/services/:id/status', updateServiceStatus);
}
