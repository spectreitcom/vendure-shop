import { Grid } from '@mui/material';
import { CollectionProductsItem } from '#/features/collection-view/components/collection-products-item.tsx';
import type { CollectionProductsQuery } from '#/graphql/generated.ts';

type Props = Readonly<{
  items: CollectionProductsQuery['search']['items'];
  categorySlug: string;
}>;

export function CollectionProductsGrid({ items, categorySlug }: Props) {
  return (
    <Grid container columns={12}>
      {items.map((item) => (
        <Grid key={item.productId} size={4}>
          <CollectionProductsItem item={item} categorySlug={categorySlug} />
        </Grid>
      ))}
    </Grid>
  );
}
