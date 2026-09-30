import { createServerFn } from '@tanstack/react-start';
import {
  productVariantRatingByActiveCustomerInputSchema,
  productVariantRatingInputSchema,
  rateProductVariantInputSchema,
} from '#/features/rating/schema';
import { createApolloClient } from '#/apollo-client.ts';
import {
  ProductVariantRatingByActiveCustomerDocument,
  ProductVariantRatingDocument,
  RateProductVariantDocument,
} from '#/graphql/generated.ts';

export const productVariantRating = createServerFn({ method: 'GET' })
  .validator(productVariantRatingInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { error, data } = await apolloClient.query({
      query: ProductVariantRatingDocument,
      variables: {
        productVariantId: inputData.productVariantId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.productVariantRating;
  });

export const rateProductVariant = createServerFn({ method: 'POST' })
  .validator(rateProductVariantInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: RateProductVariantDocument,
      variables: {
        productVariantId: inputData.productVariantId,
        rating: inputData.rating,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.rateProductVariant.__typename === 'ProductVariantNotExistError') {
      throw new Error(data.rateProductVariant.message);
    }

    if (
      data?.rateProductVariant.__typename === 'ProductVariantNotPurchasedError'
    ) {
      throw new Error(data.rateProductVariant.message);
    }

    if (data?.rateProductVariant.__typename === 'RatingValidationError') {
      throw new Error(data.rateProductVariant.message);
    }
  });

export const productVariantRatingByActiveCustomer = createServerFn({
  method: 'GET',
})
  .validator(productVariantRatingByActiveCustomerInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: ProductVariantRatingByActiveCustomerDocument,
      variables: {
        productVariantId: inputData.productVariantId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.productVariantRatingByActiveCustomer;
  });
