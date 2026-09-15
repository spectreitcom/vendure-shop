import { gql } from '@apollo/client';

export const GET_COLLECTION_VIEW_WITH_PRODUCTS = gql`
  query ($slug: String!, $take: Int!, $skip: Int!) {
    collection(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        preview
      }
      productVariants(options: { take: $take, skip: $skip }) {
        items {
          id
          priceWithTax
          name
          currencyCode
          product {
            id
            slug
            featuredAsset {
              preview
            }
          }
        }
        totalItems
      }
    }
  }
`;
