import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import { ActiveCustomerDocument } from '#/graphql/generated.ts';

export const getActiveCustomer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: ActiveCustomerDocument,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data || !data.activeCustomer) return null;

    return data.activeCustomer;
  },
);
