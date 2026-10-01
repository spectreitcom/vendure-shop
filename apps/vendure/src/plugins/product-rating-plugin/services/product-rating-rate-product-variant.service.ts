import { Injectable } from "@nestjs/common";
import {
  CustomerService,
  ForbiddenError,
  ID,
  ProductVariantService,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { ProductRating } from "../entities/product-rating.entity";
import { ProductRatingBoughtProductVariant } from "../entities/product-rating-bought-product-variant.entity";
import {
  isZodError,
  RateProductVariantInput,
  rateProductVariantInputSchema,
} from "../api/shop/schema";
import { calcAverageRating } from "../helpers";

@Injectable()
export class ProductRatingRateProductVariantService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly customerService: CustomerService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async rate(ctx: RequestContext, productVariantId: ID, rating: number) {
    const customer = await this.getActiveCustomer(ctx);

    const validationResult = this.validateInput({ rating });
    if (isZodError(validationResult)) {
      return {
        __typename: "RatingValidationError",
        errorCode: "PRODUCT_RATING_VALIDATION_ERROR",
        message: validationResult.message,
      };
    }

    if (!(await this.checkIfProductVariantExists(ctx, productVariantId))) {
      return {
        __typename: "ProductVariantNotExistError",
        errorCode: "PRODUCT_RATING_PRODUCT_VARIANT_NOT_EXIST_ERROR",
        message: "Product variant does not exist",
      };
    }

    const boughtProduct =
      await this.checkIfProductVariantWasPurchasedByActiveCustomer(
        ctx,
        productVariantId,
        customer.id,
      );

    if (!boughtProduct) {
      return {
        __typename: "ProductVariantNotPurchasedError",
        errorCode: "PRODUCT_RATING_PRODUCT_VARIANT_NOT_PURCHASED_ERROR",
        message: "Product variant has not been purchased",
      };
    }

    await this.updateRating(ctx, productVariantId, customer.id, rating);
    await this.updateProductRating(
      ctx,
      productVariantId,
      rating,
      boughtProduct.rating,
    );

    return {
      __typename: "Success",
      success: true,
    };
  }

  /**
   *
   * @param ctx
   * @param productVariantId
   * @param rating
   * @param prevRating
   * @private
   */
  private async updateProductRating(
    ctx: RequestContext,
    productVariantId: ID,
    rating: number,
    prevRating: number,
  ) {
    if (prevRating === rating) {
      return;
    }

    const productRating = await this.getProductRatingRepository(ctx).findOne({
      where: {
        channelId: ctx.channelId,
        productVariantId,
      },
      lock: { mode: "pessimistic_write" },
    });

    let newVotes = productRating?.votes ?? 0;

    // when prevRating is 0, it means that customer is rating product variant for the first time
    if (prevRating === 0) {
      newVotes += 1;
    }

    const newRatingSum = (productRating?.ratingSum ?? 0) - prevRating + rating;
    const newAverage = calcAverageRating(newVotes, newRatingSum);

    await this.getProductRatingRepository(ctx).update(
      {
        channelId: ctx.channelId,
        productVariantId,
      },
      {
        votes: newVotes,
        ratingSum: newRatingSum,
        average: newAverage,
      },
    );
  }

  private async updateRating(
    ctx: RequestContext,
    productVariantId: ID,
    customerId: ID,
    rating: number,
  ) {
    return await this.getBoughtProductVariantRepository(ctx).update(
      {
        channelId: ctx.channelId,
        productVariantId,
        customerId,
      },
      { rating },
    );
  }

  private validateInput(input: RateProductVariantInput) {
    const validationResult = rateProductVariantInputSchema.safeParse({
      rating: input.rating,
    });

    if (validationResult.success) return true;

    return validationResult.error;
  }

  private async checkIfProductVariantExists(
    ctx: RequestContext,
    productVariantId: ID,
  ) {
    return await this.productVariantService.findOne(ctx, productVariantId);
  }

  private async checkIfProductVariantWasPurchasedByActiveCustomer(
    ctx: RequestContext,
    productVariantId: ID,
    customerId: ID,
  ) {
    return await this.getBoughtProductVariantRepository(ctx).findOne({
      where: {
        channelId: ctx.channelId,
        customerId,
        productVariantId,
      },
      lock: { mode: "pessimistic_write" },
    });
  }

  private getProductRatingRepository(ctx: RequestContext) {
    return this.connection.getRepository(ctx, ProductRating);
  }

  private getBoughtProductVariantRepository(ctx: RequestContext) {
    return this.connection.getRepository(
      ctx,
      ProductRatingBoughtProductVariant,
    );
  }

  private async getActiveCustomer(ctx: RequestContext) {
    if (!ctx.activeUserId) throw new ForbiddenError();

    const customer = await this.customerService.findOneByUserId(
      ctx,
      ctx.activeUserId,
    );

    if (!customer) throw new ForbiddenError();

    return customer;
  }
}
