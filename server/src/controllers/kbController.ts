import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc, asc, ilike, sql } from 'drizzle-orm';
import { kbCategories, kbArticles } from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// PUBLIC
// ============================================================================

export const getCategories = async (request: FastifyRequest, reply: FastifyReply) => {
  const categories = await db.select().from(kbCategories)
    .where(eq(kbCategories.isVisible, true))
    .orderBy(asc(kbCategories.sortOrder));

  // Count articles per category
  const articlesCount = await db.select({
    categoryId: kbArticles.categoryId,
    count: sql<number>`count(*)::int`,
  }).from(kbArticles)
    .where(eq(kbArticles.status, 'published'))
    .groupBy(kbArticles.categoryId);

  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    articleCount: articlesCount.find(a => a.categoryId === cat.id)?.count || 0,
  }));

  return reply.send({ categories: categoriesWithCount });
};

export const getArticlesByCategory = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const { slug } = (request.params as any);
  const [category] = await db.select().from(kbCategories).where(eq(kbCategories.slug, slug)).limit(1);
  if (!category) throw new AppError(ErrorCodes.NOT_FOUND, 'Category not found', 404);

  const articles = await db.select({
    id: kbArticles.id,
    title: kbArticles.title,
    slug: kbArticles.slug,
    excerpt: kbArticles.excerpt,
    views: kbArticles.views,
    publishedAt: kbArticles.publishedAt,
  }).from(kbArticles)
    .where(and(eq(kbArticles.categoryId, category.id), eq(kbArticles.status, 'published')))
    .orderBy(desc(kbArticles.publishedAt));

  return reply.send({ category, articles });
};

export const getArticle = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const { slug } = (request.params as any);
  const [article] = await db.select().from(kbArticles)
    .where(and(eq(kbArticles.slug, slug), eq(kbArticles.status, 'published')))
    .limit(1);
  if (!article) throw new AppError(ErrorCodes.NOT_FOUND, 'Article not found', 404);

  // Increment views
  await db.update(kbArticles).set({ views: sql`${kbArticles.views} + 1` }).where(eq(kbArticles.id, article.id));

  let category = null;
  if (article.categoryId) {
    const [cat] = await db.select().from(kbCategories).where(eq(kbCategories.id, article.categoryId)).limit(1);
    category = cat || null;
  }

  return reply.send({ article: { ...article, views: article.views + 1 }, category });
};

export const searchArticles = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const q = (request.query as any).q || '';
  if (!q) return reply.send({ articles: [] });

  const articles = await db.select({
    id: kbArticles.id,
    title: kbArticles.title,
    slug: kbArticles.slug,
    excerpt: kbArticles.excerpt,
    views: kbArticles.views,
    categoryId: kbArticles.categoryId,
  }).from(kbArticles)
    .where(and(
      eq(kbArticles.status, 'published'),
      ilike(kbArticles.title, `%${q}%`)
    ))
    .limit(20);

  return reply.send({ articles });
};

// ============================================================================
// ADMIN
// ============================================================================

export const adminGetCategories = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const categories = await db.select().from(kbCategories).orderBy(asc(kbCategories.sortOrder));
  return reply.send({ categories });
};

export const createCategory = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const [category] = await db.insert(kbCategories).values({
    name: body.name,
    slug,
    description: body.description || null,
    parentId: body.parentId || null,
    sortOrder: body.sortOrder || 0,
    isVisible: body.isVisible ?? true,
  }).returning();
  return reply.code(201).send({ category });
};

export const updateCategory = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
  if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;

  const [updated] = await db.update(kbCategories).set(updateData).where(eq(kbCategories.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Category not found', 404);
  return reply.send({ category: updated });
};

export const deleteCategory = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(kbCategories).where(eq(kbCategories.id, (request.params as any).id));
  return reply.send({ success: true });
};

export const adminGetArticles = async (request: FastifyRequest, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const articles = await db.select({
    id: kbArticles.id,
    title: kbArticles.title,
    slug: kbArticles.slug,
    status: kbArticles.status,
    views: kbArticles.views,
    categoryId: kbArticles.categoryId,
    categoryName: kbCategories.name,
    publishedAt: kbArticles.publishedAt,
    createdAt: kbArticles.createdAt,
  }).from(kbArticles)
    .leftJoin(kbCategories, eq(kbArticles.categoryId, kbCategories.id))
    .orderBy(desc(kbArticles.createdAt));
  return reply.send({ articles });
};

export const createArticle = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const [article] = await db.insert(kbArticles).values({
    categoryId: body.categoryId || null,
    title: body.title,
    slug,
    content: body.content,
    excerpt: body.excerpt || null,
    status: body.status || 'draft',
    metaTitle: body.metaTitle || null,
    metaDescription: body.metaDescription || null,
    authorId: getUserId(request),
    publishedAt: body.status === 'published' ? new Date() : null,
  }).returning();
  return reply.code(201).send({ article });
};

export const updateArticle = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const updateData: any = {};
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
  if (body.title !== undefined) updateData.title = body.title;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
  if (body.status !== undefined) {
    updateData.status = body.status;
    if (body.status === 'published') updateData.publishedAt = new Date();
  }
  if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
  if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;

  const [updated] = await db.update(kbArticles).set(updateData).where(eq(kbArticles.id, (request.params as any).id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Article not found', 404);
  return reply.send({ article: updated });
};

export const deleteArticle = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(kbArticles).where(eq(kbArticles.id, (request.params as any).id));
  return reply.send({ success: true });
};
