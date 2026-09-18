import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import { GetHomeCollectionsDocument } from '#/graphql/generated.ts';

export const getHomeCollections = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: GetHomeCollectionsDocument,
      variables: {
        take: 6,
      },
    });

    if (!data || error) throw new Error('getHomeCollections: Invalid response');

    return data.collections.items;
  },
);
