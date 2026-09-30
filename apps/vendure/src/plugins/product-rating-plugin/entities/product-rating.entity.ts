import {
  Channel,
  DeepPartial,
  EntityId,
  ID,
  ProductVariant,
  VendureEntity,
} from "@vendure/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity({ name: "product_rating" })
@Index(["productVariantId", "channelId"], { unique: true })
export class ProductRating extends VendureEntity {
  constructor(input?: DeepPartial<ProductRating>) {
    super(input);
  }

  @EntityId()
  productVariantId: ID;

  @ManyToOne(() => ProductVariant, { onDelete: "CASCADE" })
  productVariant: ProductVariant;

  // Average rating for a product variant
  @Column({
    name: "average",
    default: 0,
    type: "float",
  })
  average: number;

  // Number of votes for a product variant
  @Column({
    name: "votes",
    default: 0,
    type: "int",
  })
  votes: number;

  @Column({ type: "int", default: 0 })
  ratingSum: number;

  @EntityId()
  channelId: ID;

  @ManyToOne(() => Channel, { onDelete: "CASCADE" })
  channel: Channel;
}
