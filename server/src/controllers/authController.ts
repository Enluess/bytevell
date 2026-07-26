import { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
) => {
    try {
        const { email, password, name } = request.body;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return reply.status(400).send({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db.insert(users).values({
            email,
            password: hashedPassword,
            name,
        }).returning();

        reply.status(201).send({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const login = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
) => {
    try {
        const { email, password } = request.body;

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return reply.status(400).send({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return reply.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        reply.send({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, balance: user.balance } });
    } catch (error) {
        reply.status(500).send({ message: 'Server error', error });
    }
};

export const me = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return reply.status(401).send({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await db.query.users.findFirst({
            where: eq(users.id, decoded.userId),
        });

        if (!user) {
            return reply.status(404).send({ message: 'User not found' });
        }

        reply.send({ user: { id: user.id, email: user.email, name: user.name, role: user.role, balance: user.balance } });
    } catch (error) {
        reply.status(401).send({ message: 'Invalid token', error });
    }
};
