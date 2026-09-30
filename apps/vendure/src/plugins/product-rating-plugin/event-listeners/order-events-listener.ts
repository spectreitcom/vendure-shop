import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import {
  CustomerService,
  EventBus,
  ForbiddenError,
  ID,
  OrderPlacedEvent,
  RequestContext,
  TransactionalConnection,
  ProductVariant,
} from "@vendure/core";
import { Subscription, tap } from "rxjs";
import { ProductRatingBoughtProductVariant } from "../entities/product-rating-bought-product-variant.entity";
import { In } from "typeorm";
import { ProductRating } from "../entities/product-rating.entity";

@Injectable()
export class OrderEventsListener implements OnModuleInit, OnModuleDestroy {
  private eventBus$: Subscription;

  constructor(
    private readonly eventBus: EventBus,
    private readonly connection: TransactionalConnection,
    private readonly customerService: CustomerService,
  ) {}

  onModuleInit() {
    this.eventBus$ = this.eventBus
      .ofType(OrderPlacedEvent)
      .pipe(tap((event) => this.handleOrderPlaced(event)))
      .subscribe();
  }

  onModuleDestroy() {
    if (this.eventBus$) this.eventBus$.unsubscribe();
  }

  private async handleOrderPlaced({ ctx, order }: OrderPlacedEvent) {
    await this.connection.withTransaction(ctx, async (transactionalCtx) => {
      const customer = await this.getActiveCustomer(transactionalCtx);

      const boughtProductVariantRepository = this.connection.getRepository(
        ctx,
        ProductRatingBoughtProductVariant,
      );

      const boughtProductVariantIds = order.lines.map(
        (line) => line.productVariantId,
      );

      const boughtProductVariants = await boughtProductVariantRepository.find({
        where: {
          customerId: customer.id,
          productVariantId: In(boughtProductVariantIds),
          channelId: transactionalCtx.channelId,
        },
      });

      const boughtProductVariantsMap = new Map<
        ID,
        ProductRatingBoughtProductVariant
      >();

      boughtProductVariants.forEach((variant) =>
        boughtProductVariantsMap.set(variant.productVariantId, variant),
      );

      const productVariantIdsToAdd: ID[] = [];

      for (const variantId of boughtProductVariantIds) {
        if (boughtProductVariantsMap.has(variantId)) continue;
        productVariantIdsToAdd.push(variantId);
      }

      const productVariantRepository = this.connection.getRepository(
        ctx,
        ProductVariant,
      );

      const productVariantsToAdd = await productVariantRepository.find({
        where: {
          id: In(productVariantIdsToAdd),
          channels: {
            id: transactionalCtx.channelId,
          },
        },
      });

      const productVariantsToAddMap = new Map<ID, ProductVariant>();

      productVariantsToAdd.forEach((variant) =>
        productVariantsToAddMap.set(variant.id, variant),
      );

      await boughtProductVariantRepository.save(
        productVariantsToAdd.map(
          (variant) =>
            new ProductRatingBoughtProductVariant({
              customerId: customer.id,
              customer: customer,
              channelId: ctx.channelId,
              channel: ctx.channel,
              productVariantId: variant.id,
              productVariant: variant,
            }),
        ),
      );

      await this.createProductRatingIfNotExists(
        transactionalCtx,
        productVariantsToAdd,
      );
    });
  }

  private async createProductRatingIfNotExists(
    ctx: RequestContext,
    productVariantsToAdd: ProductVariant[],
  ) {
    const productRatingRepository = this.connection.getRepository(
      ctx,
      ProductRating,
    );

    const existingProductRatings = await productRatingRepository.find({
      where: {
        productVariantId: In(productVariantsToAdd.map((variant) => variant.id)),
        channelId: ctx.channelId,
      },
    });

    const existingProductRatingsMap = new Map<ID, ProductRating>();

    existingProductRatings.forEach((rating) => {
      existingProductRatingsMap.set(rating.productVariantId, rating);
    });

    const productRatingToAdd: ProductRating[] = [];

    for (const productVariant of productVariantsToAdd) {
      if (!existingProductRatingsMap.has(productVariant.id)) {
        productRatingToAdd.push(
          new ProductRating({
            productVariantId: productVariant.id,
            productVariant,
            channelId: ctx.channelId,
            channel: ctx.channel,
          }),
        );
      }
    }

    await productRatingRepository.save(productRatingToAdd);
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
