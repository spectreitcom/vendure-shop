import { createServerFn } from '@tanstack/react-start';
import {
  addFavoriteProductInputSchema,
  getActiveCustomerFavoriteProductsInputSchema,
  isFavoriteProductInputSchema,
} from '#/features/favorite-products/schema';
import { createApolloClient } from '#/apollo-client.ts';
import {
  ActiveCustomerFavoriteProductsDocument,
  AddFavoriteProductDocument,
  IsFavoriteProductDocument,
  RemoveFavoriteProductDocument,
} from '#/graphql/generated.ts';

export const getActiveCustomerFavoriteProducts = createServerFn({
  method: 'GET',
})
  .validator(getActiveCustomerFavoriteProductsInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const skip = inputData.take * (inputData.page - 1);

    const { data, error } = await apolloClient.query({
      query: ActiveCustomerFavoriteProductsDocument,
      variables: {
        skip,
        take: inputData.take,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.activeCustomerFavoriteProducts;
  });

export const addFavoriteProduct = createServerFn({ method: 'POST' })
  .validator(addFavoriteProductInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { error } = await apolloClient.mutate({
      mutation: AddFavoriteProductDocument,
      variables: {
        productVariantId: inputData.productVariantId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });

export const removeFavoriteProduct = createServerFn({ method: 'POST' })
  .validator(addFavoriteProductInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { error } = await apolloClient.mutate({
      mutation: RemoveFavoriteProductDocument,
      variables: {
        productVariantId: inputData.productVariantId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });

export const isFavoriteProduct = createServerFn({ method: 'GET' })
  .validator(isFavoriteProductInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: IsFavoriteProductDocument,
      variables: {
        productVariantId: inputData.productVariantId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.isFavoriteProduct;
  });
