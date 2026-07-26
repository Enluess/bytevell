import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function test() {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, 'test@test.com'),
        });
        console.log('Success:', user);
    } catch (e) {
        console.error('Database Error:', e);
    }
    process.exit(0);
}
test();
