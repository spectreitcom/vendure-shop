import { createServerFn } from '@tanstack/react-start';
import { addItemToCartInputSchema } from '#/features/shared/cart/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import {
  AddItemToOrderDocument,
  GetActiveCartDocument,
} from '#/graphql/generated.ts';

export const addItemToCart = createServerFn({ method: 'POST' })
  .validator(addItemToCartInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: AddItemToOrderDocument,
      variables: {
        productVariantId: inputData.productVariantId,
        quantity: inputData.quantity,
      },
    });

    if (error || !data) {
      throw new Error('addItemToCart: Error');
    }

    if (data.addItemToOrder.__typename === 'InsufficientStockError') {
      throw new Error(data.addItemToOrder.message);
    }

    if (data.addItemToOrder.__typename === 'OrderLimitError') {
      throw new Error(data.addItemToOrder.message);
    }

    if (data.addItemToOrder.__typename === 'NegativeQuantityError') {
      throw new Error(data.addItemToOrder.message);
    }

    if (data.addItemToOrder.__typename === 'OrderModificationError') {
      throw new Error(data.addItemToOrder.message);
    }

    if (data.addItemToOrder.__typename === 'OrderInterceptorError') {
      throw new Error(data.addItemToOrder.message);
    }

    return data.addItemToOrder;
  });

export const getActiveCart = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: GetActiveCartDocument,
    });

    if (error || !data) {
      throw new Error(error?.message);
    }

    if (!data.activeOrder) return null;

    return {
      ...data.activeOrder,
      shippingAddress: !data.activeOrder.shippingAddress
        ? null
        : {
            ...data.activeOrder.shippingAddress,
            customFields: {
              ...(data.activeOrder.shippingAddress.customFields as Record<
                string,
                string | number | boolean | undefined
              >),
            },
          },
    };
  },
);
