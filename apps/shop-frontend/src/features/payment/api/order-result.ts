import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { createApolloClient } from '#/apollo-client';
import type { CurrencyCode } from '#/graphql/generated';

type OrderResult = {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  currencyCode: CurrencyCode;
};
const orderResultQuery: TypedDocumentNode<
  { order: OrderResult | null },
  { id: string }
> = gql`
  query PaymentOrderResult($id: ID!) {
    order(id: $id) {
      id
      code
      state
      totalWithTax
      currencyCode
    }
  }
`;

export const getPaymentOrderResult = createServerFn({ method: 'GET' })
  .validator(z.object({ orderId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const result = await createApolloClient().query({
      query: orderResultQuery,
      variables: { id: data.orderId },
      fetchPolicy: 'network-only',
    });
    if (result.error) throw new Error('Unable to check the order status.');
    return result.data?.order ?? null;
  });
