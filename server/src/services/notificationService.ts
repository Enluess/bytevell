import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';

export interface CreateNotificationParams {
    userId: string;
    type: 'info' | 'warning' | 'error' | 'success';
    category: 'billing' | 'service' | 'support' | 'security' | 'system';
    title: string;
    message: string;
    actionUrl?: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
    try {
        const [notification] = await db.insert(notifications).values({
            userId: params.userId,
            type: params.type,
            category: params.category,
            title: params.title,
            message: params.message,
            actionUrl: params.actionUrl
        }).returning();

        // In the future: emit real-time WebSocket event here
        // wss.broadcastToUser(params.userId, 'notification.new', notification);

        return notification;
    } catch (error) {
        console.error('[NotificationService] Failed to create notification:', error);
        // Do not throw, notifications are non-critical side effects
    }
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
    // ... we already have this in notificationsController.ts probably, but good to abstract
};
