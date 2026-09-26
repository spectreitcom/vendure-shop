import gql from "graphql-tag";

export const favoriteProductsShopApiExtensions = gql`
  """
  Represents a product variant added by the customer to favorites.
  """
  type FavoriteProduct implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    productVariantId: ID!
    productVariant: ProductVariant!
  }

  type FavoriteProductList implements PaginatedList {
    items: [FavoriteProduct!]!
    totalItems: Int!
  }

  input FavoriteProductListOptions {
    skip: Int
    take: Int
  }

  extend type Query {
    """
    Returns a list of products added to favorites by the active customer.
    """
    activeCustomerFavoriteProducts(
      options: FavoriteProductListOptions
    ): FavoriteProductList!

    """
    Checks if a product variant is added to favorites by the active customer.
    """
    isFavoriteProduct(productVariantId: ID!): Boolean!
  }

  extend type Mutation {
    """
    Adds a product variant to the active customer's favorites.
    """
    addFavoriteProduct(productVariantId: ID!): FavoriteProduct!

    """
    Removes a product variant from the active customer's favorites.
    """
    removeFavoriteProduct(productVariantId: ID!): Boolean!
  }
`;
