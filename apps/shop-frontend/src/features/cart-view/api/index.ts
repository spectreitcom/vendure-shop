import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import {
  adjustCartLineInputSchema,
  applyOrRemoveCouponCodeInputSchema,
  removeCartLineInputSchema,
} from '#/features/cart-view/schemas';
import {
  AdjustOrderLineDocument,
  ApplyCouponCodeDocument,
  RemoveCouponCodeDocument,
  RemoveOrderLineDocument,
} from '#/graphql/generated.ts';

export const removeCartLine = createServerFn({ method: 'POST' })
  .validator(removeCartLineInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: RemoveOrderLineDocument,
      variables: {
        orderLineId: inputData.orderLineId,
      },
    });

    if (error || !data) {
      throw new Error(`removeCartLine: Invalid Response`);
    }

    if (data.removeOrderLine.__typename === 'OrderModificationError') {
      throw new Error(`removeCartLine: ${data.removeOrderLine.message}`);
    }

    if (data.removeOrderLine.__typename === 'OrderInterceptorError') {
      throw new Error(`removeCartLine: ${data.removeOrderLine.message}`);
    }

    return data.removeOrderLine.id;
  });

export const adjustCartLine = createServerFn({ method: 'POST' })
  .validator(adjustCartLineInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: AdjustOrderLineDocument,
      variables: {
        orderLineId: inputData.orderLineId,
        quantity: inputData.quantity,
      },
    });

    if (error || !data) {
      throw new Error(`adjustCartLine: Invalid Response`);
    }

    if (data.adjustOrderLine.__typename === 'InsufficientStockError') {
      throw new Error(`adjustCartLine: ${data.adjustOrderLine.message}`);
    }

    if (data.adjustOrderLine.__typename === 'OrderLimitError') {
      throw new Error(`adjustCartLine: ${data.adjustOrderLine.message}`);
    }

    if (data.adjustOrderLine.__typename === 'OrderInterceptorError') {
      throw new Error(`adjustCartLine: ${data.adjustOrderLine.message}`);
    }

    if (data.adjustOrderLine.__typename === 'NegativeQuantityError') {
      throw new Error(`adjustCartLine: ${data.adjustOrderLine.message}`);
    }

    if (data.adjustOrderLine.__typename === 'OrderModificationError') {
      throw new Error(`adjustCartLine: ${data.adjustOrderLine.message}`);
    }

    return data.adjustOrderLine.id;
  });

export const applyCouponCode = createServerFn({ method: 'POST' })
  .validator(applyOrRemoveCouponCodeInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: ApplyCouponCodeDocument,
      variables: {
        couponCode: inputData.couponCode,
      },
    });

    if (error || !data) {
      throw new Error(`applyCouponCode: Invalid Response`);
    }

    if (data.applyCouponCode.__typename === 'CouponCodeExpiredError') {
      throw new Error(`applyCouponCode: ${data.applyCouponCode.message}`);
    }

    if (data.applyCouponCode.__typename === 'CouponCodeInvalidError') {
      throw new Error(`applyCouponCode: ${data.applyCouponCode.message}`);
    }

    if (data.applyCouponCode.__typename === 'CouponCodeLimitError') {
      throw new Error(`applyCouponCode: ${data.applyCouponCode.message}`);
    }

    return data.applyCouponCode.id;
  });

export const removeCouponCode = createServerFn({ method: 'POST' })
  .validator(applyOrRemoveCouponCodeInputSchema)
  .handler(async ({ data: inputSchema }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: RemoveCouponCodeDocument,
      variables: {
        couponCode: inputSchema.couponCode,
      },
    });

    if (error || !data) {
      throw new Error(`removeCouponCode: Invalid Response`);
    }
  });
