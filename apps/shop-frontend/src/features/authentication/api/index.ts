import { createServerFn } from '@tanstack/react-start';
import {
  loginInputSchema,
  verifyCustomerAccountInputSchema,
} from '#/features/authentication/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import {
  LoginDocument,
  MeDocument,
  VerifyCustomerAccountDocument,
} from '#/graphql/generated.ts';

export const login = createServerFn({ method: 'POST' })
  .validator(loginInputSchema)
  .handler(async ({ data: { username, password } }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: LoginDocument,
      variables: {
        username,
        password,
      },
    });

    if (error || !data) {
      throw new Error('Login failed');
    }

    if (data.login.__typename === 'InvalidCredentialsError') {
      throw new Error(data.login.message);
    }

    if (data.login.__typename === 'NotVerifiedError') {
      throw new Error(data.login.message);
    }

    if (data.login.__typename === 'NativeAuthStrategyError') {
      throw new Error(data.login.message);
    }

    return data.login.id;
  });

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.query({
      query: MeDocument,
    });

    if (error) throw new Error('Failed to fetch current user');

    return data?.me;
  },
);

export const verifyCustomerAccount = createServerFn({ method: 'POST' })
  .validator(verifyCustomerAccountInputSchema)
  .handler(async ({ data: { token } }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: VerifyCustomerAccountDocument,
      variables: {
        token,
      },
    });

    if (error || !data) throw new Error('Failed to verify customer account');

    if (
      data.verifyCustomerAccount.__typename === 'VerificationTokenInvalidError'
    ) {
      throw new Error(data.verifyCustomerAccount.message);
    }

    if (
      data.verifyCustomerAccount.__typename === 'VerificationTokenExpiredError'
    ) {
      throw new Error(data.verifyCustomerAccount.message);
    }

    if (data.verifyCustomerAccount.__typename === 'MissingPasswordError') {
      throw new Error(data.verifyCustomerAccount.message);
    }

    if (data.verifyCustomerAccount.__typename === 'PasswordValidationError') {
      throw new Error(data.verifyCustomerAccount.message);
    }

    if (data.verifyCustomerAccount.__typename === 'PasswordAlreadySetError') {
      throw new Error(data.verifyCustomerAccount.message);
    }

    if (data.verifyCustomerAccount.__typename === 'NativeAuthStrategyError') {
      throw new Error(data.verifyCustomerAccount.message);
    }
  });
