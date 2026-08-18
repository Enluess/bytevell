import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { datacenters, servers, ipPools, ipAddresses, serverGroups } from '../db/schema.js';
import { logAdminAction } from '../services/auditService.js';
import { sendError, Errors } from '../lib/errors.js';

// ============================================================================
// DATACENTERS
// ============================================================================

export const listDatacenters = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const all = await db.select().from(datacenters).orderBy(desc(datacenters.createdAt));
        reply.send({ success: true, datacenters: all });
    } catch (error) {
        sendError(reply, error);
    }
};

export const createDatacenter = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const { name, country, city, timezone } = (request.body as any);
        const [dc] = await db.insert(datacenters).values({ name, country, city, timezone }).returning();
        await logAdminAction({ adminId, action: 'CREATE_DATACENTER', targetId: dc.id, targetType: 'DATACENTER', dataAfter: (request.body as any) });
        reply.send({ success: true, message: 'Datacenter created', datacenter: dc });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateDatacenter = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const { name, country, city, timezone, status } = (request.body as any);
        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (country !== undefined) updateData.country = country;
        if (city !== undefined) updateData.city = city;
        if (timezone !== undefined) updateData.timezone = timezone;
        if (status !== undefined) updateData.status = status;
        
        const [dc] = await db.update(datacenters).set(updateData).where(eq(datacenters.id, id)).returning();
        if (!dc) throw Errors.notFound('Datacenter');
        await logAdminAction({ adminId, action: 'UPDATE_DATACENTER', targetId: dc.id, targetType: 'DATACENTER', dataAfter: updateData });
        reply.send({ success: true, message: 'Datacenter updated', datacenter: dc });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteDatacenter = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const [dc] = await db.delete(datacenters).where(eq(datacenters.id, id)).returning();
        if (!dc) throw Errors.notFound('Datacenter');
        await logAdminAction({ adminId, action: 'DELETE_DATACENTER', targetId: id, targetType: 'DATACENTER' });
        reply.send({ success: true, message: 'Datacenter deleted' });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// SERVERS
// ============================================================================

export const listServers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const all = await db.select().from(servers).orderBy(desc(servers.createdAt));
        reply.send({ success: true, servers: all });
    } catch (error) {
        sendError(reply, error);
    }
};

export const createServer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const { hostname, ip, port, os, cpu, ram, storage, bandwidth, datacenterId, serverGroupId, maxCapacity } = (request.body as any);
        const [srv] = await db.insert(servers).values({ hostname, ip, port, os, cpu, ram, storage, bandwidth, datacenterId, serverGroupId, maxCapacity }).returning();
        await logAdminAction({ adminId, action: 'CREATE_SERVER', targetId: srv.id, targetType: 'SERVER', dataAfter: (request.body as any) });
        reply.send({ success: true, message: 'Server created', server: srv });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateServer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const body = (request.body as any);
        const updateData: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) updateData[key] = value;
        }
        const [srv] = await db.update(servers).set(updateData).where(eq(servers.id, id)).returning();
        if (!srv) throw Errors.notFound('Server');
        await logAdminAction({ adminId, action: 'UPDATE_SERVER', targetId: srv.id, targetType: 'SERVER', dataAfter: updateData });
        reply.send({ success: true, message: 'Server updated', server: srv });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteServer = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const [srv] = await db.delete(servers).where(eq(servers.id, id)).returning();
        if (!srv) throw Errors.notFound('Server');
        await logAdminAction({ adminId, action: 'DELETE_SERVER', targetId: id, targetType: 'SERVER' });
        reply.send({ success: true, message: 'Server deleted' });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// IP POOLS
// ============================================================================

export const listIpPools = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const all = await db.select().from(ipPools);
        reply.send({ success: true, ipPools: all });
    } catch (error) {
        sendError(reply, error);
    }
};

export const createIpPool = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const { name, datacenterId, subnet, gateway, type } = (request.body as any);
        const [pool] = await db.insert(ipPools).values({ name, datacenterId, subnet, gateway, type }).returning();
        await logAdminAction({ adminId, action: 'CREATE_IP_POOL', targetId: pool.id, targetType: 'IP_POOL', dataAfter: (request.body as any) });
        reply.send({ success: true, message: 'IP Pool created', ipPool: pool });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateIpPool = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const body = (request.body as any);
        const updateData: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) updateData[key] = value;
        }
        const [pool] = await db.update(ipPools).set(updateData).where(eq(ipPools.id, id)).returning();
        if (!pool) throw Errors.notFound('IP Pool');
        await logAdminAction({ adminId, action: 'UPDATE_IP_POOL', targetId: pool.id, targetType: 'IP_POOL', dataAfter: updateData });
        reply.send({ success: true, message: 'IP Pool updated', ipPool: pool });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteIpPool = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const [pool] = await db.delete(ipPools).where(eq(ipPools.id, id)).returning();
        if (!pool) throw Errors.notFound('IP Pool');
        await logAdminAction({ adminId, action: 'DELETE_IP_POOL', targetId: id, targetType: 'IP_POOL' });
        reply.send({ success: true, message: 'IP Pool deleted' });
    } catch (error) {
        sendError(reply, error);
    }
};

// ============================================================================
// IP ADDRESSES
// ============================================================================

export const listIpAddresses = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const all = await db.select().from(ipAddresses).orderBy(desc(ipAddresses.createdAt));
        reply.send({ success: true, ipAddresses: all });
    } catch (error) {
        sendError(reply, error);
    }
};

export const createIpAddress = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const adminId = (request as any).userId;
        const { address, poolId, type, status } = (request.body as any);
        const [ip] = await db.insert(ipAddresses).values({ address, poolId, type, status }).returning();
        await logAdminAction({ adminId, action: 'CREATE_IP_ADDRESS', targetId: ip.id, targetType: 'IP_ADDRESS', dataAfter: (request.body as any) });
        reply.send({ success: true, message: 'IP Address created', ipAddress: ip });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateIpAddress = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const body = (request.body as any);
        const updateData: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) updateData[key] = value;
        }
        const [ip] = await db.update(ipAddresses).set(updateData).where(eq(ipAddresses.id, id)).returning();
        if (!ip) throw Errors.notFound('IP Address');
        await logAdminAction({ adminId, action: 'UPDATE_IP_ADDRESS', targetId: ip.id, targetType: 'IP_ADDRESS', dataAfter: updateData });
        reply.send({ success: true, message: 'IP Address updated', ipAddress: ip });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteIpAddress = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;
        const [ip] = await db.delete(ipAddresses).where(eq(ipAddresses.id, id)).returning();
        if (!ip) throw Errors.notFound('IP Address');
        await logAdminAction({ adminId, action: 'DELETE_IP_ADDRESS', targetId: id, targetType: 'IP_ADDRESS' });
        reply.send({ success: true, message: 'IP Address deleted' });
    } catch (error) {
        sendError(reply, error);
    }
};
