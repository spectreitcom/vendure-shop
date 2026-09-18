import { z } from 'zod';

export const getProductDetailsViewInputSchema = z.object({
  slug: z.string(),
});
