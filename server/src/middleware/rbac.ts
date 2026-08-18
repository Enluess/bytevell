import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { adminRoles, adminPermissions, adminRolePermissions, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AppError, ErrorCodes } from '../lib/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface DecodedToken {
  userId: string;
  role: string;
}

/**
 * Check if the requesting user has a specific RBAC permission.
 * Super Admins bypass all permission checks.
 */
export const requirePermission = (requiredPermission: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(ErrorCodes.AUTH_NO_TOKEN, 'No token provided', 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      (request as any).userId = decoded.userId;

      // Fetch user with role info
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId),
        columns: { id: true, role: true, adminRoleId: true, status: true },
      });

      if (!user || user.status !== 'active') {
        throw new AppError(ErrorCodes.AUTH_ACCOUNT_SUSPENDED, 'Account is not active', 403);
      }

      // Super Admin bypasses all permission checks
      if (decoded.role === 'SUPER_ADMIN') return;

      // Check if the user has the required permission via their admin role
      if (user.adminRoleId) {
        const role = await db.query.adminRoles.findFirst({
          where: eq(adminRoles.id, user.adminRoleId),
        });

        if (role?.isSuperAdmin) return;

        // Check role's permissions
        const rolePerms = await db
          .select({ permName: adminPermissions.name })
          .from(adminRolePermissions)
          .innerJoin(adminPermissions, eq(adminRolePermissions.permissionId, adminPermissions.id))
          .where(eq(adminRolePermissions.roleId, user.adminRoleId));

        const permNames = rolePerms.map(p => p.permName);
        if (permNames.includes(requiredPermission)) return;
      }

      throw new AppError(ErrorCodes.PERMISSION_DENIED, `Missing required permission: ${requiredPermission}`, 403);

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(ErrorCodes.AUTH_TOKEN_INVALID, 'Invalid token', 401);
    }
  };
};

/**
 * Generic admin check — any user with ADMIN or SUPER_ADMIN role can access.
 */
export const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(ErrorCodes.AUTH_NO_TOKEN, 'No token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    (request as any).userId = decoded.userId;

    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      throw new AppError(ErrorCodes.FORBIDDEN, 'Admin access required', 403);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(ErrorCodes.AUTH_TOKEN_INVALID, 'Invalid token', 401);
  }
};
