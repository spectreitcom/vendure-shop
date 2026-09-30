import {
  Channel,
  Customer,
  DeepPartial,
  EntityId,
  ID,
  ProductVariant,
  VendureEntity,
} from "@vendure/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity({ name: "product_rating_bought_product_variant" })
@Index(["productVariantId", "customerId", "channelId"], { unique: true })
export class ProductRatingBoughtProductVariant extends VendureEntity {
  constructor(input?: DeepPartial<ProductRatingBoughtProductVariant>) {
    super(input);
  }

  @EntityId()
  productVariantId: ID;

  @ManyToOne(() => ProductVariant, { onDelete: "CASCADE" })
  productVariant: ProductVariant;

  @EntityId()
  customerId: ID;

  @ManyToOne(() => Customer, { onDelete: "CASCADE" })
  customer: Customer;

  @EntityId()
  channelId: ID;

  @ManyToOne(() => Channel, { onDelete: "CASCADE" })
  channel: Channel;

  @Column({ type: "int", default: 0 })
  rating: number;
}
