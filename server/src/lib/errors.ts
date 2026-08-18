import { FastifyReply } from 'fastify';

// ============================================================================
// Error Code Registry
// ============================================================================

export const ErrorCodes = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_NO_TOKEN: 'AUTH_NO_TOKEN',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  AUTH_ACCOUNT_SUSPENDED: 'AUTH_ACCOUNT_SUSPENDED',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_2FA_REQUIRED: 'AUTH_2FA_REQUIRED',
  AUTH_2FA_INVALID: 'AUTH_2FA_INVALID',
  AUTH_EMAIL_EXISTS: 'AUTH_EMAIL_EXISTS',
  
  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Billing
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVOICE_ALREADY_PAID: 'INVOICE_ALREADY_PAID',
  INVOICE_CANCELLED: 'INVOICE_CANCELLED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_PROVIDER_ERROR: 'PAYMENT_PROVIDER_ERROR',
  REFUND_EXCEEDS_PAYMENT: 'REFUND_EXCEEDS_PAYMENT',
  COUPON_INVALID: 'COUPON_INVALID',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_USAGE_EXCEEDED: 'COUPON_USAGE_EXCEEDED',
  
  // Services
  SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
  SERVICE_ALREADY_ACTIVE: 'SERVICE_ALREADY_ACTIVE',
  SERVICE_ALREADY_SUSPENDED: 'SERVICE_ALREADY_SUSPENDED',
  SERVICE_ALREADY_TERMINATED: 'SERVICE_ALREADY_TERMINATED',
  PROVISIONING_FAILED: 'PROVISIONING_FAILED',
  PROVIDER_NOT_CONFIGURED: 'PROVIDER_NOT_CONFIGURED',
  PROVIDER_CONNECTION_FAILED: 'PROVIDER_CONNECTION_FAILED',
  
  // Orders
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_ALREADY_PROCESSED: 'ORDER_ALREADY_PROCESSED',
  PRODUCT_NOT_AVAILABLE: 'PRODUCT_NOT_AVAILABLE',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================================================
// AppError class
// ============================================================================

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ============================================================================
// Convenience constructors
// ============================================================================

export const Errors = {
  notFound: (resource: string) =>
    new AppError(ErrorCodes.NOT_FOUND, `${resource} not found`, 404),
  
  forbidden: (message = 'Access denied') =>
    new AppError(ErrorCodes.FORBIDDEN, message, 403),
  
  permissionDenied: (permission: string) =>
    new AppError(ErrorCodes.PERMISSION_DENIED, `Missing permission: ${permission}`, 403),
    
  unauthorized: (message = 'Authentication required') =>
    new AppError(ErrorCodes.AUTH_NO_TOKEN, message, 401),
  
  validation: (message: string, details?: any) =>
    new AppError(ErrorCodes.VALIDATION_ERROR, message, 422, details),
    
  conflict: (message: string) =>
    new AppError(ErrorCodes.CONFLICT, message, 409),
    
  internal: (message = 'Internal server error') =>
    new AppError(ErrorCodes.INTERNAL_ERROR, message, 500),
    
  insufficientBalance: () =>
    new AppError(ErrorCodes.INSUFFICIENT_BALANCE, 'Insufficient account balance', 402),
    
  invoiceAlreadyPaid: () =>
    new AppError(ErrorCodes.INVOICE_ALREADY_PAID, 'Invoice has already been paid', 409),
    
  rateLimited: () =>
    new AppError(ErrorCodes.RATE_LIMITED, 'Too many requests. Please try again later.', 429),
};

// ============================================================================
// Error response handler
// ============================================================================

export function sendError(reply: FastifyReply, error: unknown, requestId?: string) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    });
  }

  // Unknown error — never expose stack traces
  console.error('[INTERNAL_ERROR]', error);
  return reply.status(500).send({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      ...(requestId ? { requestId } : {}),
    },
  });
}
