import { gql } from '@apollo/client';

export const ACTIVE_CUSTOMER_FAVORITE_PRODUCTS = gql`
  query ActiveCustomerFavoriteProducts($skip: Int, $take: Int) {
    activeCustomerFavoriteProducts(options: { skip: $skip, take: $take }) {
      items {
        id
        productVariantId
        productVariant {
          id
          languageCode
          featuredAsset {
            preview
          }
          product {
            featuredAsset {
              preview
            }
          }
          priceWithTax
          name
          currencyCode
        }
      }
      totalItems
    }
  }
`;

export const ADD_FAVORITE_PRODUCT = gql`
  mutation AddFavoriteProduct($productVariantId: ID!) {
    addFavoriteProduct(productVariantId: $productVariantId) {
      id
    }
  }
`;

export const REMOVE_FAVORITE_PRODUCT = gql`
  mutation RemoveFavoriteProduct($productVariantId: ID!) {
    removeFavoriteProduct(productVariantId: $productVariantId)
  }
`;

export const IS_FAVORITE_PRODUCT = gql`
  query IsFavoriteProduct($productVariantId: ID!) {
    isFavoriteProduct(productVariantId: $productVariantId)
  }
`;
