import { gql } from '@apollo/client';

export const GET_HOME_COLLECTIONS = gql`
  query ($take: Int) {
    collections(options: { take: $take, topLevelOnly: true }) {
      items {
        id
        name
        slug
        featuredAsset {
          width
          height
          source
        }
      }
    }
  }
`;
