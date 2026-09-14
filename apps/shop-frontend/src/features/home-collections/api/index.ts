import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import { GET_HOME_COLLECTIONS } from './graphql.ts';
import { homeCollectionResponseSchema } from '../schemas';

export const getHomeCollections = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data } = await apolloClient.query({
      query: GET_HOME_COLLECTIONS,
      variables: {
        take: 6,
      },
    });

    const validationResult = homeCollectionResponseSchema.safeParse(data);

    if (!validationResult.success)
      throw new Error('getHomeCollections: Invalid response');

    return validationResult.data.collections.items;
  },
);
