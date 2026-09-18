import { createServerFn } from '@tanstack/react-start';
import { getProductDetailsViewInputSchema } from '#/features/product-view/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import { GetProductDetailsViewDocument } from '#/graphql/generated.ts';

export const getProductDetailsView = createServerFn({ method: 'GET' })
  .validator(getProductDetailsViewInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: GetProductDetailsViewDocument,
      variables: {
        slug: inputData.slug,
      },
    });

    if (error || !data)
      throw new Error('getProductDetailsView: Invalid Response');

    return data.product;
  });
