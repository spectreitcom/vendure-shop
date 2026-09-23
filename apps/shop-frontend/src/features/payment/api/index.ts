import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import {
  AddPaymentToOrderDocument,
  EligiblePaymentMethodsDocument,
} from '#/graphql/generated.ts';
import { addPaymentToOrderInputSchema } from '#/features/payment/schemas';

export const getEligiblePaymentMethods = createServerFn({
  method: 'GET',
}).handler(async () => {
  const apolloClient = createApolloClient();

  const { data, error } = await apolloClient.query({
    query: EligiblePaymentMethodsDocument,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.eligiblePaymentMethods ?? [];
});

export const addPaymentMethodToOrder = createServerFn({ method: 'POST' })
  .validator(addPaymentToOrderInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: AddPaymentToOrderDocument,
      variables: {
        input: {
          method: inputData.method,
          metadata: inputData.metadata,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.addPaymentToOrder.__typename === 'OrderPaymentStateError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (data?.addPaymentToOrder.__typename === 'IneligiblePaymentMethodError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (data?.addPaymentToOrder.__typename === 'PaymentFailedError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (data?.addPaymentToOrder.__typename === 'PaymentDeclinedError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (data?.addPaymentToOrder.__typename === 'OrderStateTransitionError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (data?.addPaymentToOrder.__typename === 'NoActiveOrderError') {
      throw new Error(data.addPaymentToOrder.message);
    }

    if (
      data?.addPaymentToOrder.__typename === 'CouponRemovedDuringCheckoutError'
    ) {
      throw new Error(data.addPaymentToOrder.message);
    }
  });
