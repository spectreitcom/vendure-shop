import type { FacetsQuery } from '#/graphql/generated.ts';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';

type Props = Readonly<{
  filter: FacetsQuery['facets']['items'][number];
  searchParamsToCopy: Omit<CollectionViewLoaderDeps, 'page'>;
  collectionSlug: string;
}>;

export function Filter({ filter, searchParamsToCopy, collectionSlug }: Props) {
  const { facetValues } = searchParamsToCopy;

  const filterValuesMap = new Map<string, boolean>();

  for (const filterValue of filter.values) {
    filterValuesMap.set(filterValue.id, facetValues.includes(filterValue.id));
  }

  return (
    <div className={'mb-4'}>
      <div>
        <h4 className={'text-xl'}>{filter.name}</h4>
      </div>
      <div className={'flex flex-col'}>
        {filter.values.map((fValue) => (
          <Link
            key={fValue.id}
            to={'/$categorySlug'}
            params={{ categorySlug: collectionSlug }}
            search={{
              page: 1,
              facetValues: filterValuesMap.get(fValue.id)
                ? [
                    ...facetValues.filter(
                      (facetValueId) => facetValueId !== fValue.id,
                    ),
                  ].join(',')
                : [...facetValues, fValue.id].join(','),
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={filterValuesMap.get(fValue.id)} />}
              label={fValue.name}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
