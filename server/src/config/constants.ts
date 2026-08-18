// Business constants — centralized, never hardcoded in controllers

export const SERVICE_STATUSES = [
  'pending', 'provisioning', 'active', 'suspension_pending', 
  'suspended', 'termination_pending', 'terminated', 'cancelled'
] as const;

export const INVOICE_STATUSES = [
  'draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled', 'refunded'
] as const;

export const ORDER_STATUSES = [
  'pending', 'pending_payment', 'paid', 'processing', 'provisioning',
  'active', 'fraud', 'cancelled', 'refunded', 'failed'
] as const;

export const PAYMENT_STATUSES = [
  'pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'
] as const;

export const TICKET_STATUSES = [
  'open', 'customer_reply', 'staff_reply', 'in_progress', 'waiting', 'closed'
] as const;

export const BILLING_CYCLES = [
  'monthly', 'quarterly', 'semi_annually', 'annually',
  'biennially', 'triennially', 'one_time', 'free'
] as const;

export const USER_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const;

export const PRODUCT_TYPES = ['hosting', 'vps', 'dedicated', 'domain', 'ssl', 'other'] as const;

export const TRANSACTION_TYPES = [
  'payment', 'refund', 'credit', 'debit', 'adjustment', 'promotional_credit'
] as const;

// Grace period days before suspension after invoice overdue
export const GRACE_PERIOD_DAYS = 3;

// Days after suspension before automatic termination
export const TERMINATION_DAYS = 14;

// Invoice generation days before due date
export const INVOICE_GENERATION_DAYS_BEFORE = 14;

// Max login attempts before lockout
export const MAX_LOGIN_ATTEMPTS = 5;

// Lockout duration in minutes
export const LOCKOUT_DURATION_MINUTES = 30;

// Billing cycle to months mapping
export const BILLING_CYCLE_MONTHS: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  semi_annually: 6,
  annually: 12,
  biennially: 24,
  triennially: 36,
  one_time: 0,
  free: 0,
};

export type ServiceStatus = typeof SERVICE_STATUSES[number];
export type InvoiceStatus = typeof INVOICE_STATUSES[number];
export type OrderStatus = typeof ORDER_STATUSES[number];
export type PaymentStatus = typeof PAYMENT_STATUSES[number];
export type TicketStatus = typeof TICKET_STATUSES[number];
export type BillingCycle = typeof BILLING_CYCLES[number];
export type UserRole = typeof USER_ROLES[number];
export type ProductType = typeof PRODUCT_TYPES[number];
export type TransactionType = typeof TRANSACTION_TYPES[number];
