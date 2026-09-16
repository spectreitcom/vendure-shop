import { z } from 'zod';

export const getProductDetailsViewInputSchema = z.object({
  slug: z.string(),
});

export const getProductDetailsViewResponseSchema = z.object({
  product: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    featuredAsset: z
      .object({
        preview: z.string(),
      })
      .nullable(),
    description: z.string(),
    variants: z.array(
      z.object({
        id: z.string(),
        currencyCode: z.string(),
        priceWithTax: z.int(),
      }),
    ),
  }),
});
