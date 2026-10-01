import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { OrderEventsListener } from "./event-listeners/order-events-listener";
import { ProductRatingService } from "./services/product-rating.service";
import { ProductRating } from "./entities/product-rating.entity";
import { ProductRatingBoughtProductVariant } from "./entities/product-rating-bought-product-variant.entity";
import { productRatingShopApiExtensions } from "./api/shop/product-rating-shop-api.extensions";
import { ProductRatingShopApiResolver } from "./api/shop/product-rating-shop-api.resolver";
import { ProductRatingRateProductVariantService } from "./services/product-rating-rate-product-variant.service";
import { productRatingAdminApiExtensions } from "./api/admin/product-rating-admin-api.extensions";
import { ProductRatingAdminApiResolver } from "./api/admin/product-rating-admin-api.resolver";

@VendurePlugin({
  compatibility: "^3.0.0",
  imports: [PluginCommonModule],
  entities: [ProductRating, ProductRatingBoughtProductVariant],
  providers: [
    OrderEventsListener,
    ProductRatingService,
    ProductRatingRateProductVariantService,
  ],
  shopApiExtensions: {
    schema: productRatingShopApiExtensions,
    resolvers: [ProductRatingShopApiResolver],
  },
  adminApiExtensions: {
    schema: productRatingAdminApiExtensions,
    resolvers: [ProductRatingAdminApiResolver],
  },
  dashboard: "./dashboard/index.tsx",
})
export class ProductRatingPlugin {}
