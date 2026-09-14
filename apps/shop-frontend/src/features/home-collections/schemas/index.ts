import { z } from 'zod';

export const homeCollectionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  featuredAsset: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      source: z.url(),
    })
    .nullable(),
});

export type HomeCollectionItem = z.infer<typeof homeCollectionItemSchema>;

export const homeCollectionResponseSchema = z.object({
  collections: z.object({
    items: z.array(homeCollectionItemSchema),
  }),
});
