import { createServerFn } from '@tanstack/react-start';
import { getOrderInputSchema } from '../schema';
import { createApolloClient } from '#/apollo-client.ts';
import { OrderDocument } from '#/graphql/generated.ts';
import { setResponseHeader } from '@tanstack/react-start/server';

export const getOrder = createServerFn({ method: 'GET' })
  .validator(getOrderInputSchema)
  .handler(async ({ data: inputData }) => {
    setResponseHeader('Cache-Control', 'private, no-store');
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: OrderDocument,
      variables: { id: inputData.id },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.order) return null;

    return {
      ...data.order,
      shippingAddress: !data.order.shippingAddress
        ? null
        : {
            ...data.order.shippingAddress,
            customFields: {
              ...(data.order.shippingAddress.customFields as Record<
                string,
                string | number | boolean | undefined
              >),
            },
          },
    };
  });
