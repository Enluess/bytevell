import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';

/**
 * Generates a unique requestId for tracing and attaches it to the request.
 */
export const requestIdMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const requestId = request.headers['x-request-id'] as string || crypto.randomUUID();
  (request as any).requestId = requestId;
  reply.header('x-request-id', requestId);
};

/**
 * Get the request ID from a request object.
 */
export function getRequestId(request: FastifyRequest): string {
  return (request as any).requestId || 'unknown';
}
