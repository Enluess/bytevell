import { db } from '../db/index.js';
import { services, users, activityLogs, provisioningJobs, transactions } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';
import { events } from '../events/emitter.js';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { logAdminAction } from './auditService.js';
import { provisioningEngine } from './provisioning/ProvisioningEngine.js';
import { Decimal } from 'decimal.js';

export const serviceManager = {
    async purchaseService(userId: string, type: string, name: string, price: string, ip: string) {
        return await db.transaction(async (tx) => {
            // Lock the user row for update to prevent concurrent race conditions
            const [user] = await tx.execute(
                sql`SELECT id, balance, "role" FROM ${users} WHERE id = ${userId} FOR UPDATE`
            );

            if (!user) {
                throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
            }

            const numericPrice = new Decimal(price);
            const currentBalance = new Decimal(user.balance as string);

            if (numericPrice.isNaN() || numericPrice.isNegative()) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invalid price format', 400);
            }

            if (currentBalance.lessThan(numericPrice)) {
                throw new AppError(ErrorCodes.INSUFFICIENT_BALANCE, 'Yetersiz bakiye (Insufficient balance)', 400);
            }

            const newBalance = currentBalance.minus(numericPrice).toFixed(2);
            
            await tx.update(users)
                .set({ balance: newBalance })
                .where(eq(users.id, userId));

            const [service] = await tx.insert(services).values({
                userId,
                type,
                name,
                price: numericPrice.toFixed(2),
                ipAddress: type === 'web' ? null : `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Mock IP
                status: 'provisioning'
            }).returning();

            // Create ledger entry
            await tx.insert(transactions).values({
                userId,
                type: 'payment',
                amount: numericPrice.negated().toFixed(2),
                currency: 'TRY', // Default for now
                balanceBefore: currentBalance.toFixed(2),
                balanceAfter: newBalance,
                description: `Service Purchase: ${name}`,
            });

            // Emit event
            await events.emit('service.created', { serviceId: service.id, userId });

            // Create a provisioning job
            await tx.insert(provisioningJobs).values({
                type: 'create_service',
                serviceId: service.id,
                payload: { type, name },
                status: 'queued'
            });

            return { service, newBalance };
        });
    },

    async listUserServices(userId: string, type?: string) {
        if (type) {
            return await db.query.services.findMany({
                where: (services, { eq, and }) => and(eq(services.userId, userId), eq(services.type, type)),
                orderBy: [desc(services.createdAt)]
            });
        }
        return await db.query.services.findMany({
            where: eq(services.userId, userId),
            orderBy: [desc(services.createdAt)]
        });
    },

    async listAllServices(page: number = 1, limit: number = 50) {
        const offset = (page - 1) * limit;

        const data = await db
            .select({
                id: services.id,
                type: services.type,
                name: services.name,
                status: services.status,
                ipAddress: services.ipAddress,
                price: services.price,
                billingCycle: services.billingCycle,
                nextDueDate: services.nextDueDate,
                createdAt: services.createdAt,
                expiresAt: services.expiresAt,
                userId: services.userId,
                userEmail: users.email,
                userName: users.name,
            })
            .from(services)
            .leftJoin(users, eq(services.userId, users.id))
            .orderBy(desc(services.createdAt))
            .limit(limit)
            .offset(offset);
            
        const [{ count }] = await db.select({ count: sql<number>`cast(count(${services.id}) as integer)` }).from(services);

        return {
            data,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    },

    async getService(serviceId: string, userId: string) {
        const service = await db.query.services.findFirst({
            where: (services, { eq, and }) => and(eq(services.userId, userId), eq(services.id, serviceId))
        });

        if (!service) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'Service not found', 404);
        }

        return service;
    },

    async actionService(serviceId: string, userId: string, action: string, ip?: string) {
        const service = await this.getService(serviceId, userId);

        await db.insert(activityLogs).values({
            userId,
            action: `Action '${action}' executed on service ${service.name}`,
            ipAddress: ip || null,
        });

        let provisioningAction: 'create' | 'suspend' | 'unsuspend' | 'terminate' | 'restart' = 'restart';
        if (action === 'start') provisioningAction = 'unsuspend';
        if (action === 'stop') provisioningAction = 'suspend';

        provisioningEngine.provisionService(serviceId, provisioningAction).catch(console.error);

        return service;
    },

    async assignManualService(userId: string, type: string, name: string, price: string, expiresAt: string | undefined, adminId: string) {
        const [newService] = await db.insert(services).values({
            userId,
            type,
            name,
            price,
            status: 'active',
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        }).returning();

        await logAdminAction({ adminId, action: 'ASSIGN_MANUAL_SERVICE', targetId: newService.id, targetType: 'SERVICE', metadata: { userId, type, name, price } });
        await events.emit('service.activated', { serviceId: newService.id, userId });

        return newService;
    },

    async updateServiceStatus(serviceId: string, status: string, adminId: string) {
        const [updatedService] = await db.update(services)
            .set({ status })
            .where(eq(services.id, serviceId))
            .returning();

        if (!updatedService) throw new AppError(ErrorCodes.NOT_FOUND, 'Service not found', 404);

        await logAdminAction({ adminId, action: 'UPDATE_SERVICE_STATUS', targetId: serviceId, targetType: 'SERVICE', dataAfter: { status } });
        
        if (status === 'active') {
            await events.emit('service.activated', { serviceId, userId: updatedService.userId });
        } else if (status === 'suspended') {
            await events.emit('service.suspended', { serviceId, userId: updatedService.userId, reason: 'Admin action' });
        }

        return updatedService;
    },

    async deleteService(serviceId: string, adminId: string) {
        const [deletedService] = await db.delete(services).where(eq(services.id, serviceId)).returning();
        if (!deletedService) throw new AppError(ErrorCodes.NOT_FOUND, 'Service not found', 404);

        await logAdminAction({ adminId, action: 'DELETE_SERVICE', targetId: serviceId, targetType: 'SERVICE' });
        return deletedService;
    }
};
