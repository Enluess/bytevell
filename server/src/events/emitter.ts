type EventHandler = (...args: any[]) => void | Promise<void>;

/**
 * Simple in-process domain event emitter.
 * 
 * Usage:
 *   events.on('invoice.paid', async (data) => { ... });
 *   await events.emit('invoice.paid', { invoiceId: '...', userId: '...' });
 * 
 * Events are processed concurrently. If one handler fails, others still run.
 * Errors are logged but don't propagate to the emitter.
 */
class DomainEventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Register an event handler.
   */
  on(event: string, handler: EventHandler): void {
    const existing = this.handlers.get(event) || [];
    existing.push(handler);
    this.handlers.set(event, existing);
  }

  /**
   * Remove a specific handler.
   */
  off(event: string, handler: EventHandler): void {
    const existing = this.handlers.get(event) || [];
    this.handlers.set(event, existing.filter(h => h !== handler));
  }

  /**
   * Emit an event. All handlers run concurrently.
   * Errors are caught and logged — they never break the caller.
   */
  async emit(event: string, data?: any): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    if (handlers.length === 0) return;

    const results = await Promise.allSettled(
      handlers.map(handler => {
        try {
          return Promise.resolve(handler(data));
        } catch (error) {
          return Promise.reject(error);
        }
      })
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error(`[EVENT_ERROR] Event "${event}" handler failed:`, result.reason);
      }
    }
  }
}

// Singleton instance
export const events = new DomainEventEmitter();

// ============================================================================
// Event type definitions
// ============================================================================

export interface EventTypes {
  // Customer
  'customer.created': { userId: string };
  'customer.updated': { userId: string; changes: Record<string, any> };
  'customer.suspended': { userId: string; adminId: string; reason?: string };
  
  // Order
  'order.created': { orderId: string; userId: string };
  'order.paid': { orderId: string; userId: string; invoiceId: string };
  'order.cancelled': { orderId: string; userId: string; reason?: string };
  'order.fraud_flagged': { orderId: string; userId: string };
  
  // Invoice
  'invoice.created': { invoiceId: string; userId: string };
  'invoice.paid': { invoiceId: string; userId: string; paymentId: string };
  'invoice.overdue': { invoiceId: string; userId: string };
  'invoice.cancelled': { invoiceId: string; userId: string };
  
  // Payment
  'payment.completed': { paymentId: string; invoiceId: string; userId: string; amount: string };
  'payment.failed': { paymentId: string; invoiceId: string; userId: string; reason: string };
  
  // Service
  'service.created': { serviceId: string; userId: string };
  'service.activated': { serviceId: string; userId: string };
  'service.suspended': { serviceId: string; userId: string; reason?: string };
  'service.unsuspended': { serviceId: string; userId: string };
  'service.terminated': { serviceId: string; userId: string };
  'service.renewed': { serviceId: string; userId: string };
  
  // Domain
  'domain.registered': { domainId: string; userId: string; domainName: string };
  'domain.expiring': { domainId: string; userId: string; domainName: string; daysLeft: number };
  
  // Ticket
  'ticket.created': { ticketId: string; userId: string; subject: string };
  'ticket.replied': { ticketId: string; userId: string; senderRole: string };
  'ticket.closed': { ticketId: string; userId: string };
}
