import { z } from 'zod';

export const getProductDetailsViewInputSchema = z.object({
  slug: z.string(),
});

export const productDetailsViewSearchSchema = z.object({
  productVariantId: z.string().min(1),
});
