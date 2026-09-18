import { gql } from '@apollo/client';

export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
      }

      ... on ErrorResult {
        errorCode
        message
      }

      ... on InsufficientStockError {
        quantityAvailable
        errorCode
        message
      }

      ... on OrderInterceptorError {
        errorCode
        message
      }

      ... on NegativeQuantityError {
        errorCode
        message
      }

      ... on OrderModificationError {
        errorCode
        message
      }

      ... on OrderLimitError {
        errorCode
        message
      }
    }
  }
`;

export const GET_ACTIVE_CART = gql`
  query GetActiveCart {
    activeOrder {
      id
      totalWithTax
      totalQuantity
      currencyCode
      lines {
        id
        quantity
        linePriceWithTax
        proratedLinePriceWithTax
        featuredAsset {
          preview
        }
        productVariant {
          name
        }
      }
      discounts {
        amountWithTax
        description
        type
      }
      promotions {
        id
        name
        couponCode
      }
    }
  }
`;
