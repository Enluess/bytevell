import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError } from '../lib/errors.js';
import { infrastructureService } from '../services/infrastructureService.js';

export const listDatacenters = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const list = await infrastructureService.listDatacenters();
        reply.send({ success: true, datacenters: list });
    } catch (error) { sendError(reply, error); }
};

export const createDatacenter = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const result = await infrastructureService.createDatacenter(adminId, (request.body as any));
        reply.status(201).send({ success: true, datacenter: result });
    } catch (error) { sendError(reply, error); }
};

export const deleteDatacenter = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        await infrastructureService.deleteDatacenter(adminId, (request.params as any).id);
        reply.send({ success: true, message: 'Datacenter deleted' });
    } catch (error) { sendError(reply, error); }
};

export const listServers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const list = await infrastructureService.listServers();
        reply.send({ success: true, servers: list });
    } catch (error) { sendError(reply, error); }
};

export const createServer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const result = await infrastructureService.createServer(adminId, (request.body as any));
        reply.status(201).send({ success: true, server: result });
    } catch (error) { sendError(reply, error); }
};

export const deleteServer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        await infrastructureService.deleteServer(adminId, (request.params as any).id);
        reply.send({ success: true, message: 'Server deleted' });
    } catch (error) { sendError(reply, error); }
};

export const listIps = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const list = await infrastructureService.listIpAddresses();
        reply.send({ success: true, ips: list });
    } catch (error) { sendError(reply, error); }
};

export const createIp = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const result = await infrastructureService.addIpAddress(adminId, (request.body as any));
        reply.status(201).send({ success: true, ip: result });
    } catch (error) { sendError(reply, error); }
};

export const deleteIp = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        await infrastructureService.deleteIpAddress(adminId, (request.params as any).id);
        reply.send({ success: true, message: 'IP deleted' });
    } catch (error) { sendError(reply, error); }
};
