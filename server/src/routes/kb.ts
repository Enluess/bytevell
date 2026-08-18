import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/kbController.js';

export default async function kbRoutes(fastify: FastifyInstance) {
  // Public
  fastify.get('/categories', ctrl.getCategories);
  fastify.get('/categories/:slug/articles', ctrl.getArticlesByCategory);
  fastify.get('/articles/:slug', ctrl.getArticle);
  fastify.get('/search', ctrl.searchArticles);

  // Admin - Categories
  fastify.get('/admin/categories', { preHandler: [requireAuth] }, ctrl.adminGetCategories);
  fastify.post('/admin/categories', { preHandler: [requireAuth] }, ctrl.createCategory);
  fastify.put('/admin/categories/:id', { preHandler: [requireAuth] }, ctrl.updateCategory);
  fastify.delete('/admin/categories/:id', { preHandler: [requireAuth] }, ctrl.deleteCategory);

  // Admin - Articles
  fastify.get('/admin/articles', { preHandler: [requireAuth] }, ctrl.adminGetArticles);
  fastify.post('/admin/articles', { preHandler: [requireAuth] }, ctrl.createArticle);
  fastify.put('/admin/articles/:id', { preHandler: [requireAuth] }, ctrl.updateArticle);
  fastify.delete('/admin/articles/:id', { preHandler: [requireAuth] }, ctrl.deleteArticle);
}
