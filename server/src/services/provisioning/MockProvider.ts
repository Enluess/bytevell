import { IProvisioningProvider, ProvisioningContext, ProviderResult } from './IProvisioningProvider.js';

export class MockProvider implements IProvisioningProvider {
    
    private generateIp() {
        return `185.123.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    async create(context: ProvisioningContext): Promise<ProviderResult> {
        console.log('[MockProvider] Creating service', context.serviceId);
        // Simulate some delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            success: true,
            externalId: `mock-ext-${context.serviceId}`,
            ipAddress: this.generateIp(),
            hostname: `srv-${context.serviceId.substring(0, 8)}.bytevell.host`,
            metadata: {
                cpu: context.config?.cpu || '2 vCPU',
                ram: context.config?.ram || '4 GB',
                disk: context.config?.disk || '60 GB NVMe',
                os: context.config?.os || 'Ubuntu 24.04'
            }
        };
    }

    async suspend(context: ProvisioningContext, reason?: string): Promise<ProviderResult> {
        console.log(`[MockProvider] Suspending service ${context.serviceId} - Reason: ${reason}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    async unsuspend(context: ProvisioningContext): Promise<ProviderResult> {
        console.log(`[MockProvider] Unsuspending service ${context.serviceId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    async terminate(context: ProvisioningContext): Promise<ProviderResult> {
        console.log(`[MockProvider] Terminating service ${context.serviceId}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    }

    async restart(context: ProvisioningContext): Promise<ProviderResult> {
        console.log(`[MockProvider] Restarting service ${context.serviceId}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { success: true };
    }

    async status(context: ProvisioningContext) {
        // Return fake metrics
        return {
            status: 'online' as const,
            metrics: {
                cpu: Math.floor(Math.random() * 40) + 10, // 10-50%
                ram: Math.floor(Math.random() * 60) + 20, // 20-80%
                disk: Math.floor(Math.random() * 30) + 40, // 40-70%
                network: Math.floor(Math.random() * 100)
            }
        };
    }
}
