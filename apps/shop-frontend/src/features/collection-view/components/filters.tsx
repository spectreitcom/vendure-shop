import { Link } from '@tanstack/react-router';
import { Tune } from '@mui/icons-material';
import type { FacetsQuery } from '#/graphql/generated.ts';
import { Filter } from './filter.tsx';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';
import { m } from '#/paraglide/messages';

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
          <Tune fontSize="small" /> {m.collection_filters_title()}
        </span>
        <span className="collection-filter-toggle" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div className="collection-filters-content">
        <div className="collection-filter-caption">
          <span>{m.collection_filters_caption()}</span>
          {searchParamsToCopy.facetValues.length > 0 && (
            <Link
              to="/$categorySlug"
              params={{ categorySlug: collectionSlug }}
              search={{ page: 1 }}
            >
              {m.collection_filters_clear_all()}
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
