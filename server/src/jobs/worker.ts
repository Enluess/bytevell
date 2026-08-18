import { db } from '../db/index.js';
import { provisioningJobs, provisioningJobLogs, services } from '../db/schema.js';
import { eq, and, asc, lt, sql } from 'drizzle-orm';
import { events } from '../events/emitter.js';

export class JobWorker {
    private isRunning = false;
    private timer: NodeJS.Timeout | null = null;
    private pollIntervalMs = 5000;

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.poll();
        console.log('[JobWorker] Started polling for provisioning jobs...');
    }

    stop() {
        this.isRunning = false;
        if (this.timer) clearTimeout(this.timer);
    }

    private async poll() {
        if (!this.isRunning) return;

        try {
            await this.processNextJob();
        } catch (error) {
            console.error('[JobWorker] Polling error:', error);
        }

        if (this.isRunning) {
            this.timer = setTimeout(() => this.poll(), this.pollIntervalMs);
        }
    }

    private async recoverStaleJobs() {
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        await db.update(provisioningJobs)
            .set({ status: 'queued', error: 'Recovered from stale running state' })
            .where(and(
                eq(provisioningJobs.status, 'running'),
                lt(provisioningJobs.startedAt, fifteenMinsAgo)
            ));
    }

    private async processNextJob() {
        try {
            await this.recoverStaleJobs();
        } catch (error) {
            console.error('[JobWorker] Stale job recovery failed:', error);
        }

        let job: any;

        // Use transaction to fetch and lock the next job
        await db.transaction(async (tx) => {
            const result = await tx.execute(
                sql`SELECT id, type, attempts, max_attempts as "maxAttempts", service_id as "serviceId" 
                    FROM ${provisioningJobs} 
                    WHERE status = 'queued' 
                    ORDER BY created_at ASC 
                    LIMIT 1 
                    FOR UPDATE SKIP LOCKED`
            );

            if (result.length === 0) return;
            job = result[0];

            await tx.update(provisioningJobs)
                .set({ 
                    status: 'running', 
                    startedAt: new Date(),
                    attempts: job.attempts + 1
                })
                .where(eq(provisioningJobs.id, job.id));
        });

        if (!job) return;

        console.log(`[JobWorker] Processing job ${job.id} of type ${job.type}`);

        try {
            // Simulate provisioning time
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mark service as active if it was a create job
            if (job.type === 'create_service' && job.serviceId) {
                await db.update(services)
                    .set({ status: 'active' })
                    .where(eq(services.id, job.serviceId));
                
                await events.emit('service.activated', { serviceId: job.serviceId, userId: 'worker' });
            }

            // Mark job as completed
            await db.update(provisioningJobs)
                .set({ status: 'completed', completedAt: new Date(), result: { success: true } })
                .where(eq(provisioningJobs.id, job.id));

            await db.insert(provisioningJobLogs).values({
                jobId: job.id,
                attempt: job.attempts + 1,
                level: 'info',
                message: 'Job completed successfully'
            });

            console.log(`[JobWorker] Job ${job.id} completed successfully`);
        } catch (error: any) {
            console.error(`[JobWorker] Job ${job.id} failed:`, error);
            
            const isFinalAttempt = (job.attempts + 1) >= job.maxAttempts;
            const newStatus = isFinalAttempt ? 'failed' : 'queued';

            await db.update(provisioningJobs)
                .set({ status: newStatus, error: error.message })
                .where(eq(provisioningJobs.id, job.id));

            await db.insert(provisioningJobLogs).values({
                jobId: job.id,
                attempt: job.attempts + 1,
                level: 'error',
                message: error.message
            });

            if (isFinalAttempt && job.serviceId) {
                await db.update(services)
                    .set({ status: 'failed' })
                    .where(eq(services.id, job.serviceId));
            }
        }
    }
}

export const jobWorker = new JobWorker();
