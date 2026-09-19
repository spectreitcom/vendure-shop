import { gql } from '@apollo/client';

export const REGISTER_CUSTOMER_ACCOUNT = gql`
  mutation RegisterCustomerAccount($emailAddress: String!, $password: String!) {
    registerCustomerAccount(
      input: { emailAddress: $emailAddress, password: $password }
    ) {
      ... on Success {
        success
      }

      ... on MissingPasswordError {
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
    }
  }
`;
