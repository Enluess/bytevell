import { FastifyRequest, FastifyReply } from 'fastify';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes, sendError } from '../lib/errors.js';
import { serviceManager } from '../services/serviceManager.js';
import { purchaseServiceSchema, actionServiceSchema } from '../schema/services.js';

export const purchaseService = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const parsed = purchaseServiceSchema.safeParse((request.body as any));
        if (!parsed.success) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, parsed.error.errors[0].message, 400, parsed.error.errors);
        }

        const userId = getUserId(request);
        const { type, name, price } = parsed.data;

        const { service, newBalance } = await serviceManager.purchaseService(userId, type, name, price, request.ip || '');

        reply.status(201).send({ success: true, message: 'Service purchased successfully', service, newBalance });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const listServices = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = getUserId(request);
        const { type } = (request.query as any);

        const userServices = await serviceManager.listUserServices(userId, type);
        reply.send({ success: true, services: userServices });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const getService = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const userId = getUserId(request);
        const { id } = (request.params as any);

        const service = await serviceManager.getService(id, userId);
        reply.send({ success: true, service });
    } catch (error: any) {
        sendError(reply, error);
    }
};

export const actionService = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const parsed = actionServiceSchema.safeParse((request.body as any));
        if (!parsed.success) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, parsed.error.errors[0].message, 400, parsed.error.errors);
        }

        const userId = getUserId(request);
        const { id } = (request.params as any);
        const { action } = parsed.data;

        await serviceManager.actionService(id, userId, action, request.ip || '');

        reply.send({ 
            success: true, 
            message: `Service ${action} initiated successfully`,
        });
    } catch (error: any) {
        sendError(reply, error);
    }
};
