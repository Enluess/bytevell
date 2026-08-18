import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { eq, and, desc, asc, sql, ilike } from 'drizzle-orm';
import {
  products, productGroups, productPrices, productOptions,
  productOptionValues, productAddons
} from '../db/schema.js';
import { getUserId } from '../middleware/auth.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

// ============================================================================
// PUBLIC
// ============================================================================

export const getProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  const { groupSlug, type } = (request.query as any) || {};

  let query = db.select({
    id: products.id,
    name: products.name,
    slug: products.slug,
    description: products.description,
    type: products.type,
    isVisible: products.isVisible,
    isFeatured: products.isFeatured,
    status: products.status,
    sortOrder: products.sortOrder,
    groupId: products.groupId,
    groupName: productGroups.name,
    groupSlug: productGroups.slug,
    stockControl: products.stockControl,
    stockQuantity: products.stockQuantity,
    features: products.features,
    createdAt: products.createdAt,
  })
  .from(products)
  .leftJoin(productGroups, eq(products.groupId, productGroups.id));

  const conditions = [eq(products.isVisible, true), eq(products.status, 'active')];

  if (groupSlug) {
    conditions.push(eq(productGroups.slug, groupSlug));
  }
  
  if (type) {
    conditions.push(eq(products.type, type));
  }

  const allProducts = await query.where(and(...conditions)).orderBy(asc(products.sortOrder), desc(products.createdAt));

  // Fetch prices for all products
  const allPrices = await db.select().from(productPrices).where(eq(productPrices.isActive, true));
  
  const productsWithPrices = allProducts.map(p => ({
    ...p,
    prices: allPrices.filter(pr => pr.productId === p.id),
  }));

  return reply.send({ products: productsWithPrices });
};

export const getProductById = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  const { id } = (request.params as any);
  
  const product = await db.select({
    id: products.id,
    name: products.name,
    slug: products.slug,
    description: products.description,
    type: products.type,
    isVisible: products.isVisible,
    isHidden: products.isHidden,
    isFeatured: products.isFeatured,
    status: products.status,
    sortOrder: products.sortOrder,
    groupId: products.groupId,
    groupName: productGroups.name,
    stockControl: products.stockControl,
    stockQuantity: products.stockQuantity,
    moduleConfig: products.moduleConfig,
    features: products.features,
    createdAt: products.createdAt,
  })
  .from(products)
  .leftJoin(productGroups, eq(products.groupId, productGroups.id))
  .where(eq(products.id, id))
  .limit(1);

  if (!product.length) throw new AppError(ErrorCodes.NOT_FOUND, 'Product not found', 404);

  const prices = await db.select().from(productPrices).where(eq(productPrices.productId, id));
  const options = await db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.sortOrder));
  
  const optionIds = options.map(o => o.id);
  let optionVals: any[] = [];
  if (optionIds.length > 0) {
    optionVals = await db.select().from(productOptionValues).orderBy(asc(productOptionValues.sortOrder));
    optionVals = optionVals.filter(v => optionIds.includes(v.optionId));
  }

  const addons = await db.select().from(productAddons).where(eq(productAddons.productId, id)).orderBy(asc(productAddons.sortOrder));

  return reply.send({
    product: {
      ...product[0],
      prices,
      options: options.map(o => ({
        ...o,
        values: optionVals.filter(v => v.optionId === o.id),
      })),
      addons,
    },
  });
};

// ============================================================================
// ADMIN - PRODUCTS
// ============================================================================

export const createProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;

  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const [product] = await db.insert(products).values({
    name: body.name,
    slug,
    description: body.description || null,
    type: body.type || 'other',
    groupId: body.groupId || null,
    isVisible: body.isVisible ?? true,
    isFeatured: body.isFeatured ?? false,
    stockControl: body.stockControl ?? false,
    stockQuantity: body.stockQuantity ?? null,
    moduleConfig: body.moduleConfig || null,
    features: body.features || null,
    status: 'active',
  }).returning();

  // Create default pricing if provided
  if (body.prices && Array.isArray(body.prices)) {
    for (const price of body.prices) {
      await db.insert(productPrices).values({
        productId: product.id,
        currency: price.currency || 'TRY',
        billingCycle: price.billingCycle,
        setupFee: price.setupFee || '0.00',
        recurringPrice: price.recurringPrice || '0.00',
      });
    }
  }

  return reply.code(201).send({ product });
};

export const updateProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { id } = (request.params as any);
  const body = (request.body as any) as any;

  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.groupId !== undefined) updateData.groupId = body.groupId;
  if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;
  if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
  if (body.stockControl !== undefined) updateData.stockControl = body.stockControl;
  if (body.stockQuantity !== undefined) updateData.stockQuantity = body.stockQuantity;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.moduleConfig !== undefined) updateData.moduleConfig = body.moduleConfig;
  if (body.features !== undefined) updateData.features = body.features;

  const [updated] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Product not found', 404);

  return reply.send({ product: updated });
};

export const deleteProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { id } = (request.params as any);

  await db.delete(productPrices).where(eq(productPrices.productId, id));
  await db.delete(productAddons).where(eq(productAddons.productId, id));
  const opts = await db.select({ id: productOptions.id }).from(productOptions).where(eq(productOptions.productId, id));
  for (const opt of opts) {
    await db.delete(productOptionValues).where(eq(productOptionValues.optionId, opt.id));
  }
  await db.delete(productOptions).where(eq(productOptions.productId, id));
  await db.delete(products).where(eq(products.id, id));

  return reply.send({ success: true });
};

// ============================================================================
// ADMIN - PRODUCT GROUPS
// ============================================================================

export const getProductGroups = async (request: FastifyRequest, reply: FastifyReply) => {
  const groups = await db.select().from(productGroups).orderBy(asc(productGroups.sortOrder));
  return reply.send({ groups });
};

export const createProductGroup = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const [group] = await db.insert(productGroups).values({
    name: body.name,
    slug,
    description: body.description || null,
    sortOrder: body.sortOrder || 0,
    isVisible: body.isVisible ?? true,
  }).returning();

  return reply.code(201).send({ group });
};

export const updateProductGroup = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { id } = (request.params as any);
  const body = (request.body as any) as any;

  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
  if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;

  const [updated] = await db.update(productGroups).set(updateData).where(eq(productGroups.id, id)).returning();
  if (!updated) throw new AppError(ErrorCodes.NOT_FOUND, 'Product group not found', 404);
  return reply.send({ group: updated });
};

export const deleteProductGroup = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(productGroups).where(eq(productGroups.id, (request.params as any).id));
  return reply.send({ success: true });
};

// ============================================================================
// ADMIN - PRODUCT PRICES
// ============================================================================

export const upsertProductPrice = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const { id: productId } = (request.params as any);
  const body = (request.body as any) as any;

  if (body.priceId) {
    const [updated] = await db.update(productPrices).set({
      billingCycle: body.billingCycle,
      setupFee: body.setupFee || '0.00',
      recurringPrice: body.recurringPrice || '0.00',
      currency: body.currency || 'TRY',
      isActive: body.isActive ?? true,
    }).where(eq(productPrices.id, body.priceId)).returning();
    return reply.send({ price: updated });
  } else {
    const [price] = await db.insert(productPrices).values({
      productId,
      billingCycle: body.billingCycle,
      setupFee: body.setupFee || '0.00',
      recurringPrice: body.recurringPrice || '0.00',
      currency: body.currency || 'TRY',
    }).returning();
    return reply.code(201).send({ price });
  }
};

export const deleteProductPrice = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(productPrices).where(eq(productPrices.id, (request.params as any).priceId));
  return reply.send({ success: true });
};

// ============================================================================
// ADMIN - PRODUCT OPTIONS
// ============================================================================

export const createProductOption = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;

  const [option] = await db.insert(productOptions).values({
    productId: (request.params as any).id,
    name: body.name,
    type: body.type || 'select',
    isRequired: body.isRequired ?? false,
    sortOrder: body.sortOrder || 0,
  }).returning();

  if (body.values && Array.isArray(body.values)) {
    for (const val of body.values) {
      await db.insert(productOptionValues).values({
        optionId: option.id,
        label: val.label,
        value: val.value,
        priceModifier: val.priceModifier || '0.00',
        currency: val.currency || 'TRY',
        billingCycle: val.billingCycle || 'monthly',
        isDefault: val.isDefault ?? false,
        sortOrder: val.sortOrder || 0,
      });
    }
  }

  return reply.code(201).send({ option });
};

export const deleteProductOption = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(productOptionValues).where(eq(productOptionValues.optionId, (request.params as any).optionId));
  await db.delete(productOptions).where(eq(productOptions.id, (request.params as any).optionId));
  return reply.send({ success: true });
};

// ============================================================================
// ADMIN - PRODUCT ADDONS
// ============================================================================

export const createProductAddon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  const body = (request.body as any) as any;
  const [addon] = await db.insert(productAddons).values({
    productId: (request.params as any).id,
    name: body.name,
    description: body.description || null,
    price: body.price || '0.00',
    currency: body.currency || 'TRY',
    billingCycle: body.billingCycle || 'monthly',
    isRequired: body.isRequired ?? false,
    sortOrder: body.sortOrder || 0,
  }).returning();
  return reply.code(201).send({ addon });
};

export const deleteProductAddon = async (request: FastifyRequest<any>, reply: FastifyReply) => {
  if ((request as any).userRole !== 'ADMIN') throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  await db.delete(productAddons).where(eq(productAddons.id, (request.params as any).addonId));
  return reply.send({ success: true });
};
