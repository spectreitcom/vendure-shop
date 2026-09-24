import { Link } from '@tanstack/react-router';
import { Tune } from '@mui/icons-material';
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
    <details className="collection-filters" open>
      <summary>
        <span>
          <Tune fontSize="small" /> Filters
        </span>
        <span className="collection-filter-toggle" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div className="collection-filters-content">
        <div className="collection-filter-caption">
          <span>Refine your selection</span>
          {searchParamsToCopy.facetValues.length > 0 && (
            <Link
              to="/$categorySlug"
              params={{ categorySlug: collectionSlug }}
              search={{ page: 1 }}
            >
              Clear all
            </Link>
          )}
        </div>
        {facets.map((facet) => (
          <Filter
            key={facet.id}
            filter={facet}
            collectionSlug={collectionSlug}
            searchParamsToCopy={searchParamsToCopy}
          />
        ))}
      </div>
    </details>
  );
}
