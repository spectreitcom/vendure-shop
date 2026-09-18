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
      fetch: async (uri, options) => {
        let incomingCookie: string | undefined = undefined;

        if (import.meta.env.SSR) {
          const { getRequestHeader } =
            await import('@tanstack/react-start/server');
          incomingCookie = getRequestHeader('cookie');
        }

        const response = await fetch(uri, {
          ...options,
          headers: {
            ...options?.headers,
            ...(incomingCookie ? { cookie: incomingCookie } : {}),
          },
        });

        if (import.meta.env.SSR) {
          const { setResponseHeader } =
            await import('@tanstack/react-start/server');
          const responseCookie = response.headers.getSetCookie();
          if (responseCookie.length) {
            setResponseHeader('set-cookie', responseCookie);
          }
        }
        return response;
      },
    }),
  });
}
