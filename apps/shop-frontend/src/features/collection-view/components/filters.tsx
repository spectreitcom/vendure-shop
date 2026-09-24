import { Card, CardContent } from '@mui/material';
import type { FacetsQuery } from '#/graphql/generated.ts';
import { Filter } from './filter.tsx';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';

type Props = Readonly<{
  facets: FacetsQuery['facets']['items'];
  searchParamsToCopy: Omit<CollectionViewLoaderDeps, 'page'>;
  collectionSlug: string;
}>;

export function Filters({ facets, collectionSlug, searchParamsToCopy }: Props) {
  return (
    <Card>
      <CardContent>
        {facets.map((facet) => (
          <Filter
            key={facet.id}
            filter={facet}
            collectionSlug={collectionSlug}
            searchParamsToCopy={searchParamsToCopy}
          />
        ))}
      </CardContent>
    </Card>
  );
}
