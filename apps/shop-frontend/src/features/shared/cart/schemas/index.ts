import { z } from 'zod';

export const addItemToCartInputSchema = z.object({
  productVariantId: z.string(),
  quantity: z.int().positive(),
});
