import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { stripeProvider } from '../services/payments/stripe.js';

export default async function webhooksRoutes(fastify: FastifyInstance) {
    // We need the raw body for Stripe signature validation.
    // Fastify handles this by using a custom content type parser or we can configure it globally.
    // For simplicity, assuming the payload is accessible as a buffer in request.rawBody if configured.
    // If not, we use request.body and cast it.
    
    fastify.post('/stripe', {
        config: {
            rawBody: true
        } as any
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const signature = request.headers['stripe-signature'] as string;
        
        if (!signature) {
            return reply.status(400).send({ error: 'Missing stripe-signature header' });
        }

        try {
            const rawBody = (request as any).rawBody || Buffer.from(JSON.stringify(request.body));
            const result = await stripeProvider.handleWebhook(signature, rawBody);
            return reply.send(result);
        } catch (error: any) {
            console.error(`[Webhook Route Error] ${error.message}`);
            return reply.status(400).send({ error: error.message });
        }
    });
}
