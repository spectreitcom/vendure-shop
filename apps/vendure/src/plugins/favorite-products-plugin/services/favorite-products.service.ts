import { Injectable } from "@nestjs/common";
import {
  CustomerService,
  EntityHydrator,
  RequestContext,
  TransactionalConnection,
  ID,
  ForbiddenError,
  ProductVariantService,
} from "@vendure/core";
import { FavoriteProductsEntity } from "../entities/favorite-products.entity";

@Injectable()
export class FavoriteProductsService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly customerService: CustomerService,
    private readonly entityHydrator: EntityHydrator,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async add(ctx: RequestContext, productVariantId: ID) {
    const customer = await this.getActiveCustomer(ctx);

    const productVariant = await this.productVariantService.findOne(
      ctx,
      productVariantId,
    );

    if (!productVariant) {
      throw new ForbiddenError();
    }

    await this.entityHydrator.hydrate(ctx, productVariant, {
      relations: ["product", "featuredAsset"],
    });

    const favoriteProductRepository =
      this.connection.rawConnection.getRepository(FavoriteProductsEntity);

    const existing = await favoriteProductRepository.findOne({
      where: {
        productVariantId,
        customerId: customer.id,
        channelId: ctx.channelId,
      },
      relations: ["productVariant"],
    });

    if (existing) return existing;

    return await favoriteProductRepository.save(
      new FavoriteProductsEntity({
        customerId: customer.id,
        customer,
        productVariantId,
        productVariant,
        channelId: ctx.channelId,
        channel: ctx.channel,
      }),
    );
  }

  async remove(ctx: RequestContext, productVariantId: ID) {
    const customer = await this.getActiveCustomer(ctx);

    const result = await this.connection.rawConnection
      .getRepository(FavoriteProductsEntity)
      .delete({
        customerId: customer.id,
        productVariantId,
        channelId: ctx.channelId,
      });

    return (result.affected ?? 0) > 0;
  }

  async findAll(ctx: RequestContext, skip?: number, take?: number) {
    const customer = await this.getActiveCustomer(ctx);

    const [items, totalItems] = await this.connection.rawConnection
      .getRepository(FavoriteProductsEntity)
      .findAndCount({
        where: {
          customerId: customer.id,
          channelId: ctx.channelId,
        },
        skip,
        take,
        relations: {
          productVariant: true,
        },
      });

    return { items, totalItems };
  }

  async isProductInFavoriteProducts(ctx: RequestContext, productVariantId: ID) {
    const customer = await this.getActiveCustomer(ctx);

    return await this.connection.rawConnection
      .getRepository(FavoriteProductsEntity)
      .exists({
        where: {
          productVariantId,
          customerId: customer.id,
          channelId: ctx.channelId,
        },
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
