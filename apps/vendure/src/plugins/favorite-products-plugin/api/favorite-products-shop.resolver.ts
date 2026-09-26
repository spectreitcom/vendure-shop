import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { FavoriteProductsService } from "../services/favorite-products.service";

@Resolver()
export class FavoriteProductsShopResolver {
  constructor(private favoriteProductsService: FavoriteProductsService) {}

  @Query()
  @Allow(Permission.Owner)
  async activeCustomerFavoriteProducts(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      options?: { skip?: number; take?: number };
    },
  ) {
    return await this.favoriteProductsService.findAll(
      ctx,
      args.options?.skip,
      args.options?.take,
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async addFavoriteProduct(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.favoriteProductsService.add(ctx, productVariantId);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async removeFavoriteProduct(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.favoriteProductsService.remove(ctx, productVariantId);
  }

  @Query()
  @Allow(Permission.Owner)
  async isFavoriteProduct(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.favoriteProductsService.isProductInFavoriteProducts(
      ctx,
      productVariantId,
    );
  }
}
