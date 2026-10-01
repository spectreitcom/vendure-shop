import { z } from 'zod';

export const productVariantRatingInputSchema = z.object({
  productVariantId: z.string().min(1),
});

export const rateProductVariantInputSchema = z.object({
  productVariantId: z.string().min(1),
  rating: z.int().positive().min(1).max(5),
});

export const productVariantRatingByActiveCustomerInputSchema = z.object({
  productVariantId: z.string().min(1),
});
