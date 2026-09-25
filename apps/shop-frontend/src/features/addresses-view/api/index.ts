import { ADDRESS_COUNTRIES } from './graphql';
import { createServerFn } from '@tanstack/react-start';
import { createApolloClient } from '#/apollo-client.ts';
import {
  AddressesDocument,
  CreateCustomerAddressDocument,
  UpdateCustomerAddressDocument,
} from '#/graphql/generated.ts';
import { addNewAddressFormSchema, updateCustomerAddressInput } from '../schema';

export const getAddresses = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: AddressesDocument,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.activeCustomer?.addresses;
  },
);

export const createCustomerAddress = createServerFn({ method: 'POST' })
  .validator(addNewAddressFormSchema)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { error } = await apolloClient.mutate({
      mutation: CreateCustomerAddressDocument,
      variables: {
        input: {
          ...inputData,
          customFields: undefined,
          province: '',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });

export const updateCustomerAddress = createServerFn({ method: 'POST' })
  .validator(updateCustomerAddressInput)
  .handler(async ({ data: inputData }) => {
    const apolloClient = createApolloClient();

    const { error } = await apolloClient.mutate({
      mutation: UpdateCustomerAddressDocument,
      variables: {
        input: {
          ...inputData,
          customFields: undefined,
          province: '',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });

export const getAddressCountries = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { data, error } = await createApolloClient().query<{
      availableCountries: Array<{ code: string; name: string }>;
    }>({ query: ADDRESS_COUNTRIES });
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Could not load countries');
    return data.availableCountries;
  },
);
