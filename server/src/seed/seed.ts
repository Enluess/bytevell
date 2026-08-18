import 'dotenv/config';
import { db } from '../db/index.js';
import { adminRoles, adminPermissions, adminRolePermissions, users, currencies, taxRules, ticketDepartments, systemSettings, emailTemplates } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...\n');

  // ============================
  // 1. RBAC: Roles
  // ============================
  console.log('Creating admin roles...');
  const roles = await db.insert(adminRoles).values([
    { name: 'Super Admin', description: 'Full unrestricted access to all platform operations', isSuperAdmin: true },
    { name: 'Administrator', description: 'Full access except system-level operations' },
    { name: 'Billing Manager', description: 'Manage invoices, payments, refunds, and financial operations' },
    { name: 'Support Agent', description: 'View customers, manage tickets, read-only billing access' },
    { name: 'Infrastructure Manager', description: 'Manage servers, datacenters, IP pools, and provisioning' },
    { name: 'Sales Manager', description: 'Manage products, orders, coupons, and promotions' },
    { name: 'Developer', description: 'API access, webhooks, system health, and logs' },
    { name: 'Read Only', description: 'View-only access across the platform' },
  ]).returning();
  console.log(`  ✓ Created ${roles.length} roles`);

  // ============================
  // 2. RBAC: Permissions
  // ============================
  console.log('Creating permissions...');
  const permissionData = [
    // Customers
    { name: 'customers.view', category: 'customers', description: 'View customer list and details' },
    { name: 'customers.create', category: 'customers', description: 'Create new customers' },
    { name: 'customers.edit', category: 'customers', description: 'Edit customer profiles' },
    { name: 'customers.delete', category: 'customers', description: 'Delete/close customer accounts' },
    { name: 'customers.impersonate', category: 'customers', description: 'Login as customer' },
    
    // Orders
    { name: 'orders.view', category: 'orders', description: 'View orders' },
    { name: 'orders.manage', category: 'orders', description: 'Create, edit, cancel orders' },
    { name: 'orders.fraud_review', category: 'orders', description: 'Review and clear fraud flags' },
    
    // Products
    { name: 'products.view', category: 'products', description: 'View products and pricing' },
    { name: 'products.manage', category: 'products', description: 'Create, edit, delete products' },
    { name: 'products.pricing', category: 'products', description: 'Modify product pricing' },
    
    // Services
    { name: 'services.view', category: 'services', description: 'View all services' },
    { name: 'services.manage', category: 'services', description: 'Manage service status' },
    { name: 'services.provision', category: 'services', description: 'Provision new services' },
    { name: 'services.suspend', category: 'services', description: 'Suspend services' },
    { name: 'services.terminate', category: 'services', description: 'Terminate services' },
    
    // Billing
    { name: 'billing.view', category: 'billing', description: 'View invoices and transactions' },
    { name: 'billing.manage', category: 'billing', description: 'Create and edit invoices' },
    { name: 'billing.refund', category: 'billing', description: 'Process refunds' },
    { name: 'billing.credits', category: 'billing', description: 'Manage customer credits' },
    
    // Infrastructure
    { name: 'infrastructure.view', category: 'infrastructure', description: 'View servers and datacenters' },
    { name: 'infrastructure.manage', category: 'infrastructure', description: 'Manage infrastructure' },
    
    // Support
    { name: 'tickets.view', category: 'support', description: 'View all tickets' },
    { name: 'tickets.reply', category: 'support', description: 'Reply to tickets' },
    { name: 'tickets.manage', category: 'support', description: 'Assign, close, delete tickets' },
    
    // Domains
    { name: 'domains.view', category: 'domains', description: 'View domains' },
    { name: 'domains.manage', category: 'domains', description: 'Manage domains and DNS' },
    
    // Reports
    { name: 'reports.view', category: 'reports', description: 'View financial and operational reports' },
    
    // Security
    { name: 'security.audit_logs', category: 'security', description: 'View audit logs' },
    { name: 'security.admins', category: 'security', description: 'Manage admin users and roles' },
    
    // System
    { name: 'settings.view', category: 'system', description: 'View system settings' },
    { name: 'settings.manage', category: 'system', description: 'Modify system settings' },
    { name: 'system.health', category: 'system', description: 'View system health and monitoring' },
  ];

  const permissions = await db.insert(adminPermissions).values(permissionData).returning();
  console.log(`  ✓ Created ${permissions.length} permissions`);

  // ============================
  // 3. RBAC: Role-Permission Mappings
  // ============================
  console.log('Mapping permissions to roles...');
  
  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
  const permMap = Object.fromEntries(permissions.map(p => [p.name, p.id]));
  
  const mappings: { roleId: string; permissionId: string }[] = [];
  
  // Administrator: everything except settings.manage and security.admins
  const adminPerms = permissions.filter(p => 
    p.name !== 'settings.manage' && p.name !== 'security.admins' && p.name !== 'customers.impersonate'
  );
  for (const p of adminPerms) {
    mappings.push({ roleId: roleMap['Administrator'], permissionId: p.id });
  }
  
  // Billing Manager
  const billingPerms = ['customers.view', 'orders.view', 'orders.manage', 'billing.view', 'billing.manage', 'billing.refund', 'billing.credits', 'services.view', 'reports.view'];
  for (const name of billingPerms) {
    if (permMap[name]) mappings.push({ roleId: roleMap['Billing Manager'], permissionId: permMap[name] });
  }
  
  // Support Agent
  const supportPerms = ['customers.view', 'services.view', 'billing.view', 'tickets.view', 'tickets.reply', 'tickets.manage', 'domains.view'];
  for (const name of supportPerms) {
    if (permMap[name]) mappings.push({ roleId: roleMap['Support Agent'], permissionId: permMap[name] });
  }
  
  // Infrastructure Manager
  const infraPerms = ['infrastructure.view', 'infrastructure.manage', 'services.view', 'services.manage', 'services.provision', 'services.suspend', 'services.terminate', 'system.health'];
  for (const name of infraPerms) {
    if (permMap[name]) mappings.push({ roleId: roleMap['Infrastructure Manager'], permissionId: permMap[name] });
  }
  
  // Sales Manager
  const salesPerms = ['customers.view', 'customers.create', 'orders.view', 'orders.manage', 'products.view', 'products.manage', 'products.pricing', 'reports.view'];
  for (const name of salesPerms) {
    if (permMap[name]) mappings.push({ roleId: roleMap['Sales Manager'], permissionId: permMap[name] });
  }
  
  // Developer
  const devPerms = ['system.health', 'security.audit_logs', 'settings.view'];
  for (const name of devPerms) {
    if (permMap[name]) mappings.push({ roleId: roleMap['Developer'], permissionId: permMap[name] });
  }
  
  // Read Only: all .view permissions
  const readOnlyPerms = permissions.filter(p => p.name.endsWith('.view') || p.name === 'system.health');
  for (const p of readOnlyPerms) {
    mappings.push({ roleId: roleMap['Read Only'], permissionId: p.id });
  }
  
  if (mappings.length > 0) {
    await db.insert(adminRolePermissions).values(mappings);
  }
  console.log(`  ✓ Created ${mappings.length} role-permission mappings`);

  // ============================
  // 4. Default Super Admin User
  // ============================
  console.log('Creating default admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const superAdminRole = roles.find(r => r.name === 'Super Admin');
  
  await db.insert(users).values({
    email: 'admin@bytevell.com',
    password: hashedPassword,
    name: 'Bytevell Admin',
    role: 'ADMIN',
    adminRoleId: superAdminRole?.id,
    status: 'active',
    emailVerified: true,
    balance: '0.00',
    currency: 'TRY',
  });
  console.log('  ✓ Created admin@bytevell.com (password: admin123)');

  // ============================
  // 5. Currencies
  // ============================
  console.log('Creating currencies...');
  await db.insert(currencies).values([
    { code: 'TRY', name: 'Türk Lirası', symbol: '₺', decimalPlaces: 2, exchangeRate: '1.000000', isDefault: true, isActive: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, exchangeRate: '0.030000', isDefault: false, isActive: true },
    { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, exchangeRate: '0.027000', isDefault: false, isActive: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, exchangeRate: '0.023000', isDefault: false, isActive: true },
  ]);
  console.log('  ✓ Created 4 currencies');

  // ============================
  // 6. Tax Rules
  // ============================
  console.log('Creating tax rules...');
  await db.insert(taxRules).values([
    { name: 'KDV %20', rate: '20.00', country: 'TR', isInclusive: false, isActive: true, priority: 0 },
  ]);
  console.log('  ✓ Created KDV tax rule');

  // ============================
  // 7. Ticket Departments
  // ============================
  console.log('Creating ticket departments...');
  await db.insert(ticketDepartments).values([
    { name: 'General Support', description: 'General inquiries and support', isDefault: true, sortOrder: 0 },
    { name: 'Technical Support', description: 'Server, VPS, and hosting technical issues', sortOrder: 1 },
    { name: 'Billing', description: 'Payment, invoice, and billing questions', sortOrder: 2 },
    { name: 'Sales', description: 'Pre-sales questions and custom quotes', sortOrder: 3 },
    { name: 'Abuse', description: 'Report abuse or policy violations', sortOrder: 4 },
  ]);
  console.log('  ✓ Created 5 ticket departments');

  // ============================
  // 8. System Settings
  // ============================
  console.log('Creating system settings...');
  await db.insert(systemSettings).values([
    { category: 'general', key: 'company_name', value: 'Bytevell', valueType: 'string' },
    { category: 'general', key: 'company_email', value: 'info@bytevell.com', valueType: 'string' },
    { category: 'general', key: 'company_phone', value: '+90 850 XXX XX XX', valueType: 'string' },
    { category: 'general', key: 'company_address', value: 'Istanbul, Turkey', valueType: 'string' },
    { category: 'general', key: 'default_currency', value: 'TRY', valueType: 'string' },
    { category: 'general', key: 'default_language', value: 'tr', valueType: 'string' },
    { category: 'billing', key: 'invoice_prefix', value: 'BV', valueType: 'string' },
    { category: 'billing', key: 'grace_period_days', value: '3', valueType: 'number' },
    { category: 'billing', key: 'termination_days', value: '14', valueType: 'number' },
    { category: 'billing', key: 'auto_suspend', value: 'true', valueType: 'boolean' },
    { category: 'billing', key: 'auto_terminate', value: 'true', valueType: 'boolean' },
    { category: 'billing', key: 'invoice_days_before', value: '14', valueType: 'number' },
    { category: 'security', key: 'max_login_attempts', value: '5', valueType: 'number' },
    { category: 'security', key: 'lockout_duration_minutes', value: '30', valueType: 'number' },
    { category: 'security', key: 'require_2fa_admins', value: 'false', valueType: 'boolean' },
    { category: 'maintenance', key: 'maintenance_mode', value: 'false', valueType: 'boolean' },
    { category: 'maintenance', key: 'maintenance_message', value: 'System is under maintenance.', valueType: 'string' },
  ]);
  console.log('  ✓ Created system settings');

  // ============================
  // 9. Email Templates
  // ============================
  console.log('Creating email templates...');
  await db.insert(emailTemplates).values([
    { slug: 'welcome', name: 'Welcome Email', subject: 'Welcome to Bytevell, {{customer.name}}!', bodyHtml: '<h1>Welcome to Bytevell</h1><p>Your account has been created.</p>', variables: ['customer.name', 'customer.email'] },
    { slug: 'email_verification', name: 'Email Verification', subject: 'Verify your email address', bodyHtml: '<p>Click the link to verify: {{verification_url}}</p>', variables: ['customer.name', 'verification_url'] },
    { slug: 'invoice_created', name: 'Invoice Created', subject: 'New Invoice #{{invoice.number}}', bodyHtml: '<p>Invoice #{{invoice.number}} for {{invoice.total}} {{invoice.currency}} is due on {{invoice.dueDate}}.</p>', variables: ['customer.name', 'invoice.number', 'invoice.total', 'invoice.currency', 'invoice.dueDate'] },
    { slug: 'payment_received', name: 'Payment Received', subject: 'Payment Received - Invoice #{{invoice.number}}', bodyHtml: '<p>Thank you! Your payment of {{payment.amount}} has been received.</p>', variables: ['customer.name', 'invoice.number', 'payment.amount'] },
    { slug: 'payment_failed', name: 'Payment Failed', subject: 'Payment Failed - Invoice #{{invoice.number}}', bodyHtml: '<p>Your payment for Invoice #{{invoice.number}} has failed. Please update your payment method.</p>', variables: ['customer.name', 'invoice.number'] },
    { slug: 'service_activated', name: 'Service Activated', subject: 'Your service {{service.name}} is now active', bodyHtml: '<p>Your service {{service.name}} has been activated.</p>', variables: ['customer.name', 'service.name', 'service.ipAddress'] },
    { slug: 'service_suspended', name: 'Service Suspended', subject: 'Service {{service.name}} has been suspended', bodyHtml: '<p>Your service has been suspended. Please contact support or pay outstanding invoices.</p>', variables: ['customer.name', 'service.name', 'suspension_reason'] },
    { slug: 'ticket_created', name: 'Ticket Created', subject: 'Ticket #{{ticket.id}} - {{ticket.subject}}', bodyHtml: '<p>Your support ticket has been created. We will respond shortly.</p>', variables: ['customer.name', 'ticket.id', 'ticket.subject'] },
    { slug: 'ticket_replied', name: 'Ticket Replied', subject: 'Re: Ticket #{{ticket.id}} - {{ticket.subject}}', bodyHtml: '<p>A staff member has replied to your ticket.</p>', variables: ['customer.name', 'ticket.id', 'ticket.subject'] },
    { slug: 'password_reset', name: 'Password Reset', subject: 'Reset your password', bodyHtml: '<p>Click the link to reset your password: {{reset_url}}</p>', variables: ['customer.name', 'reset_url'] },
  ]);
  console.log('  ✓ Created 10 email templates');

  console.log('\n✅ Seed completed successfully!\n');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
