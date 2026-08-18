import { IProvisioningProvider, ProvisioningContext } from './IProvisioningProvider.js';
import { MockProvider } from './MockProvider.js';
import { db } from '../../db/index.js';
import { services, serviceEvents, activityLogs } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export class ProvisioningEngine {
    private providers: Map<string, IProvisioningProvider> = new Map();

    constructor() {
        // Register default mock provider for development
        this.registerProvider('mock', new MockProvider());
    }

    registerProvider(name: string, provider: IProvisioningProvider) {
        this.providers.set(name, provider);
    }

    getProvider(name: string): IProvisioningProvider {
        const provider = this.providers.get(name);
        if (!provider) {
            throw new Error(`Provisioning provider '${name}' not found`);
        }
        return provider;
    }

    /**
     * Executes a provisioning action (create, suspend, unsuspend, terminate, restart)
     * For production, this should ideally push to a Queue/Job system.
     * For now, we execute synchronously but independently of the HTTP request if needed.
     */
    async provisionService(serviceId: string, action: 'create' | 'suspend' | 'unsuspend' | 'terminate' | 'restart', reason?: string) {
        try {
            const service = await db.query.services.findFirst({
                where: eq(services.id, serviceId)
            });

            if (!service) throw new Error('Service not found');

            let providerName = 'mock';
            if (service.provisioningProviderId) {
                // For now, if we had a provider table we could fetch its type. 
                // We'll just assume 'mock' or any mapped provider.
                providerName = 'mock'; 
            }

            const provider = this.getProvider(providerName);

            const context: ProvisioningContext = {
                serviceId: service.id,
                productId: service.productId!,
                orderId: service.orderId || undefined,
                userId: service.userId,
                metadata: service.metadata as Record<string, any>,
            };

            // Initial status update
            let pendingStatus = service.status;
            if (action === 'create') pendingStatus = 'provisioning';
            else if (action === 'suspend') pendingStatus = 'suspension_pending';
            else if (action === 'terminate') pendingStatus = 'termination_pending';

            if (pendingStatus !== service.status) {
                await db.update(services)
                    .set({ status: pendingStatus, updatedAt: new Date() })
                    .where(eq(services.id, serviceId));
            }

            // Call provider
            let result;
            switch(action) {
                case 'create': result = await provider.create(context); break;
                case 'suspend': result = await provider.suspend(context, reason); break;
                case 'unsuspend': result = await provider.unsuspend(context); break;
                case 'terminate': result = await provider.terminate(context); break;
                case 'restart': result = await provider.restart(context); break;
            }

            if (!result.success) {
                throw new Error(result.error || 'Provider returned failure');
            }

            // Final status update
            let finalStatus = service.status;
            if (action === 'create') finalStatus = 'active';
            else if (action === 'suspend') finalStatus = 'suspended';
            else if (action === 'unsuspend') finalStatus = 'active';
            else if (action === 'terminate') finalStatus = 'terminated';
            
            const updateData: any = {
                status: finalStatus,
                updatedAt: new Date()
            };

            if (action === 'create') {
                if (result.ipAddress) updateData.ipAddress = result.ipAddress;
                if (result.ipv6Address) updateData.ipv6Address = result.ipv6Address;
                if (result.hostname) updateData.hostname = result.hostname;
                if (result.externalId) updateData.externalId = result.externalId;
                if (result.metadata) updateData.metadata = { ...(service.metadata as any || {}), ...result.metadata };
            }

            await db.update(services)
                .set(updateData)
                .where(eq(services.id, serviceId));

            // Log event
            await db.insert(serviceEvents).values({
                serviceId,
                event: action === 'create' ? 'activated' : action === 'unsuspend' ? 'unsuspended' : action === 'terminate' ? 'terminated' : action === 'suspend' ? 'suspended' : 'restarted',
                previousStatus: pendingStatus,
                newStatus: finalStatus,
                description: `Service successfully ${action}d via ${providerName}`,
            });

            // Log activity for user
            await db.insert(activityLogs).values({
                userId: service.userId,
                category: 'service',
                action: `Service ${action}`,
                metadata: { serviceId }
            });

            return true;

        } catch (error: any) {
            console.error(`Provisioning error on ${action} for ${serviceId}:`, error);
            
            // Revert status or set to error state if possible
            // We just leave it in pending state or set a specific failed state.
            return false;
        }
    }
}

export const provisioningEngine = new ProvisioningEngine();
