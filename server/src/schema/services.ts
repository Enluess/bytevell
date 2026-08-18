import { z } from 'zod';

export const purchaseServiceSchema = z.object({
  type: z.enum(['hosting', 'vps', 'dedicated', 'domain', 'ssl', 'web', 'mail']),
  name: z.string().min(1, 'Servis adı gereklidir'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Geçersiz fiyat',
  }),
}).strict();

export const actionServiceSchema = z.object({
  action: z.enum(['start', 'stop', 'restart', 'reinstall', 'suspend', 'unsuspend', 'terminate']),
}).strict();
