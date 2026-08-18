import 'dotenv/config';
import { db } from './src/db/index.js';
import { users, services, invoices, tickets, ticketMessages } from './src/db/schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('Seeding data...');
    
    // Create demo user
    const hashedPassword = await bcrypt.hash('password', 10);
    const [user] = await db.insert(users).values({
        email: 'demo@bytevell.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'USER',
        balance: '500.00'
    }).returning();

    console.log('Created user:', user.email);

    // Create services
    await db.insert(services).values([
        {
            userId: user.id,
            type: 'VDS',
            name: 'Ryzen 9 9950X - VDS',
            status: 'active',
            ipAddress: '192.168.1.100',
            price: '350.00'
        },
        {
            userId: user.id,
            type: 'Web Hosting',
            name: 'cPanel Pro Hosting',
            status: 'active',
            ipAddress: 'bytevell.com',
            price: '120.00'
        }
    ]);

    console.log('Created services');

    // Create invoices
    await db.insert(invoices).values([
        {
            userId: user.id,
            amount: '350.00',
            status: 'unpaid',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        {
            userId: user.id,
            amount: '120.00',
            status: 'paid',
            dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        }
    ]);

    console.log('Created invoices');

    // Create tickets
    const [ticket] = await db.insert(tickets).values({
        userId: user.id,
        subject: 'Cannot access my server',
        status: 'open',
        priority: 'high'
    }).returning();

    await db.insert(ticketMessages).values({
        ticketId: ticket.id,
        senderRole: 'USER',
        message: 'Hello, I cannot SSH into my server at 192.168.1.100. Please help.'
    });

    console.log('Created tickets');
    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
