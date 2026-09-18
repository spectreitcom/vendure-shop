import { Grid } from '@mui/material';
import { CollectionProductsItem } from '#/features/collection-view/components/collection-products-item.tsx';
import type { CollectionProduct } from '#/features/collection-view/types';

type Props = Readonly<{
  items: CollectionProduct[];
  categorySlug: string;
}>;

export function CollectionProductsGrid({ items, categorySlug }: Props) {
  return (
    <Grid container columns={12}>
      {items.map((item) => (
        <Grid key={item.id} size={4}>
          <CollectionProductsItem item={item} categorySlug={categorySlug} />
        </Grid>
      ))}
    </Grid>
  );
}
