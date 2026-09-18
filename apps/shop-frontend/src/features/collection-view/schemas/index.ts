import { z } from 'zod';

export const getCollectionViewWithProductsInputSchema = z.object({
  slug: z.string(),
  page: z.number().int().positive().default(1),
  take: z.int().positive().default(9),
});
