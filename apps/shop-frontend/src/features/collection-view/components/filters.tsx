import { Card, CardContent } from '@mui/material';
import type { FacetsQuery } from '#/graphql/generated.ts';
import { Filter } from './filter.tsx';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';

type Props = Readonly<{
  facets: FacetsQuery['facets']['items'];
  searchParams: CollectionViewLoaderDeps;
  collectionSlug: string;
}>;

export function Filters({ facets, collectionSlug, searchParams }: Props) {
  return (
    <Card>
      <CardContent>
        {facets.map((facet) => (
          <Filter
            key={facet.id}
            filter={facet}
            collectionSlug={collectionSlug}
            searchParams={searchParams}
          />
        ))}
      </CardContent>
    </Card>
  );
}
