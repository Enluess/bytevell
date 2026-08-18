import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/productsController.js';

export default async function productsRoutes(fastify: FastifyInstance) {
  // Public
  fastify.get('/', ctrl.getProducts);
  fastify.get('/:id', ctrl.getProductById);
  fastify.get('/groups', ctrl.getProductGroups);

  // Admin - Products
  fastify.post('/', { preHandler: [requireAuth] }, ctrl.createProduct);
  fastify.put('/:id', { preHandler: [requireAuth] }, ctrl.updateProduct);
  fastify.delete('/:id', { preHandler: [requireAuth] }, ctrl.deleteProduct);

  // Admin - Product Groups
  fastify.post('/groups', { preHandler: [requireAuth] }, ctrl.createProductGroup);
  fastify.put('/groups/:id', { preHandler: [requireAuth] }, ctrl.updateProductGroup);
  fastify.delete('/groups/:id', { preHandler: [requireAuth] }, ctrl.deleteProductGroup);

  // Admin - Product Prices
  fastify.post('/:id/prices', { preHandler: [requireAuth] }, ctrl.upsertProductPrice);
  fastify.delete('/prices/:priceId', { preHandler: [requireAuth] }, ctrl.deleteProductPrice);

  // Admin - Product Options
  fastify.post('/:id/options', { preHandler: [requireAuth] }, ctrl.createProductOption);
  fastify.delete('/options/:optionId', { preHandler: [requireAuth] }, ctrl.deleteProductOption);

  // Admin - Product Addons
  fastify.post('/:id/addons', { preHandler: [requireAuth] }, ctrl.createProductAddon);
  fastify.delete('/addons/:addonId', { preHandler: [requireAuth] }, ctrl.deleteProductAddon);
}
