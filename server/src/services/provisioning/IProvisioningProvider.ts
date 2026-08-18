export interface ProvisioningContext {
    serviceId: string;
    productId: string;
    orderId?: string;
    userId: string;
    metadata?: Record<string, any>;
    config?: Record<string, any>;
}

export interface ProviderResult {
    success: boolean;
    externalId?: string;
    ipAddress?: string;
    ipv6Address?: string;
    hostname?: string;
    metadata?: Record<string, any>;
    error?: string;
    isQueued?: boolean;
}

export interface IProvisioningProvider {
    create(context: ProvisioningContext): Promise<ProviderResult>;
    suspend(context: ProvisioningContext, reason?: string): Promise<ProviderResult>;
    unsuspend(context: ProvisioningContext): Promise<ProviderResult>;
    terminate(context: ProvisioningContext): Promise<ProviderResult>;
    restart(context: ProvisioningContext): Promise<ProviderResult>;
    status(context: ProvisioningContext): Promise<{
        status: 'online' | 'offline' | 'unknown' | 'provisioning' | 'suspended';
        metrics?: {
            cpu?: number;
            ram?: number;
            disk?: number;
            network?: number;
        }
    }>;
}
