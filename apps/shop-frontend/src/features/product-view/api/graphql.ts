import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAILS_VIEW = gql`
  query GetProductDetailsView($slug: String!) {
    product(slug: $slug) {
      id
      slug
      name
      featuredAsset {
        preview
      }
      description
      variants {
        id
        currencyCode
        priceWithTax
      }
    }
  }
`;
