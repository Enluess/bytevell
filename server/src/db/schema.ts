import { pgTable, uuid, varchar, timestamp, text, integer, boolean, jsonb, numeric, index, uniqueIndex } from 'drizzle-orm/pg-core';

// ============================================================================
// CORE IDENTITY
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  
  // Account type
  accountType: varchar('account_type', { length: 20 }).notNull().default('individual'), // individual, company
  companyName: varchar('company_name', { length: 255 }),
  taxOffice: varchar('tax_office', { length: 255 }),
  taxId: varchar('tax_id', { length: 50 }), // TC Kimlik or Vergi No
  
  // Auth & role
  role: varchar('role', { length: 50 }).notNull().default('USER'), // USER, ADMIN, SUPER_ADMIN
  adminRoleId: uuid('admin_role_id').references(() => adminRoles.id),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, suspended, closed
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerifyToken: varchar('email_verify_token', { length: 255 }),
  
  // Balance (kept as numeric for precision)
  balance: numeric('balance', { precision: 18, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('users_email_idx').on(table.email),
  index('users_role_idx').on(table.role),
  index('users_status_idx').on(table.status),
]);

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 512 }).notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  device: varchar('device', { length: 255 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('user_sessions_user_idx').on(table.userId),
  index('user_sessions_token_idx').on(table.token),
]);

export const userSecurity = pgTable('user_security', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  totpSecret: varchar('totp_secret', { length: 255 }), // Encrypted
  totpEnabled: boolean('totp_enabled').notNull().default(false),
  backupCodes: jsonb('backup_codes'), // Array of hashed codes
  loginAttempts: integer('login_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastLoginIp: varchar('last_login_ip', { length: 50 }),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }),
});

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 20 }).notNull().default('billing'), // billing, shipping
  label: varchar('label', { length: 100 }),
  line1: varchar('line1', { length: 255 }).notNull(),
  line2: varchar('line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 2 }).notNull().default('TR'), // ISO 3166-1 alpha-2
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// RBAC (Role-Based Access Control)
// ============================================================================

export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const adminPermissions = pgTable('admin_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(), // e.g. customers.view, billing.refund
  category: varchar('category', { length: 50 }).notNull(), // customers, billing, services, etc.
  description: text('description'),
});

export const adminRolePermissions = pgTable('admin_role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').references(() => adminRoles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: uuid('permission_id').references(() => adminPermissions.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
  uniqueIndex('admin_role_perm_unique').on(table.roleId, table.permissionId),
]);

// ============================================================================
// PRODUCTS & CATALOG
// ============================================================================

export const productGroups = pgTable('product_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => productGroups.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // hosting, vps, dedicated, domain, ssl, other
  
  // Provisioning
  provisioningProviderId: uuid('provisioning_provider_id').references(() => provisioningProviders.id),
  serverGroupId: uuid('server_group_id').references(() => serverGroups.id),
  
  // Product config
  stockControl: boolean('stock_control').notNull().default(false),
  stockQuantity: integer('stock_quantity'),
  
  // Visibility
  isVisible: boolean('is_visible').notNull().default(true),
  isHidden: boolean('is_hidden').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false),
  
  // Module config & Specs
  moduleConfig: jsonb('module_config'), // Provider-specific configuration
  features: jsonb('features'), // UI presentation features (e.g. RAM, CPU, etc.)
  
  sortOrder: integer('sort_order').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, retired
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('products_group_idx').on(table.groupId),
  index('products_type_idx').on(table.type),
]);

export const productPrices = pgTable('product_prices', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull(), // monthly, quarterly, semi_annually, annually, biennially, triennially, one_time, free
  setupFee: numeric('setup_fee', { precision: 18, scale: 2 }).notNull().default('0.00'),
  recurringPrice: numeric('recurring_price', { precision: 18, scale: 2 }).notNull().default('0.00'),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => [
  index('product_prices_product_idx').on(table.productId),
  uniqueIndex('product_prices_unique').on(table.productId, table.currency, table.billingCycle),
]);

export const productAddons = pgTable('product_addons', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 18, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull().default('monthly'),
  isRequired: boolean('is_required').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const productOptions = pgTable('product_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // e.g. "CPU Cores", "RAM", "Operating System"
  type: varchar('type', { length: 20 }).notNull().default('select'), // select, radio, checkbox, text
  isRequired: boolean('is_required').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const productOptionValues = pgTable('product_option_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').references(() => productOptions.id, { onDelete: 'cascade' }).notNull(),
  label: varchar('label', { length: 255 }).notNull(), // e.g. "4 GB", "Ubuntu 22.04"
  value: varchar('value', { length: 255 }).notNull(),
  priceModifier: numeric('price_modifier', { precision: 18, scale: 2 }).notNull().default('0.00'), // Additional cost
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull().default('monthly'),
  isDefault: boolean('is_default').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ============================================================================
// COUPONS
// ============================================================================

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(), // percentage, fixed
  value: numeric('value', { precision: 18, scale: 2 }).notNull(), // percentage or fixed amount
  currency: varchar('currency', { length: 3 }), // required for fixed type
  
  // Scope
  appliesToProducts: jsonb('applies_to_products'), // null = all products, array of product IDs
  appliesToGroups: jsonb('applies_to_groups'), // null = all groups, array of group IDs
  
  // Recurrence
  isRecurring: boolean('is_recurring').notNull().default(false), // Apply on renewals too
  isFirstOrderOnly: boolean('is_first_order_only').notNull().default(false),
  
  // Limits
  usageLimit: integer('usage_limit'), // null = unlimited
  usageLimitPerCustomer: integer('usage_limit_per_customer').default(1),
  minimumOrderAmount: numeric('minimum_order_amount', { precision: 18, scale: 2 }),
  
  // Validity
  startsAt: timestamp('starts_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const couponUsages = pgTable('coupon_usages', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').references(() => coupons.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orderId: uuid('order_id').references(() => orders.id),
  discountAmount: numeric('discount_amount', { precision: 18, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// ORDERS
// ============================================================================

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  // Financial
  subtotal: numeric('subtotal', { precision: 18, scale: 2 }).notNull().default('0.00'),
  taxAmount: numeric('tax_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  discountAmount: numeric('discount_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 18, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  // Coupon
  couponId: uuid('coupon_id').references(() => coupons.id),
  
  // Status
  status: varchar('status', { length: 30 }).notNull().default('pending'),
  // pending, pending_payment, paid, processing, provisioning, active, fraud, cancelled, refunded, failed
  
  // Fraud
  fraudStatus: varchar('fraud_status', { length: 20 }), // clear, review, blocked
  fraudNotes: text('fraud_notes'),
  
  // Payment
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  invoiceId: uuid('invoice_id').references((): any => invoices.id),
  
  // Admin notes
  adminNotes: text('admin_notes'),
  
  ipAddress: varchar('ip_address', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('orders_user_idx').on(table.userId),
  index('orders_status_idx').on(table.status),
]);

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  
  // Snapshot at time of order (prices can change later)
  productName: varchar('product_name', { length: 255 }).notNull(),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull(),
  setupFee: numeric('setup_fee', { precision: 18, scale: 2 }).notNull().default('0.00'),
  recurringPrice: numeric('recurring_price', { precision: 18, scale: 2 }).notNull().default('0.00'),
  quantity: integer('quantity').notNull().default(1),
  
  // Resulting service
  serviceId: uuid('service_id').references(() => services.id),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const orderItemOptions = pgTable('order_item_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }).notNull(),
  optionId: uuid('option_id').references(() => productOptions.id),
  optionValueId: uuid('option_value_id').references(() => productOptionValues.id),
  optionName: varchar('option_name', { length: 255 }).notNull(),
  valueName: varchar('value_name', { length: 255 }).notNull(),
  priceModifier: numeric('price_modifier', { precision: 18, scale: 2 }).notNull().default('0.00'),
});

// ============================================================================
// INVOICES & BILLING
// ============================================================================

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orderId: uuid('order_id').references((): any => orders.id),
  
  // Financial
  subtotal: numeric('subtotal', { precision: 18, scale: 2 }).notNull().default('0.00'),
  taxAmount: numeric('tax_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  discountAmount: numeric('discount_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  creditApplied: numeric('credit_applied', { precision: 18, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 18, scale: 2 }).notNull().default('0.00'),
  paidAmount: numeric('paid_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('unpaid'),
  // draft, unpaid, partially_paid, paid, overdue, cancelled, refunded
  
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  
  // Type
  type: varchar('type', { length: 20 }).notNull().default('standard'), // standard, recurring, proforma
  
  notes: text('notes'),
  adminNotes: text('admin_notes'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('invoices_user_idx').on(table.userId),
  index('invoices_status_idx').on(table.status),
  index('invoices_due_date_idx').on(table.dueDate),
]);

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: numeric('unit_price', { precision: 18, scale: 2 }).notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull().default('0.00'), // e.g. 20.00 for 20%
  taxAmount: numeric('tax_amount', { precision: 18, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 18, scale: 2 }).notNull(),
  
  // Reference
  serviceId: uuid('service_id').references(() => services.id),
  productId: uuid('product_id').references(() => products.id),
});

// ============================================================================
// PAYMENTS & TRANSACTIONS
// ============================================================================

export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // manual, bank_transfer, iyzico, stripe, paytr
  type: varchar('type', { length: 30 }).notNull(), // credit_card, bank_transfer, wallet, manual
  label: varchar('label', { length: 100 }), // "Visa ending 4242"
  providerRef: varchar('provider_ref', { length: 255 }), // External reference (e.g. Stripe payment method ID)
  metadata: jsonb('metadata'), // Provider-specific data (masked)
  isDefault: boolean('is_default').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('payment_methods_user_idx').on(table.userId),
]);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  provider: varchar('provider', { length: 50 }).notNull(), // manual, bank_transfer, iyzico, stripe
  providerTransactionId: varchar('provider_transaction_id', { length: 255 }),
  
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  // pending, processing, completed, failed, refunded, partially_refunded
  
  // Idempotency
  idempotencyKey: varchar('idempotency_key', { length: 255 }).unique(),
  
  metadata: jsonb('metadata'),
  failureReason: text('failure_reason'),
  
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('payments_invoice_idx').on(table.invoiceId),
  index('payments_user_idx').on(table.userId),
  index('payments_status_idx').on(table.status),
]);

// Immutable financial ledger — NEVER delete rows from this table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 30 }).notNull(),
  // payment, refund, credit, debit, adjustment, promotional_credit
  
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(), // Positive for credits, negative for debits
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  balanceBefore: numeric('balance_before', { precision: 18, scale: 2 }).notNull(),
  balanceAfter: numeric('balance_after', { precision: 18, scale: 2 }).notNull(),
  
  // References
  invoiceId: uuid('invoice_id').references(() => invoices.id),
  paymentId: uuid('payment_id').references(() => payments.id),
  refundId: uuid('refund_id').references(() => refunds.id),
  
  description: text('description').notNull(),
  adminId: uuid('admin_id').references(() => users.id), // If admin-initiated
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('transactions_user_idx').on(table.userId),
  index('transactions_type_idx').on(table.type),
]);

export const refunds = pgTable('refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentId: uuid('payment_id').references(() => payments.id).notNull(),
  invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  
  type: varchar('type', { length: 20 }).notNull(), // full, partial, credit
  reason: text('reason'),
  
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, completed, failed
  
  providerRefundId: varchar('provider_refund_id', { length: 255 }),
  adminId: uuid('admin_id').references(() => users.id).notNull(), // Who processed the refund
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// TAX
// ============================================================================

export const taxRules = pgTable('tax_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(), // e.g. "KDV %20"
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(), // e.g. 20.00
  country: varchar('country', { length: 2 }).notNull().default('TR'),
  state: varchar('state', { length: 100 }), // Optional for state-level taxes
  appliesToProductTypes: jsonb('applies_to_product_types'), // null = all, array of types
  isInclusive: boolean('is_inclusive').notNull().default(false), // Tax included in price
  isActive: boolean('is_active').notNull().default(true),
  priority: integer('priority').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const currencies = pgTable('currencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 3 }).notNull().unique(), // TRY, USD, EUR
  name: varchar('name', { length: 100 }).notNull(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
  decimalPlaces: integer('decimal_places').notNull().default(2),
  exchangeRate: numeric('exchange_rate', { precision: 18, scale: 6 }).notNull().default('1.000000'), // Relative to base currency
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// ============================================================================
// SERVICES & LIFECYCLE
// ============================================================================

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  productId: uuid('product_id').references(() => products.id),
  orderId: uuid('order_id').references(() => orders.id),
  serverId: uuid('server_id').references(() => servers.id),
  
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // hosting, vps, dedicated, domain, ssl, other
  
  // Status lifecycle
  status: varchar('status', { length: 30 }).notNull().default('pending'),
  // pending, provisioning, active, suspension_pending, suspended, termination_pending, terminated, cancelled
  
  // Network
  ipAddress: varchar('ip_address', { length: 50 }),
  ipv6Address: varchar('ipv6_address', { length: 100 }),
  hostname: varchar('hostname', { length: 255 }),
  
  // Billing
  billingCycle: varchar('billing_cycle', { length: 20 }), // monthly, quarterly, semi_annually, annually, etc.
  price: numeric('price', { precision: 18, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  nextDueDate: timestamp('next_due_date', { withTimezone: true }),
  gracePeriodEnd: timestamp('grace_period_end', { withTimezone: true }),
  terminationDate: timestamp('termination_date', { withTimezone: true }),
  
  // Provisioning
  provisioningProviderId: uuid('provisioning_provider_id').references(() => provisioningProviders.id),
  externalId: varchar('external_id', { length: 255 }), // ID on the provisioning provider
  
  // Config snapshot
  metadata: jsonb('metadata'), // CPU, RAM, Disk, OS, Datacenter, etc.
  
  // Admin
  adminNotes: text('admin_notes'),
  suspensionReason: text('suspension_reason'),
  cancellationReason: text('cancellation_reason'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
}, (table) => [
  index('services_user_idx').on(table.userId),
  index('services_status_idx').on(table.status),
  index('services_type_idx').on(table.type),
  index('services_next_due_idx').on(table.nextDueDate),
]);

export const serviceEvents = pgTable('service_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  event: varchar('event', { length: 50 }).notNull(), // created, activated, suspended, unsuspended, terminated, upgraded, renewed
  previousStatus: varchar('previous_status', { length: 30 }),
  newStatus: varchar('new_status', { length: 30 }),
  description: text('description'),
  adminId: uuid('admin_id').references(() => users.id), // null = system/customer action
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('service_events_service_idx').on(table.serviceId),
]);

// ============================================================================
// PROVISIONING
// ============================================================================

export const provisioningProviders = pgTable('provisioning_providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // manual, proxmox, cpanel, directadmin, pterodactyl, custom
  apiUrl: varchar('api_url', { length: 500 }),
  credentials: text('credentials'), // AES-256-GCM encrypted JSON
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, error
  lastConnectionTest: timestamp('last_connection_test', { withTimezone: true }),
  connectionStatus: varchar('connection_status', { length: 20 }), // connected, failed, unknown
  config: jsonb('config'), // Provider-specific config (non-secret)
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const provisioningJobs = pgTable('provisioning_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  // create_service, suspend_service, unsuspend_service, terminate_service,
  // upgrade_service, change_password, reinstall, backup
  
  serviceId: uuid('service_id').references(() => services.id),
  providerId: uuid('provider_id').references(() => provisioningProviders.id),
  
  payload: jsonb('payload'),
  
  status: varchar('status', { length: 20 }).notNull().default('queued'),
  // queued, running, completed, failed, cancelled
  
  attempts: integer('attempts').notNull().default(0),
  maxAttempts: integer('max_attempts').notNull().default(3),
  
  error: text('error'),
  result: jsonb('result'),
  
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('provisioning_jobs_status_idx').on(table.status),
  index('provisioning_jobs_service_idx').on(table.serviceId),
]);

export const provisioningJobLogs = pgTable('provisioning_job_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => provisioningJobs.id, { onDelete: 'cascade' }).notNull(),
  attempt: integer('attempt').notNull(),
  level: varchar('level', { length: 10 }).notNull().default('info'), // info, warn, error
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// INFRASTRUCTURE
// ============================================================================

export const datacenters = pgTable('datacenters', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  timezone: varchar('timezone', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const serverGroups = pgTable('server_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  fillType: varchar('fill_type', { length: 20 }).notNull().default('fill'), // fill (fill one server before next) or spread
  maxCapacity: integer('max_capacity'), // Total services allowed across all servers
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const servers = pgTable('servers', {
  id: uuid('id').primaryKey().defaultRandom(),
  datacenterId: uuid('datacenter_id').references(() => datacenters.id),
  serverGroupId: uuid('server_group_id').references(() => serverGroups.id),
  provisioningProviderId: uuid('provisioning_provider_id').references(() => provisioningProviders.id),
  
  hostname: varchar('hostname', { length: 255 }).notNull(),
  ip: varchar('ip', { length: 50 }).notNull(),
  port: integer('port').default(22),
  os: varchar('os', { length: 100 }),
  cpu: varchar('cpu', { length: 100 }),
  ram: varchar('ram', { length: 100 }),
  storage: varchar('storage', { length: 100 }),
  bandwidth: varchar('bandwidth', { length: 100 }),
  
  maxCapacity: integer('max_capacity'), // Max services on this server
  currentLoad: integer('current_load').notNull().default(0),
  
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, maintenance, offline
  maintenanceMode: boolean('maintenance_mode').notNull().default(false),
  
  lastHeartbeat: timestamp('last_heartbeat', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('servers_datacenter_idx').on(table.datacenterId),
  index('servers_group_idx').on(table.serverGroupId),
]);

export const ipPools = pgTable('ip_pools', {
  id: uuid('id').primaryKey().defaultRandom(),
  datacenterId: uuid('datacenter_id').references(() => datacenters.id),
  name: varchar('name', { length: 255 }).notNull(),
  subnet: varchar('subnet', { length: 50 }),
  gateway: varchar('gateway', { length: 50 }),
  type: varchar('type', { length: 10 }).notNull().default('ipv4'), // ipv4, ipv6
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const ipAddresses = pgTable('ip_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  poolId: uuid('pool_id').references(() => ipPools.id),
  address: varchar('address', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 10 }).notNull().default('ipv4'),
  status: varchar('status', { length: 20 }).notNull().default('available'), // available, assigned, reserved, blocked
  customerId: uuid('customer_id').references(() => users.id),
  serviceId: uuid('service_id').references(() => services.id),
  serverId: uuid('server_id').references(() => servers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('ip_addresses_status_idx').on(table.status),
  index('ip_addresses_service_idx').on(table.serviceId),
]);

// ============================================================================
// DOMAINS
// ============================================================================

export const domainRegistrars = pgTable('domain_registrars', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // manual, enom, resellerclub, custom
  apiUrl: varchar('api_url', { length: 500 }),
  credentials: text('credentials'), // Encrypted
  status: varchar('status', { length: 20 }).notNull().default('active'),
  config: jsonb('config'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const domainTldPrices = pgTable('domain_tld_prices', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrarId: uuid('registrar_id').references(() => domainRegistrars.id, { onDelete: 'cascade' }).notNull(),
  tld: varchar('tld', { length: 50 }).notNull(), // .com, .net, .com.tr
  registerPrice: numeric('register_price', { precision: 18, scale: 2 }).notNull(),
  renewPrice: numeric('renew_price', { precision: 18, scale: 2 }).notNull(),
  transferPrice: numeric('transfer_price', { precision: 18, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('TRY'),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => [
  uniqueIndex('tld_registrar_unique').on(table.registrarId, table.tld),
]);

export const domains = pgTable('domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id),
  registrarId: uuid('registrar_id').references(() => domainRegistrars.id),
  
  domainName: varchar('domain_name', { length: 255 }).notNull().unique(),
  tld: varchar('tld', { length: 50 }).notNull(),
  
  status: varchar('status', { length: 20 }).notNull().default('active'),
  // pending, active, expired, transferred_away, cancelled
  
  registrationDate: timestamp('registration_date', { withTimezone: true }),
  expirationDate: timestamp('expiration_date', { withTimezone: true }),
  autoRenew: boolean('auto_renew').notNull().default(true),
  
  nameservers: jsonb('nameservers'), // Array of NS records
  eppCode: varchar('epp_code', { length: 255 }), // Encrypted
  
  externalId: varchar('external_id', { length: 255 }), // Registrar reference
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('domains_user_idx').on(table.userId),
  index('domains_expiration_idx').on(table.expirationDate),
]);

export const domainEvents = pgTable('domain_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id').references(() => domains.id, { onDelete: 'cascade' }).notNull(),
  event: varchar('event', { length: 50 }).notNull(), // registered, renewed, transferred, expired
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const dnsRecords = pgTable('dns_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id').references(() => domains.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 10 }).notNull(), // A, AAAA, CNAME, MX, TXT, NS, SRV, CAA
  name: varchar('name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  ttl: integer('ttl').notNull().default(3600),
  priority: integer('priority'), // For MX, SRV
  proxied: boolean('proxied').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('dns_records_domain_idx').on(table.domainId),
]);

// ============================================================================
// SUPPORT
// ============================================================================

export const ticketDepartments = pgTable('ticket_departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  email: varchar('email', { length: 255 }),
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  departmentId: uuid('department_id').references(() => ticketDepartments.id),
  serviceId: uuid('service_id').references(() => services.id), // Related service
  
  subject: varchar('subject', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  // open, customer_reply, staff_reply, in_progress, waiting, closed
  priority: varchar('priority', { length: 20 }).notNull().default('medium'), // low, medium, high, urgent
  
  assignedTo: uuid('assigned_to').references(() => users.id), // Admin user
  tags: jsonb('tags'), // Array of strings
  
  lastReplyAt: timestamp('last_reply_at', { withTimezone: true }),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('tickets_user_idx').on(table.userId),
  index('tickets_status_idx').on(table.status),
  index('tickets_assigned_idx').on(table.assignedTo),
]);

export const ticketMessages = pgTable('ticket_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => users.id),
  senderRole: varchar('sender_role', { length: 20 }).notNull(), // customer, staff, system
  message: text('message').notNull(),
  isInternal: boolean('is_internal').notNull().default(false), // Internal note, not visible to customer
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('ticket_messages_ticket_idx').on(table.ticketId),
]);

export const ticketAttachments = pgTable('ticket_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').references(() => ticketMessages.id, { onDelete: 'cascade' }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cannedResponses = pgTable('canned_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  departmentId: uuid('department_id').references(() => ticketDepartments.id),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

export const kbCategories = pgTable('kb_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id'), // Self-referencing for hierarchy
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const kbArticles = pgTable('kb_articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => kbCategories.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published
  views: integer('views').notNull().default(0),
  
  // SEO
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  
  authorId: uuid('author_id').references(() => users.id),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('kb_articles_category_idx').on(table.categoryId),
  index('kb_articles_status_idx').on(table.status),
]);

// ============================================================================
// COMMUNICATION
// ============================================================================

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // welcome, invoice_created, payment_received, etc.
  name: varchar('name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  variables: jsonb('variables'), // Available template variables documentation
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => emailTemplates.id),
  userId: uuid('user_id').references(() => users.id),
  recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('queued'), // queued, sent, failed, bounced
  provider: varchar('provider', { length: 50 }), // smtp, sendgrid, etc.
  error: text('error'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('email_logs_user_idx').on(table.userId),
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // info, warning, error, success
  category: varchar('category', { length: 50 }), // billing, service, support, security, system
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  actionUrl: varchar('action_url', { length: 500 }),
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('notifications_user_idx').on(table.userId),
  index('notifications_read_idx').on(table.isRead),
]);

// ============================================================================
// WEBHOOKS
// ============================================================================

export const webhooks = pgTable('webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  endpoint: varchar('endpoint', { length: 500 }).notNull(),
  events: jsonb('events').notNull(), // Array of event names
  secret: varchar('secret', { length: 255 }), // For HMAC signature
  status: varchar('status', { length: 20 }).notNull().default('active'),
  failureCount: integer('failure_count').notNull().default(0),
  lastDelivery: timestamp('last_delivery', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  webhookId: uuid('webhook_id').references(() => webhooks.id, { onDelete: 'cascade' }).notNull(),
  event: varchar('event', { length: 100 }).notNull(),
  payload: jsonb('payload').notNull(),
  responseStatus: integer('response_status'),
  responseBody: text('response_body'),
  attempt: integer('attempt').notNull().default(1),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, success, failed
  error: text('error'),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('webhook_deliveries_webhook_idx').on(table.webhookId),
]);

// ============================================================================
// SYSTEM & AUDIT
// ============================================================================

export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 100 }).notNull(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  valueType: varchar('value_type', { length: 20 }).notNull().default('string'), // string, number, boolean, json
  isPublic: boolean('is_public').notNull().default(false), // Visible to customers?
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  targetId: varchar('target_id', { length: 255 }),
  targetType: varchar('target_type', { length: 50 }), // USER, SERVICE, INVOICE, ORDER, etc.
  
  // Before/After snapshots for data changes
  dataBefore: jsonb('data_before'),
  dataAfter: jsonb('data_after'),
  
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  requestId: varchar('request_id', { length: 100 }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('audit_logs_admin_idx').on(table.adminId),
  index('audit_logs_action_idx').on(table.action),
  index('audit_logs_target_idx').on(table.targetId, table.targetType),
  index('audit_logs_created_idx').on(table.createdAt),
]);

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }), // auth, service, billing, support, security
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  device: varchar('device', { length: 255 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('activity_logs_user_idx').on(table.userId),
  index('activity_logs_category_idx').on(table.category),
]);

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(), // SHA-256 hashed
  keyPrefix: varchar('key_prefix', { length: 10 }), // First 8 chars for identification
  permissions: jsonb('permissions'), // Array of allowed operations
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('api_keys_user_idx').on(table.userId),
  index('api_keys_hash_idx').on(table.keyHash),
]);

// General purpose job queue (for billing, emails, etc. - separate from provisioning)
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 100 }).notNull(),
  // generate_invoice, process_payment, retry_payment, send_email, send_notification,
  // suspend_service, terminate_service, domain_renewal, cleanup
  
  payload: jsonb('payload'),
  
  status: varchar('status', { length: 20 }).notNull().default('queued'),
  // queued, running, completed, failed, cancelled
  
  priority: integer('priority').notNull().default(0), // Higher = more urgent
  attempts: integer('attempts').notNull().default(0),
  maxAttempts: integer('max_attempts').notNull().default(3),
  
  error: text('error'),
  result: jsonb('result'),
  
  // Scheduling
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  
  // Idempotency
  idempotencyKey: varchar('idempotency_key', { length: 255 }).unique(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('jobs_status_idx').on(table.status),
  index('jobs_type_idx').on(table.type),
  index('jobs_scheduled_idx').on(table.scheduledAt),
]);

// ============================================================================
// ANNOUNCEMENTS
// ============================================================================

export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  type: varchar('type', { length: 20 }).notNull().default('info'), // info, warning, maintenance, update
  isPublished: boolean('is_published').notNull().default(false),
  isPinned: boolean('is_pinned').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type UserAddress = typeof userAddresses.$inferSelect;
export type AdminRole = typeof adminRoles.$inferSelect;
export type AdminPermission = typeof adminPermissions.$inferSelect;
export type ProductGroup = typeof productGroups.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductPrice = typeof productPrices.$inferSelect;
export type ProductOption = typeof productOptions.$inferSelect;
export type ProductOptionValue = typeof productOptionValues.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Refund = typeof refunds.$inferSelect;
export type TaxRule = typeof taxRules.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type Service = typeof services.$inferSelect;
export type ServiceEvent = typeof serviceEvents.$inferSelect;
export type ProvisioningProvider = typeof provisioningProviders.$inferSelect;
export type ProvisioningJob = typeof provisioningJobs.$inferSelect;
export type Datacenter = typeof datacenters.$inferSelect;
export type ServerGroup = typeof serverGroups.$inferSelect;
export type Server = typeof servers.$inferSelect;
export type IpPool = typeof ipPools.$inferSelect;
export type IpAddress = typeof ipAddresses.$inferSelect;
export type DomainRegistrar = typeof domainRegistrars.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type DnsRecord = typeof dnsRecords.$inferSelect;
export type TicketDepartment = typeof ticketDepartments.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type KbCategory = typeof kbCategories.$inferSelect;
export type KbArticle = typeof kbArticles.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Webhook = typeof webhooks.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
