import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'bytevell-dev-encryption-key-32ch';
  // Ensure exactly 32 bytes
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt sensitive data (provider credentials, TOTP secrets, etc.)
 * Returns a base64 string: iv:encrypted:tag
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();
  
  return `${iv.toString('base64')}:${encrypted}:${tag.toString('base64')}`;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'base64');
  const encrypted = parts[1];
  const tag = Buffer.from(parts[2], 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash an API key using SHA-256 (one-way, for storage)
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Generate a random API key
 * Returns: { key: 'bv_live_xxxx...', prefix: 'bv_live_' }
 */
export function generateApiKey(prefix = 'bv_live'): { key: string; prefix: string } {
  const random = crypto.randomBytes(32).toString('hex');
  const key = `${prefix}_${random}`;
  return { key, prefix: key.substring(0, 10) };
}

/**
 * Generate a random token (for email verification, password reset, etc.)
 */
export function generateToken(length = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate an idempotency key
 */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}
