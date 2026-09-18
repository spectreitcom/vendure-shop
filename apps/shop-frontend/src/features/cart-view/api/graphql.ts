import { gql } from '@apollo/client';

export const REMOVE_CART_LINE = gql`
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
      }
      ... on OrderModificationError {
        errorCode
        message
      }

      ... on OrderInterceptorError {
        errorCode
        message
      }
    }
  }
`;

export const ADJUST_CART_LINES = gql`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
      }

      ... on OrderModificationError {
        errorCode
        message
      }

      ... on OrderLimitError {
        errorCode
        message
      }

      ... on NegativeQuantityError {
        errorCode
        message
      }

      ... on InsufficientStockError {
        errorCode
        message
      }

      ... on OrderInterceptorError {
        errorCode
        message
      }
    }
  }
`;

export const APPLY_COUPON_CODE = gql`
  mutation ApplyCouponCode($couponCode: String!) {
    applyCouponCode(couponCode: $couponCode) {
      ... on CouponCodeExpiredError {
        errorCode
        message
      }

      ... on CouponCodeInvalidError {
        errorCode
        message
      }

      ... on CouponCodeLimitError {
        errorCode
        message
      }

      ... on ErrorResult {
        errorCode
        message
      }

      ... on Order {
        id
      }
    }
  }
`;

export const REMOVE_COUPON_CODE = gql`
  mutation RemoveCouponCode($couponCode: String!) {
    removeCouponCode(couponCode: $couponCode) {
      id
    }
  }
`;
