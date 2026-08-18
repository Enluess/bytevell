import { FastifyInstance } from 'fastify';
import { register, login, me, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute'
            }
        }
    }, register);
    
    fastify.post('/login', {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, login);
    
    fastify.get('/me', { preHandler: [requireAuth] }, me);
    fastify.post('/logout', { preHandler: [requireAuth] }, logout);
}
