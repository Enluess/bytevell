import { events } from '../emitter.js';
import { createNotification } from '../../services/notificationService.js';

export const registerNotificationHandlers = () => {
    events.on('ticket.replied', async (data) => {
        // If staff replied, notify the user
        if (data.senderRole !== 'USER') {
            await createNotification({
                userId: data.userId,
                type: 'info',
                category: 'support',
                title: 'Destek Talebinize Yanıt Geldi',
                message: `Talebiniz güncellendi.`,
                actionUrl: `/panel/tickets/${data.ticketId}`
            });
        }
    });

    events.on('invoice.created', async (data) => {
        await createNotification({
            userId: data.userId,
            type: 'warning',
            category: 'billing',
            title: 'Yeni Fatura Oluşturuldu',
            message: `Hesabınıza yeni bir fatura tanımlandı.`,
            actionUrl: `/panel/invoices/${data.invoiceId}`
        });
    });

    events.on('invoice.paid', async (data) => {
        await createNotification({
            userId: data.userId,
            type: 'success',
            category: 'billing',
            title: 'Ödeme Alındı',
            message: `Faturanız başarıyla ödendi. Teşekkür ederiz.`,
            actionUrl: `/panel/invoices/${data.invoiceId}`
        });
    });

    events.on('service.activated', async (data) => {
        await createNotification({
            userId: data.userId,
            type: 'success',
            category: 'service',
            title: 'Hizmetiniz Aktifleştirildi',
            message: `Yeni hizmetiniz kullanıma hazır.`,
            actionUrl: `/panel/services/${data.serviceId}`
        });
    });

    events.on('service.suspended', async (data) => {
        await createNotification({
            userId: data.userId,
            type: 'error',
            category: 'service',
            title: 'Hizmetiniz Askıya Alındı',
            message: data.reason ? `Askıya alınma nedeni: ${data.reason}` : `Hizmetiniz geçici olarak durduruldu.`,
            actionUrl: `/panel/services/${data.serviceId}`
        });
    });
};
