import { z } from 'zod';

export const getActiveCustomerFavoriteProductsInputSchema = z.object({
  page: z.int().positive().default(1),
  take: z.int().positive().default(10),
});

export const addFavoriteProductInputSchema = z.object({
  productVariantId: z.string().min(1),
});

export const isFavoriteProductInputSchema = z.object({
  productVariantId: z.string().min(1),
});
