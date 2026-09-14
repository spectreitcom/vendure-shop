import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-tanstack-start';
import { HttpLink } from '@apollo/client';
import { env } from '#/env.ts';

function getShopApiUrl() {
  if (import.meta.env.SSR) {
    return env.SHOP_API_URL;
  }

  return env.VITE_SHOP_API_URL;
}

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),

    link: new HttpLink({
      uri: getShopApiUrl(),
      credentials: 'include',
    }),
  });
}
