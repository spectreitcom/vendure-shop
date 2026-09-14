import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { getContext } from './integrations/tanstack-query/root-provider';
import { routerWithApolloClient } from '@apollo/client-integration-tanstack-start';
import { createApolloClient } from '#/apollo-client.ts';

export function getRouter() {
  const context = getContext();

  const apolloClient = createApolloClient();

  const router = createTanStackRouter({
    routeTree,
    context: {
      ...routerWithApolloClient.defaultContext,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

  return routerWithApolloClient(router, apolloClient);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
