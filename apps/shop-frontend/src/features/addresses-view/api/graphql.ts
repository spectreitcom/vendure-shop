import { gql } from '@apollo/client';

export const ADDRESSES = gql`
  query Addresses {
    activeCustomer {
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        country {
          id
          name
          code
        }
        postalCode
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      ... on Address {
        id
      }
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      ... on Address {
        id
      }
    }
  }
`;

export const ADDRESS_COUNTRIES = gql`
  query AddressCountries {
    availableCountries {
      code
      name
    }
  }
`;
