import { gql } from '@apollo/client';

export const ORDERS = gql`
  query Orders($take: Int!, $skip: Int!) {
    activeCustomer {
      id
      orders(
        options: {
          take: $take
          skip: $skip
          sort: { createdAt: DESC }
          filter: { active: { eq: false } }
        }
      ) {
        items {
          id
          createdAt
          orderPlacedAt
          code
          state
          currencyCode
          totalWithTax
        }
        totalItems
      }
    }
  }
`;
