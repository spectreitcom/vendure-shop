import type { HomeCollectionItem } from '../schemas';
import { Grid, Typography } from '@mui/material';
import { CollectionsListItem } from './collections-list-item.tsx';
import { cn } from '#/utils';

type Props = Readonly<{
  items: ReadonlyArray<HomeCollectionItem>;
  className?: string;
}>;

export function CollectionsList({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <div className={cn('bg-white p-8', className)}>
      <Typography variant={'h5'} component={'h3'}>
        Lorem ipsum dolor sit amet.
      </Typography>
      <Grid className={'mt-8'} container spacing={2}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <CollectionsListItem
              slug={item.slug}
              title={item.name}
              imageUrl={item.featuredAsset?.source}
              imageAlt={'now empty'}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
