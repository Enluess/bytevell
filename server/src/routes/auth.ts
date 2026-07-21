import { FastifyInstance } from 'fastify';
import { register, login, me } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', {
        preHandler: async (request, reply) => {
            const result = registerSchema.safeParse(request.body);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'Validation error',
                    errors: result.error.flatten().fieldErrors,
                });
            }
            request.body = result.data;
        },
    }, register);

    fastify.post('/login', {
        preHandler: async (request, reply) => {
            const result = loginSchema.safeParse(request.body);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'Validation error',
                    errors: result.error.flatten().fieldErrors,
                });
            }
            request.body = result.data;
        },
    }, login);

    fastify.get('/me', me);
}
