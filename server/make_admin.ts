import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function makeAdmin() {
    console.log('Making demo user admin...');
    await db.update(users).set({ role: 'ADMIN' }).where(eq(users.email, 'demo@bytevell.com'));
    console.log('Done!');
    process.exit(0);
}

makeAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
