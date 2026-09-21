import { createServerFn } from '@tanstack/react-start';
import {
  setOrderShippingAddressInputSchema,
  setOrderShippingMethodInputSchema,
} from '#/features/checkout/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import {
  EligibleShippingMethodsDocument,
  SetOrderBillingAddressDocument,
  SetOrderShippingAddressDocument,
  SetOrderShippingMethodDocument,
} from '#/graphql/generated.ts';

export const setOrderShippingAddress = createServerFn({ method: 'POST' })
  .validator(setOrderShippingAddressInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: SetOrderShippingAddressDocument,
      variables: {
        input: {
          city: inputData.city,
          company: inputData.company,
          countryCode: inputData.countryCode,
          fullName: inputData.fullName,
          streetLine1: inputData.streetLine1,
          streetLine2: inputData.streetLine2,
          phoneNumber: inputData.phoneNumber,
          postalCode: inputData.postalCode,
          customFields: { needInvoice: inputData.needInvoice },
          province: undefined,
          defaultShippingAddress: undefined,
          defaultBillingAddress: undefined,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.setOrderShippingAddress.__typename === 'NoActiveOrderError') {
      throw new Error(data.setOrderShippingAddress.message);
    }
  });

export const setOrderBillingAddress = createServerFn({ method: 'POST' })
  .validator(setOrderShippingAddressInputSchema.omit({ needInvoice: true }))
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: SetOrderBillingAddressDocument,
      variables: {
        input: {
          city: inputData.city,
          company: inputData.company,
          countryCode: inputData.countryCode,
          fullName: inputData.fullName,
          streetLine1: inputData.streetLine1,
          streetLine2: inputData.streetLine2,
          phoneNumber: inputData.phoneNumber,
          postalCode: inputData.postalCode,
          customFields: undefined,
          province: undefined,
          defaultShippingAddress: undefined,
          defaultBillingAddress: undefined,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.setOrderBillingAddress.__typename === 'NoActiveOrderError') {
      throw new Error(data.setOrderBillingAddress.message);
    }
  });

export const getEligibleShippingMethods = createServerFn({
  method: 'GET',
}).handler(async () => {
  const apolloClient = createApolloClient();

  const { error, data } = await apolloClient.query({
    query: EligibleShippingMethodsDocument,
  });

  if (error) throw new Error(error.message);

  if (!data) throw new Error('No data returned from query');

  return data.eligibleShippingMethods;
});

export const setOrderShippingMethod = createServerFn({ method: 'POST' })
  .validator(setOrderShippingMethodInputSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: SetOrderShippingMethodDocument,
      variables: {
        shippingMethodId: inputData.shippingMethodId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.setOrderShippingMethod.__typename === 'OrderModificationError') {
      throw new Error(data.setOrderShippingMethod.message);
    }

    if (
      data?.setOrderShippingMethod.__typename ===
      'IneligibleShippingMethodError'
    ) {
      throw new Error(data.setOrderShippingMethod.message);
    }

    if (data?.setOrderShippingMethod.__typename === 'NoActiveOrderError') {
      throw new Error(data.setOrderShippingMethod.message);
    }
  });
