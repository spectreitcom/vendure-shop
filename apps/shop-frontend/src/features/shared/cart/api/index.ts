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
      throw new Error('addItemToCart: Insufficient stock');
    }

    if (data.addItemToOrder.__typename === 'OrderLimitError') {
      throw new Error('addItemToCart: Order limit reached');
    }

    if (data.addItemToOrder.__typename === 'NegativeQuantityError') {
      throw new Error('addItemToCart: Negative quantity');
    }

    if (data.addItemToOrder.__typename === 'OrderModificationError') {
      throw new Error('addItemToCart: Order modification error');
    }

    if (data.addItemToOrder.__typename === 'OrderInterceptorError') {
      throw new Error('addItemToCart: Order interceptor error');
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
      throw new Error('getActiveCart: Error');
    }

    return data.activeOrder;
  },
);
