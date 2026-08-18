import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, asc, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { products, productPrices } from '../db/schema.js';
import { logAdminAction } from '../services/auditService.js';
import { sendError, Errors } from '../lib/errors.js';

export const listProducts = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const type = (request.query as any).type;
        
        const productsList = await db.query.products.findMany({
            where: type ? eq(products.type, type) : undefined,
            orderBy: [asc(products.sortOrder), desc(products.createdAt)],
            with: {
                prices: true,
                group: true,
            }
        });
        
        reply.send({ success: true, products: productsList });
    } catch (error) {
        sendError(reply, error);
    }
};

export const createProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { name, slug, description, type, groupId, isVisible, isHidden, isFeatured, features, price } = (request.body as any);
        const adminId = (request as any).userId;

        if (!name || !slug || !type) {
            throw Errors.validation('Name, slug, and type are required');
        }

        const numericPrice = parseFloat(price || '0');
        if (isNaN(numericPrice) || numericPrice < 0) {
            throw Errors.validation('Invalid price format');
        }

        // Insert product
        const [newProduct] = await db.insert(products).values({
            name,
            slug,
            description,
            type,
            groupId: groupId || null,
            isVisible: isVisible !== undefined ? isVisible : true,
            isHidden: isHidden !== undefined ? isHidden : false,
            isFeatured: isFeatured !== undefined ? isFeatured : false,
            features: features || {},
        }).returning();

        // Insert price (Monthly, TRY)
        await db.insert(productPrices).values({
            productId: newProduct.id,
            currency: 'TRY',
            billingCycle: 'monthly',
            recurringPrice: numericPrice.toFixed(2),
        });

        await logAdminAction({ adminId, action: 'CREATE_PRODUCT', targetId: newProduct.id, targetType: 'PRODUCT', dataAfter: newProduct });

        const fullProduct = await db.query.products.findFirst({
            where: eq(products.id, newProduct.id),
            with: { prices: true }
        });

        reply.send({ success: true, message: 'Product created successfully', product: fullProduct });
    } catch (error) {
        sendError(reply, error);
    }
};

export const updateProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const updateData = (request.body as any);
        const adminId = (request as any).userId;

        // If price is being updated
        if (updateData.price !== undefined) {
            const numericPrice = parseFloat(updateData.price);
            if (!isNaN(numericPrice) && numericPrice >= 0) {
                // Upsert price (we assume Monthly TRY for now)
                const existingPrice = await db.query.productPrices.findFirst({
                    where: and(eq(productPrices.productId, id), eq(productPrices.billingCycle, 'monthly'))
                });

                if (existingPrice) {
                    await db.update(productPrices)
                        .set({ recurringPrice: numericPrice.toFixed(2) })
                        .where(eq(productPrices.id, existingPrice.id));
                } else {
                    await db.insert(productPrices).values({
                        productId: id,
                        currency: 'TRY',
                        billingCycle: 'monthly',
                        recurringPrice: numericPrice.toFixed(2),
                    });
                }
            }
            delete updateData.price;
        }

        if (Object.keys(updateData).length > 0) {
            await db.update(products).set(updateData).where(eq(products.id, id));
        }

        await logAdminAction({ adminId, action: 'UPDATE_PRODUCT', targetId: id, targetType: 'PRODUCT', dataAfter: updateData });

        const updatedProduct = await db.query.products.findFirst({
            where: eq(products.id, id),
            with: { prices: true }
        });

        reply.send({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        sendError(reply, error);
    }
};

export const deleteProduct = async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
        const { id } = (request.params as any);
        const adminId = (request as any).userId;

        await db.delete(products).where(eq(products.id, id));
        // cascade deletes productPrices automatically due to schema definitions

        await logAdminAction({ adminId, action: 'DELETE_PRODUCT', targetId: id, targetType: 'PRODUCT', dataAfter: null });

        reply.send({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        sendError(reply, error);
    }
};
