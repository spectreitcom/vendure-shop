import gql from "graphql-tag";

export const productRatingShopApiExtensions = gql`
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

  """
  Represents a product variant rating based on channel and customer
  """
  type ProductRatingBoughtProductVariant implements Node {
    id: ID!
    productVariantId: ID!
    productVariant: ProductVariant!
    channelId: ID!
    channel: Channel!
    rating: Int!
  }

  extend type Query {
    """
    Returns a product variant rating
    """
    productVariantRating(productVariantId: ID!): ProductRating

    """
    Returns a product variant rating based on channel and active customer
    """
    productVariantRatingByActiveCustomer(
      productVariantId: ID!
    ): ProductRatingBoughtProductVariant
  }

  """
  Error codes for product rating
  """
  enum ProductRatingErrorCode {
    PRODUCT_RATING_PRODUCT_VARIANT_NOT_EXIST_ERROR
    PRODUCT_RATING_PRODUCT_VARIANT_NOT_PURCHASED_ERROR
    PRODUCT_RATING_VALIDATION_ERROR
  }

  """
  Error when product variant does not exist
  """
  type ProductVariantNotExistError {
    errorCode: ProductRatingErrorCode!
    message: String!
  }

  """
  Error when product variant has not been purchased
  """
  type ProductVariantNotPurchasedError {
    errorCode: ProductRatingErrorCode!
    message: String!
  }

  """
  Error when input data are invalid
  """
  type RatingValidationError {
    errorCode: ProductRatingErrorCode!
    message: String!
  }

  union RateProductVariantResult =
    | Success
    | ProductVariantNotExistError
    | ProductVariantNotPurchasedError
    | RatingValidationError

  extend type Mutation {
    """
    Rates a product variant. The rating argument must be between 1 and 5.
    """
    rateProductVariant(
      productVariantId: ID!
      rating: Int!
    ): RateProductVariantResult!
  }
`;
