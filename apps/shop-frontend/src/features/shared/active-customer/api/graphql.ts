import { gql } from '@apollo/client';

export const ACTIVE_CUSTOMER = gql`
  query ActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          id
          code
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;