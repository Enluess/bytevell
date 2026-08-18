import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/financeController.js';

export default async function financeRoutes(fastify: FastifyInstance) {
  // Currencies
  fastify.get('/currencies', { preHandler: [requireAuth] }, ctrl.getCurrencies);
  fastify.post('/currencies', { preHandler: [requireAuth] }, ctrl.createCurrency);
  fastify.put('/currencies/:id', { preHandler: [requireAuth] }, ctrl.updateCurrency);
  fastify.delete('/currencies/:id', { preHandler: [requireAuth] }, ctrl.deleteCurrency);

  // Tax Rules
  fastify.get('/tax-rules', { preHandler: [requireAuth] }, ctrl.getTaxRules);
  fastify.post('/tax-rules', { preHandler: [requireAuth] }, ctrl.createTaxRule);
  fastify.put('/tax-rules/:id', { preHandler: [requireAuth] }, ctrl.updateTaxRule);
  fastify.delete('/tax-rules/:id', { preHandler: [requireAuth] }, ctrl.deleteTaxRule);

  // Wallet - Customer
  fastify.get('/balance', { preHandler: [requireAuth] }, ctrl.getBalance);
  fastify.get('/transactions', { preHandler: [requireAuth] }, ctrl.getTransactionHistory);

  // Wallet - Admin
  fastify.post('/users/:userId/credit', { preHandler: [requireAuth] }, ctrl.addCredit);
  fastify.post('/users/:userId/debit', { preHandler: [requireAuth] }, ctrl.deductCredit);
}
