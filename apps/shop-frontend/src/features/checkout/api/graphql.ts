import { gql } from '@apollo/client';

export const SET_ORDER_SHIPPING_ADDRESS = gql`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

export const SET_ORDER_BILLING_ADDRESS = gql`
  mutation SetOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

export const ELIGIBLE_SHIPPING_METHODS = gql`
  query EligibleShippingMethods {
    eligibleShippingMethods {
      id
      priceWithTax
      name
      description
      code
    }
  }
`;

export const SET_ORDER_SHIPPING_METHOD = gql`
  mutation SetOrderShippingMethod($shippingMethodId: ID!) {
    setOrderShippingMethod(shippingMethodId: [$shippingMethodId]) {
      ... on OrderModificationError {
        errorCode
        message
      }

      ... on IneligibleShippingMethodError {
        errorCode
        message
      }

      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;
