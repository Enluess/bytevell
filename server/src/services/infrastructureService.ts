import { db } from '../db/index.js';
import { datacenters, servers, ipPools, ipAddresses, datacenters as datacentersTable } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { logAdminAction } from './auditService.js';

export const infrastructureService = {
    // ============================================================================
    // DATACENTERS
    // ============================================================================
    async listDatacenters() {
        return await db.query.datacenters.findMany({
            orderBy: [desc(datacenters.createdAt)]
        });
    },

    async createDatacenter(adminId: string, payload: { name: string, country?: string, city?: string, timezone?: string }) {
        const [datacenter] = await db.insert(datacenters).values(payload).returning();
        await logAdminAction({ adminId, action: 'CREATE_DATACENTER', targetId: datacenter.id, targetType: 'DATACENTER', metadata: payload });
        return datacenter;
    },

    async updateDatacenter(adminId: string, id: string, payload: { name?: string, country?: string, city?: string, status?: string }) {
        const [updated] = await db.update(datacenters).set(payload).where(eq(datacenters.id, id)).returning();
        if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Datacenter not found', 404);
        await logAdminAction({ adminId, action: 'UPDATE_DATACENTER', targetId: id, targetType: 'DATACENTER', dataAfter: payload });
        return updated;
    },

    async deleteDatacenter(adminId: string, id: string) {
        // Prevent deleting if servers exist
        const serversCount = await db.query.servers.findFirst({ where: eq(servers.datacenterId, id) });
        if (serversCount) throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Cannot delete datacenter containing servers', 400);

        const [deleted] = await db.delete(datacenters).where(eq(datacenters.id, id)).returning();
        if (!deleted) throw new AppError(ErrorCodes.NOT_FOUND, 'Datacenter not found', 404);
        await logAdminAction({ adminId, action: 'DELETE_DATACENTER', targetId: id, targetType: 'DATACENTER' });
        return deleted;
    },

    // ============================================================================
    // SERVERS (NODES)
    // ============================================================================
    async listServers() {
        return await db
            .select({
                id: servers.id,
                hostname: servers.hostname,
                ip: servers.ip,
                status: servers.status,
                currentLoad: servers.currentLoad,
                maxCapacity: servers.maxCapacity,
                os: servers.os,
                datacenterName: datacenters.name,
                datacenterId: datacenters.id,
                createdAt: servers.createdAt
            })
            .from(servers)
            .leftJoin(datacenters, eq(servers.datacenterId, datacenters.id))
            .orderBy(desc(servers.createdAt));
    },

    async createServer(adminId: string, payload: { hostname: string, ip: string, datacenterId: string, maxCapacity?: number, os?: string }) {
        const [server] = await db.insert(servers).values(payload).returning();
        await logAdminAction({ adminId, action: 'CREATE_SERVER', targetId: server.id, targetType: 'SERVER', metadata: payload });
        return server;
    },

    async updateServer(adminId: string, id: string, payload: Partial<typeof servers.$inferInsert>) {
        const [updated] = await db.update(servers).set(payload).where(eq(servers.id, id)).returning();
        if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Server not found', 404);
        await logAdminAction({ adminId, action: 'UPDATE_SERVER', targetId: id, targetType: 'SERVER', dataAfter: payload });
        return updated;
    },

    async deleteServer(adminId: string, id: string) {
        const [deleted] = await db.delete(servers).where(eq(servers.id, id)).returning();
        if (!deleted) throw new AppError(ErrorCodes.NOT_FOUND, 'Server not found', 404);
        await logAdminAction({ adminId, action: 'DELETE_SERVER', targetId: id, targetType: 'SERVER' });
        return deleted;
    },

    // ============================================================================
    // IP ADDRESSES
    // ============================================================================
    async listIpAddresses() {
        return await db.query.ipAddresses.findMany({
            orderBy: [desc(ipAddresses.createdAt)]
        });
    },

    async addIpAddress(adminId: string, payload: { address: string, type?: string, poolId?: string, serverId?: string }) {
        const [ip] = await db.insert(ipAddresses).values({
            address: payload.address,
            type: payload.type || 'ipv4',
            poolId: payload.poolId,
            serverId: payload.serverId,
            status: 'available'
        }).returning();
        await logAdminAction({ adminId, action: 'ADD_IP', targetId: ip.id, targetType: 'IP', metadata: payload });
        return ip;
    },
    
    async deleteIpAddress(adminId: string, id: string) {
        const [deleted] = await db.delete(ipAddresses).where(eq(ipAddresses.id, id)).returning();
        if (!deleted) throw new AppError(ErrorCodes.NOT_FOUND, 'IP not found', 404);
        await logAdminAction({ adminId, action: 'DELETE_IP', targetId: id, targetType: 'IP' });
        return deleted;
    }
};
