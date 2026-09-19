import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import { LogoutDocument } from '#/graphql/generated.ts';

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const apolloClient = createApolloClient();
  await apolloClient.mutate({ mutation: LogoutDocument });
});
