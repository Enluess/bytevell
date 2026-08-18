/**
 * Money utilities — avoid floating point for financial calculations.
 * All money values in the database are stored as numeric(18,2) which Drizzle
 * returns as strings. These utilities operate on string representations.
 */

/**
 * Parse a money string to cents (integer) for safe arithmetic.
 * "123.45" → 12345
 */
export function toCents(amount: string | number): number {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) throw new Error(`Invalid money amount: ${amount}`);
  return Math.round(num * 100);
}

/**
 * Convert cents back to a decimal string.
 * 12345 → "123.45"
 */
export function fromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Add two money amounts (both as strings).
 */
export function addMoney(a: string, b: string): string {
  return fromCents(toCents(a) + toCents(b));
}

/**
 * Subtract b from a.
 */
export function subtractMoney(a: string, b: string): string {
  return fromCents(toCents(a) - toCents(b));
}

/**
 * Multiply a money amount by a factor.
 * Useful for tax: multiplyMoney("100.00", 0.20) → "20.00"
 */
export function multiplyMoney(amount: string, factor: number): string {
  return fromCents(Math.round(toCents(amount) * factor));
}

/**
 * Compare two money amounts.
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareMoney(a: string, b: string): -1 | 0 | 1 {
  const diff = toCents(a) - toCents(b);
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Check if amount is zero or negative.
 */
export function isZeroOrNegative(amount: string): boolean {
  return toCents(amount) <= 0;
}

/**
 * Format money for display.
 * formatMoney("1234.50", "TRY") → "₺1.234,50"
 * formatMoney("1234.50", "USD") → "$1,234.50"
 */
export function formatMoney(amount: string, currency: string, locale = 'tr-TR'): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Calculate tax amount from a pre-tax amount and rate.
 * calculateTax("100.00", "20.00") → "20.00"
 */
export function calculateTax(amount: string, rate: string): string {
  const rateFactor = parseFloat(rate) / 100;
  return multiplyMoney(amount, rateFactor);
}

/**
 * Generate a unique invoice number.
 * Format: BV-2024-000001
 */
export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `BV-${year}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Generate a unique order number.
 * Format: ORD-20240813-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}
