import type { GetHomeCollectionsQuery } from '#/graphql/generated.ts';

export type HomeCollectionItem =
  GetHomeCollectionsQuery['collections']['items'][number];
