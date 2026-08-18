import { db } from '../db/index.js';
import { auditLogs } from '../db/schema.js';

interface AuditLogPayload {
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  dataBefore?: any;
  dataAfter?: any;
  metadata?: any; // Additional context
}

/**
 * Log an admin action to the immutable audit trail.
 * This function never throws — audit failures are logged but don't break the main flow.
 */
export const logAdminAction = async (payload: AuditLogPayload) => {
  try {
    await db.insert(auditLogs).values({
      adminId: payload.adminId,
      action: payload.action,
      targetId: payload.targetId,
      targetType: payload.targetType,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
      requestId: payload.requestId,
      dataBefore: payload.dataBefore || null,
      dataAfter: payload.dataAfter || null,
    });
  } catch (error) {
    console.error('[AUDIT_ERROR] Failed to write audit log:', error);
  }
};
