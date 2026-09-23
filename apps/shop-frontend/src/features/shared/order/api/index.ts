import { createServerFn } from '@tanstack/react-start';
import { transitionOrderToStateInputSchema } from '#/features/shared/order/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import { TransitionOrderToStateDocument } from '#/graphql/generated.ts';

export const transitionOrderToState = createServerFn({ method: 'POST' })
  .validator(transitionOrderToStateInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: TransitionOrderToStateDocument,
      variables: {
        state: inputData.state,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (
      data?.transitionOrderToState?.__typename === 'OrderStateTransitionError'
    ) {
      throw new Error(data.transitionOrderToState.message);
    }
  });
