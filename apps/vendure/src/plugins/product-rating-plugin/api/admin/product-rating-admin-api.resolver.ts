import { Args, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, ID, Permission, RequestContext } from "@vendure/core";
import { ProductRatingService } from "../../services/product-rating.service";

@Resolver()
export class ProductRatingAdminApiResolver {
  constructor(private readonly productRatingService: ProductRatingService) {}

  @Query()
  @Allow(Permission.Authenticated)
  async productVariantRating(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: ID,
  ) {
    return await this.productRatingService.findProductRatingByProductVariantId(
      ctx,
      productVariantId,
    );
  }
}
