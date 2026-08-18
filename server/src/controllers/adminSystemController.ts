import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { auditLogs, systemSettings } from '../db/schema.js';
import { logAdminAction } from '../services/auditService.js';

export const listAuditLogs = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const limit = parseInt((request.query as any).limit || '50', 10);
        const page = parseInt((request.query as any).page || '1', 10);
        const offset = (page - 1) * limit;
        
        const logs = await db.select()
            .from(auditLogs)
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit)
            .offset(offset);
            
        reply.send({ auditLogs: logs, page, limit });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const getSystemSettings = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const settings = await db.select().from(systemSettings);
        reply.send({ systemSettings: settings });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const updateSystemSetting = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { key, value, category } = (request.body as any);
        const adminId = (request as any).userId;

        // Try to update, if not found, insert
        let setting;
        const [existing] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
        
        if (existing) {
            [setting] = await db.update(systemSettings)
                .set({ value, category })
                .where(eq(systemSettings.key, key))
                .returning();
        } else {
            [setting] = await db.insert(systemSettings)
                .values({ key, value, category })
                .returning();
        }

        await logAdminAction({ adminId, action: 'UPDATE_SYSTEM_SETTING', targetId: setting.id, targetType: 'SYSTEM_SETTING', metadata: { key, value, category } });
        
        reply.send({ message: 'System setting updated', systemSetting: setting });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};
