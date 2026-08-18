import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';

import jwt from 'jsonwebtoken';

async function run() {
    const allUsers = await db.select().from(users);
    const userId = allUsers[0].id;
    console.log(`Testing PUT for user ${userId}`);
    
    // Create a fake JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    const token = jwt.sign({ userId, role: 'ADMIN' }, JWT_SECRET);

    try {
        const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ role: 'ADMIN' })
        });
        const text = await res.text();
        console.log(res.status, text);
    } catch (e) {
        console.error("Fetch failed", e);
    }
    process.exit(0);
}
run();
