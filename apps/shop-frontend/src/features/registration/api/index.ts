import { createServerFn } from '@tanstack/react-start';
import { registerCustomerAccountInputSchema } from '#/features/registration/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import { RegisterCustomerAccountDocument } from '#/graphql/generated.ts';

export const registerCustomerAccount = createServerFn({ method: 'POST' })
  .validator(registerCustomerAccountInputSchema)
  .handler(async ({ data: { emailAddress, password } }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: RegisterCustomerAccountDocument,
      variables: { emailAddress, password },
    });

    if (error || !data) {
      throw new Error('Failed to register customer account');
    }

    if (data.registerCustomerAccount.__typename === 'MissingPasswordError') {
      throw new Error(data.registerCustomerAccount.message);
    }

    if (data.registerCustomerAccount.__typename === 'PasswordValidationError') {
      throw new Error(data.registerCustomerAccount.message);
    }

    if (data.registerCustomerAccount.__typename === 'NativeAuthStrategyError') {
      throw new Error(data.registerCustomerAccount.message);
    }

    return data.registerCustomerAccount;
  });
