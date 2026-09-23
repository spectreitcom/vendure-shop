import { gql } from '@apollo/client';

export const ELIGIBLE_PAYMENT_METHODS = gql`
  query EligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      name
      description
      code
    }
  }
`;

export const ADD_PAYMENT_TO_ORDER = gql`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on OrderPaymentStateError {
        errorCode
        message
      }

      ... on IneligiblePaymentMethodError {
        errorCode
        message
      }

      ... on PaymentFailedError {
        errorCode
        message
      }

      ... on PaymentDeclinedError {
        errorCode
        message
      }

      ... on OrderStateTransitionError {
        errorCode
        message
      }

      ... on NoActiveOrderError {
        errorCode
        message
      }

      ... on CouponRemovedDuringCheckoutError {
        errorCode
        message
      }
    }
  }
`;
