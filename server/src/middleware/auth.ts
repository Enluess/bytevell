import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSessions } from '../db/schema.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface DecodedToken {
  userId: string;
  role: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Extract and verify JWT token from Authorization header.
 * Attaches userId and role to request.
 */
export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(ErrorCodes.AUTH_NO_TOKEN, 'No authentication token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Verify session in database if sessionId is present
    if (decoded.sessionId) {
      const session = await db.query.userSessions.findFirst({
        where: eq(userSessions.id, decoded.sessionId)
      });
      if (!session) {
        throw new AppError(ErrorCodes.AUTH_TOKEN_INVALID, 'Session revoked', 401);
      }
      if (new Date() > session.expiresAt) {
        throw new AppError(ErrorCodes.AUTH_TOKEN_EXPIRED, 'Session expired', 401);
      }
      
      // Update last activity periodically (e.g., ignoring precise updates for performance, maybe every 5 mins. For now just check validity)
    }

    (request as any).userId = decoded.userId;
    (request as any).userRole = decoded.role;
    (request as any).sessionId = decoded.sessionId;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError' || error.code === ErrorCodes.AUTH_TOKEN_EXPIRED) {
      throw new AppError(ErrorCodes.AUTH_TOKEN_EXPIRED, 'Token has expired', 401);
    }
    throw new AppError(ErrorCodes.AUTH_TOKEN_INVALID, 'Invalid token or session', 401);
  }
};

/**
 * Extract userId from request (set by requireAuth middleware).
 * Throws if not authenticated.
 */
export function getUserId(request: FastifyRequest): string {
  const userId = (request as any).userId;
  if (!userId) {
    throw new AppError(ErrorCodes.AUTH_NO_TOKEN, 'Not authenticated', 401);
  }
  return userId;
}

/**
 * Get user role from request.
 */
export function getUserRole(request: FastifyRequest): string {
  return (request as any).userRole || 'USER';
}
