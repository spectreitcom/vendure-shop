import { gql } from '@apollo/client';

export const REQUEST_RESET_PASSWORD = gql`
  mutation RequestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ... on PasswordResetTokenInvalidError {
        errorCode
        message
      }

      ... on PasswordResetTokenExpiredError {
        errorCode
        message
      }

      ... on PasswordValidationError {
        errorCode
        message
      }

      ... on NativeAuthStrategyError {
        errorCode
        message
      }

      ... on NotVerifiedError {
        errorCode
        message
      }
    }
  }
`;
