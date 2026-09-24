import { gql } from '@apollo/client';

export const GET_COLLECTION = gql`
  query GetCollection($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        preview
      }
    }
  }
`;

export const FACETS = gql`
  query Facets {
    facets {
      items {
        id
        name
        values {
          id
          name
          code
        }
      }
    }
  }
`;

export const COLLECTION_PRODUCTS = gql`
  query CollectionProducts(
    $collectionSlug: String!
    $take: Int!
    $skip: Int!
    $facetValueFilters: [FacetValueFilterInput!]
  ) {
    search(
      input: {
        collectionSlug: $collectionSlug
        take: $take
        skip: $skip
        facetValueFilters: $facetValueFilters
      }
    ) {
      items {
        productName
        sku
        slug
        productId
        productVariantId
        currencyCode
        productAsset {
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            value
          }
        }
      }
      totalItems
    }
  }
`;
