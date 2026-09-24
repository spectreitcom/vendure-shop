import { CollectionProductsItem } from '#/features/collection-view/components/collection-products-item.tsx';
import type { CollectionProductsQuery } from '#/graphql/generated.ts';

type Props = Readonly<{
  items: CollectionProductsQuery['search']['items'];
  categorySlug: string;
}>;

export function CollectionProductsGrid({ items, categorySlug }: Props) {
  return (
    <div className="collection-product-grid">
      {items.map((item) => (
        <div key={item.productVariantId}>
          <CollectionProductsItem item={item} categorySlug={categorySlug} />
        </div>
      ))}
    </div>
  );
}
