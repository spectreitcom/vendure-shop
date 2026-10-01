import gql from "graphql-tag";

export const productRatingAdminApiExtensions = gql`
  """
  Represents a product variant rating based on channel
  """
  type ProductRating implements Node {
    id: ID!
    productVariantId: ID!
    productVariant: ProductVariant!
    average: Float!
    votes: Int!
    channelId: ID!
    channel: Channel!
  }

  extend type Query {
    """
    Returns a product variant rating
    """
    productVariantRating(productVariantId: ID!): ProductRating
  }
`;
