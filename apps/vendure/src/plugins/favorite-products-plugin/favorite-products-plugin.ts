import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { FavoriteProductsEntity } from "./entities/favorite-products.entity";
import { FavoriteProductsService } from "./services/favorite-products.service";
import { favoriteProductsShopApiExtensions } from "./api/favorite-products-shop-api.extensions";
import { FavoriteProductsShopResolver } from "./api/favorite-products-shop.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [FavoriteProductsEntity],
  providers: [FavoriteProductsService],
  shopApiExtensions: {
    schema: favoriteProductsShopApiExtensions,
    resolvers: [FavoriteProductsShopResolver],
  },
})
export class FavoriteProductsPlugin {}
