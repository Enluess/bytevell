import { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { users, activityLogs, userSessions } from '../db/schema.js';
import { AppError, ErrorCodes, sendError } from '../lib/errors.js';
import { registerSchema, loginSchema } from '../schema/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const parsed = registerSchema.safeParse((request.body as any));
        if (!parsed.success) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, parsed.error.errors[0].message, 400, parsed.error.errors);
        }
        
        let { email, password, name, tc, phone } = parsed.data;
        email = email.trim().toLowerCase();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            throw new AppError(ErrorCodes.AUTH_EMAIL_EXISTS, 'A user with this email already exists', 409);
        }

        const hashedPassword = await argon2.hash(password);
        const [user] = await db.insert(users).values({
            email,
            password: hashedPassword,
            name,
            taxId: tc || undefined,
            phone: phone || undefined,
        }).returning();

        // Log activity
        await db.insert(activityLogs).values({
            userId: user.id,
            action: 'Account registered',
            category: 'auth',
            ipAddress: request.ip || undefined,
        });

        reply.status(201).send({ 
            success: true,
            message: 'User registered successfully', 
            userId: user.id 
        });
    } catch (error) {
        sendError(reply, error);
    }
};

export const login = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const parsed = loginSchema.safeParse((request.body as any));
        if (!parsed.success) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, parsed.error.errors[0].message, 400, parsed.error.errors);
        }
        
        let { email, password } = parsed.data;
        email = email.trim().toLowerCase();

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            throw new AppError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'Invalid email or password', 401);
        }

        if (user.status !== 'active') {
            throw new AppError(ErrorCodes.AUTH_ACCOUNT_SUSPENDED, 'Your account has been suspended', 403);
        }

        // Try argon2 first, if it fails format check, it might be an old bcrypt hash from development. 
        // For production we would force a password reset, but let's just support argon2 here.
        const isMatch = await argon2.verify(user.password, password).catch((err) => {
            console.error('Argon2 verify error:', err);
            return false;
        });
        if (!isMatch) {
            throw new AppError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'Invalid email or password', 401);
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

        const [session] = await db.insert(userSessions).values({
            userId: user.id,
            token: sessionToken,
            ipAddress: request.ip || undefined,
            userAgent: request.headers['user-agent'] || undefined,
            expiresAt,
        }).returning();

        const token = jwt.sign(
            { userId: user.id, role: user.role, sessionId: session.id }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Log activity
        await db.insert(activityLogs).values({
            userId: user.id,
            action: 'Login successful',
            category: 'auth',
            ipAddress: request.ip || undefined,
        });

        reply.send({ 
            success: true,
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role, 
                balance: user.balance,
                accountType: user.accountType,
            } 
        });
    } catch (error) {
        sendError(reply, error);
    }
};

export const me = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const userId = (request as any).userId;
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { password: false },
        });

        if (!user) {
            throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
        }

        reply.send({ 
            success: true,
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role, 
                balance: user.balance,
                accountType: user.accountType,
                status: user.status,
            } 
        });
    } catch (error) {
        sendError(reply, error);
    }
};

export const logout = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const sessionId = (request as any).sessionId;
        if (sessionId) {
            await db.delete(userSessions).where(eq(userSessions.id, sessionId));
        }
        reply.send({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        sendError(reply, error);
    }
};
