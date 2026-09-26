import {
  VendureEntity,
  ID,
  EntityId,
  Customer,
  Channel,
  ProductVariant,
  DeepPartial,
} from "@vendure/core";
import { Entity, ManyToOne, Index } from "typeorm";

@Entity()
@Index(["customerId", "productVariantId", "channelId"], { unique: true })
export class FavoriteProductsEntity extends VendureEntity {
  constructor(input?: DeepPartial<FavoriteProductsEntity>) {
    super(input);
  }

  @EntityId()
  customerId: ID;

  @ManyToOne(() => Customer, { onDelete: "CASCADE" })
  customer: Customer;

  @EntityId()
  productVariantId: ID;

  @ManyToOne(() => ProductVariant, { onDelete: "CASCADE" })
  productVariant: ProductVariant;

  @EntityId()
  channelId: ID;

  @ManyToOne(() => Channel, { onDelete: "CASCADE" })
  channel: Channel;
}
