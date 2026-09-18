import type { GetCollectionViewWithProductsQuery } from '#/graphql/generated.ts';

export type CollectionProduct = NonNullable<
  GetCollectionViewWithProductsQuery['collection']
>['productVariants']['items'][number];