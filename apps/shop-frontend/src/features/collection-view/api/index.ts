import { GET_COLLECTION_VIEW_WITH_PRODUCTS } from '#/features/collection-view/api/graphql.ts';
import { createApolloClient } from '#/apollo-client.ts';
import { createServerFn } from '@tanstack/react-start';
import {
  getCollectionViewWithProductsInputSchema,
  getCollectionViewWithProductsResponseSchema,
} from '#/features/collection-view/schemas';

export const getCollectionViewWithProducts = createServerFn({
  method: 'GET',
})
  .validator(getCollectionViewWithProductsInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const skip = (inputData.page - 1) * inputData.take;

    const { data } = await apolloClient.query({
      query: GET_COLLECTION_VIEW_WITH_PRODUCTS,
      variables: {
        slug: inputData.slug,
        take: inputData.take,
        skip,
      },
    });

    const validationResult =
      getCollectionViewWithProductsResponseSchema.safeParse(data);

    if (!validationResult.success) {
      throw new Error(
        'getCollectionViewWithProducts: Invalid Response',
        validationResult.error,
      );
    }

    return validationResult.data.collection;
  });
