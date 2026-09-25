import { gql } from '@apollo/client';

export const ORDER = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      createdAt
      orderPlacedAt
      code
      state
      fulfillments {
        id
        createdAt
        state
        method
        trackingCode
      }
      subTotalWithTax
      shippingWithTax
      totalWithTax
      currencyCode
      lines {
        id
        productVariant {
          name
          sku
        }
        featuredAsset {
          preview
        }
        proratedLinePriceWithTax
        linePriceWithTax
        unitPriceWithTax
        quantity
        discountedUnitPriceWithTax
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        postalCode
        country
        phoneNumber
        customFields
      }
      billingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        postalCode
        country
        phoneNumber
      }
    }
  }
`;
