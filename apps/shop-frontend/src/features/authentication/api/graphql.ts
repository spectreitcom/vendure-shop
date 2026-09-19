import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ... on CurrentUser {
        id
      }

      ... on InvalidCredentialsError {
        errorCode
        message
      }

      ... on NotVerifiedError {
        errorCode
        message
      }

      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      identifier
    }
  }
`;

export const verifyCustomerAccount = gql`
  mutation VerifyCustomerAccount($token: String!) {
    verifyCustomerAccount(token: $token) {
      ... on VerificationTokenInvalidError {
        errorCode
        message
      }

      ... on VerificationTokenExpiredError {
        errorCode
        message
      }

      ... on MissingPasswordError {
        message
        errorCode
      }

      ... on PasswordValidationError {
        message
        errorCode
      }

      ... on PasswordAlreadySetError {
        message
        errorCode
      }

      ... on NativeAuthStrategyError {
        message
        errorCode
      }
    }
  }
`;
