import { createServerFn } from '@tanstack/react-start';
import {
  requestResetPasswordInputSchema,
  resetPasswordInputSchema,
} from '#/features/reset-password/schemas';
import { createApolloClient } from '#/apollo-client.ts';
import {
  RequestPasswordResetDocument,
  ResetPasswordDocument,
} from '#/graphql/generated.ts';

export const requestResetPassword = createServerFn({ method: 'POST' })
  .validator(requestResetPasswordInputSchema)
  .handler(async ({ data: { emailAddress } }) => {
    const apolloClient = createApolloClient();
    const { error, data } = await apolloClient.mutate({
      mutation: RequestPasswordResetDocument,
      variables: { emailAddress },
    });

    if (
      !data ||
      error ||
      data.requestPasswordReset?.__typename === 'NativeAuthStrategyError'
    ) {
      throw new Error('Failed to request password reset');
    }
  });

export const resetPassword = createServerFn({ method: 'POST' })
  .validator(resetPasswordInputSchema)
  .handler(async ({ data: { token, password } }) => {
    const apolloClient = createApolloClient();

    const { data, error } = await apolloClient.mutate({
      mutation: ResetPasswordDocument,
      variables: { token, password },
    });

    if (!data || error) {
      throw new Error('Failed to reset password');
    }

    if (data.resetPassword.__typename === 'PasswordResetTokenInvalidError') {
      throw new Error(data.resetPassword.message);
    }

    if (data.resetPassword.__typename === 'PasswordResetTokenExpiredError') {
      throw new Error(data.resetPassword.message);
    }

    if (data.resetPassword.__typename === 'PasswordValidationError') {
      throw new Error(data.resetPassword.message);
    }

    if (data.resetPassword.__typename === 'NativeAuthStrategyError') {
      throw new Error(data.resetPassword.message);
    }

    if (data.resetPassword.__typename === 'NotVerifiedError') {
      throw new Error(data.resetPassword.message);
    }
  });
