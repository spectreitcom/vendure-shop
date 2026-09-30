import { gql } from '@apollo/client';

export const PRODUCT_VARIANT_RATING = gql`
  query ProductVariantRating($productVariantId: ID!) {
    productVariantRating(productVariantId: $productVariantId) {
      id
      average
      votes
    }
  }
`;

export const RATE_PRODUCT_VARIANT = gql`
  mutation RateProductVariant($productVariantId: ID!, $rating: Int!) {
    rateProductVariant(productVariantId: $productVariantId, rating: $rating) {
      ... on Success {
        success
      }

      ... on ProductVariantNotExistError {
        errorCode
        message
      }

      ... on ProductVariantNotPurchasedError {
        errorCode
        message
      }

      ... on RatingValidationError {
        errorCode
        message
      }
    }
  }
`;

export const PRODUCT_VARIANT_RATING_BY_ACTIVE_CUSTOMER = gql`
  query ProductVariantRatingByActiveCustomer($productVariantId: ID!) {
    productVariantRatingByActiveCustomer(productVariantId: $productVariantId) {
      rating
    }
  }
`;
