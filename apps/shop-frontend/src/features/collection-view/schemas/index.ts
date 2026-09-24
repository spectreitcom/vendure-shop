import { z } from 'zod';

export const getCollectionInputSchema = z.object({
  slug: z.string(),
});

export const getCollectionProductsInputSchema = z.object({
  collectionSlug: z.string().min(1),
  take: z.number().int().max(100).positive().default(9),
  page: z.number().int().positive().default(1),
  facetValueFilters: z
    .array(
      z.object({
        and: z.string(),
        or: z.array(z.string()),
      }),
    )
    .optional(),
});

export const validateSearchSchema = z.object({
  page: z.int().positive().optional().default(1),
  facetValues: z.string().optional(),
});
