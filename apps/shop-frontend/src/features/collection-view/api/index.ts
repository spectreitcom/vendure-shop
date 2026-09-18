import { createApolloClient } from '#/apollo-client.ts';
import { createServerFn } from '@tanstack/react-start';
import { getCollectionViewWithProductsInputSchema } from '#/features/collection-view/schemas';
import { GetCollectionViewWithProductsDocument } from '#/graphql/generated.ts';

export const getCollectionViewWithProducts = createServerFn({
  method: 'GET',
})
  .validator(getCollectionViewWithProductsInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const skip = (inputData.page - 1) * inputData.take;

    const { data, error } = await apolloClient.query({
      query: GetCollectionViewWithProductsDocument,
      variables: {
        slug: inputData.slug,
        take: inputData.take,
        skip,
      },
    });

    if (!data || error) {
      throw new Error('getCollectionViewWithProducts: Invalid Response');
    }

    return data.collection;
  });
