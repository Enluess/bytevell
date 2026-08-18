import 'dotenv/config';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function migrate() {
  console.log('Starting migration: dropping old PascalCase tables...');
  
  // Drop old tables in dependency order (children first)
  const oldTables = [
    'AdminRolePermission',
    'AdminPermission', 
    'AdminRole',
    'AuditLog',
    'IpAddress',
    'IpPool',
    'Server',
    'Datacenter',
    'ProductPlan',
    'Product',
    'Webhook',
    'Job',
    'SystemSetting',
    'DomainDnsRecord',
    'ApiKey',
    'Notification',
    'ActivityLog',
    'TicketMessage',
    'Ticket',
    'Invoice',
    'Service',
    'User',
  ];

  for (const table of oldTables) {
    try {
      await sql.unsafe(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`  Dropped: ${table}`);
    } catch (e: any) {
      console.log(`  Skip: ${table} (${e.message})`);
    }
  }

  console.log('Old tables dropped. Now run: npm run db:push');
  await sql.end();
}

migrate().catch(console.error);
