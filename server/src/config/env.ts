import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  
  // Encryption (for provider secrets, TOTP keys, etc.)
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters').default('bytevell-dev-encryption-key-32ch'),
  
  // Email (optional in dev)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@bytevell.com'),
  
  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  
  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('1 minute'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export function getEnv(): Env {
  if (!_env) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌ Invalid environment variables:');
      console.error(result.error.flatten().fieldErrors);
      // In development, use defaults; in production, crash
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      // Parse with defaults for dev
      _env = envSchema.parse({
        ...process.env,
        JWT_SECRET: process.env.JWT_SECRET || 'bytevell-development-secret-key',
      });
    } else {
      _env = result.data;
    }
  }
  return _env;
}

export const env = getEnv();
