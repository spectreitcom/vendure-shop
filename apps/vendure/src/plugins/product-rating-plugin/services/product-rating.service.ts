import { Injectable } from "@nestjs/common";
import {
  CustomerService,
  ForbiddenError,
  ID,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { ProductRating } from "../entities/product-rating.entity";
import { ProductRatingBoughtProductVariant } from "../entities/product-rating-bought-product-variant.entity";

@Injectable()
export class ProductRatingService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly customerService: CustomerService,
  ) {}

  async findProductRatingByProductVariantId(
    ctx: RequestContext,
    productVariantId: ID,
  ) {
    return this.connection.getRepository(ctx, ProductRating).findOne({
      where: {
        channelId: ctx.channelId,
        productVariantId: productVariantId,
      },
      relations: ["productVariant"],
    });
  }

  async findActiveCustomerProductRatingByProductVariantId(
    ctx: RequestContext,
    productVariantId: ID,
  ) {
    const customer = await this.getActiveCustomer(ctx);
    return this.connection
      .getRepository(ctx, ProductRatingBoughtProductVariant)
      .findOne({
        where: {
          channelId: ctx.channelId,
          customerId: customer.id,
          productVariantId,
        },
        relations: ["productVariant", "channel"],
      });
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
