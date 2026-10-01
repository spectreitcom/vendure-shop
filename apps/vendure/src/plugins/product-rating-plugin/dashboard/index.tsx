import { defineDashboardExtension } from "@vendure/dashboard";
import { ProductVariantRating } from "./product-variant-rating";

defineDashboardExtension({
  pageBlocks: [
    {
      id: "product-rating",
      location: {
        pageId: "product-variant-detail",
        column: "side",
        position: { blockId: "enabled", order: "after" },
      },
      component: ({ context: { entity } }) => {
        return <ProductVariantRating productVariantId={entity.id} />;
      },
    },
  ],
});
