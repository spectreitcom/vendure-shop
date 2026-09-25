import { createServerFn } from '@tanstack/react-start';
import { getOrdersInputSchema } from '#/features/orders-view/schema';
import { createApolloClient } from '#/apollo-client.ts';
import { OrdersDocument } from '#/graphql/generated.ts';

export const getOrders = createServerFn({ method: 'GET' })
  .validator(getOrdersInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const skip = inputData.take * (inputData.page - 1);

    const { data, error } = await apolloClient.query({
      query: OrdersDocument,
      variables: {
        skip,
        take: inputData.take,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.activeCustomer?.orders;
  });
