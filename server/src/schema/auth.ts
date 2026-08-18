import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: z.string().min(8, 'Parola en az 8 karakter olmalıdır'),
  name: z.string().optional(),
  tc: z.string().optional(),
  phone: z.string().optional(),
}).strict(); // strict prevents mass assignment of unexpected fields

export const loginSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: z.string().min(1, 'Parola gereklidir'),
}).strict();
