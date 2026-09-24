import { createApolloClient } from '#/apollo-client.ts';
import { createServerFn } from '@tanstack/react-start';
import {
  getCollectionInputSchema,
  getCollectionProductsInputSchema,
} from '#/features/collection-view/schemas';
import {
  CollectionProductsDocument,
  FacetsDocument,
  GetCollectionDocument,
} from '#/graphql/generated.ts';

export const getCollection = createServerFn({
  method: 'GET',
})
  .validator(getCollectionInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: GetCollectionDocument,
      variables: {
        slug: inputData.slug,
      },
    });

    if (!data || error) {
      throw new Error('getCollectionViewWithProducts: Invalid Response');
    }

    return data.collection;
  });

export const getFacets = createServerFn({ method: 'GET' }).handler(async () => {
  const apolloClient = createApolloClient();

  const { data, error } = await apolloClient.query({
    query: FacetsDocument,
  });

  if (error) throw new Error(error.name);

  return data?.facets.items ?? [];
});

export const getCollectionProducts = createServerFn({ method: 'GET' })
  .validator(getCollectionProductsInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const skip = (inputData.page - 1) * inputData.take;

    const { data, error } = await apolloClient.query({
      query: CollectionProductsDocument,
      variables: {
        collectionSlug: inputData.collectionSlug,
        take: inputData.take,
        skip,
        facetValueFilters: inputData.facetValueFilters ?? [],
      },
    });

    if (error) throw new Error(error.message);

    return data?.search;
  });
