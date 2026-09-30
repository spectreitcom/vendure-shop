import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductRatingService } from "../../services/product-rating.service";
import {
  Allow,
  Ctx,
  ID,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { ProductRatingRateProductVariantService } from "../../services/product-rating-rate-product-variant.service";

@Resolver()
export class ProductRatingShopApiResolver {
  constructor(
    private readonly productRatingService: ProductRatingService,
    private readonly productRatingRateProductVariantService: ProductRatingRateProductVariantService,
  ) {}

  @Query()
  async productVariantRating(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.productRatingService.findProductRatingByProductVariantId(
      ctx,
      productVariantId,
    );
  }

  @Query()
  @Allow(Permission.Owner)
  async productVariantRatingByActiveCustomer(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.productRatingService.findActiveCustomerProductRatingByProductVariantId(
      ctx,
      productVariantId,
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async rateProductVariant(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
    @Args("rating") rating: number,
  ) {
    return await this.productRatingRateProductVariantService.rate(
      ctx,
      productVariantId,
      rating,
    );
  }
}
