import { z } from 'zod';

export const getCollectionViewWithProductsInputSchema = z.object({
  slug: z.string(),
  page: z.number().int().positive().default(1),
  take: z.int().positive().default(9),
});

export const getCollectionViewWithProductsResponseSchema = z.object({
  collection: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    featuredAsset: z
      .object({
        preview: z.url(),
      })
      .nullable(),
    productVariants: z.object({
      items: z.array(
        z.object({
          id: z.string(),
          priceWithTax: z.int(),
          name: z.string(),
          currencyCode: z.string(),
          product: z.object({
            id: z.string(),
            slug: z.string(),
            featuredAsset: z
              .object({
                preview: z.url(),
              })
              .nullable(),
          }),
        }),
      ),
      totalItems: z.int(),
    }),
  }),
});

export type CollectionProduct = z.infer<
  typeof getCollectionViewWithProductsResponseSchema
>['collection']['productVariants']['items'][0];
