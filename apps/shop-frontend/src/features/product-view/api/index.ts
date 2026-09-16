import { createServerFn } from '@tanstack/react-start';
import {
  getProductDetailsViewInputSchema,
  getProductDetailsViewResponseSchema,
} from '#/features/product-view/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import { GET_PRODUCT_DETAILS_VIEW } from '#/features/product-view/api/graphql.ts';

export const getProductDetailsView = createServerFn({ method: 'GET' })
  .validator(getProductDetailsViewInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_DETAILS_VIEW,
      variables: {
        slug: inputData.slug,
      },
    });

    const validationResult =
      getProductDetailsViewResponseSchema.safeParse(data);

    if (!validationResult.success)
      throw new Error('getProductDetailsView: Invalid Response');

    return validationResult.data.product;
  });
