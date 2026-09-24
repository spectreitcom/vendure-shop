import type { FacetsQuery } from '#/graphql/generated.ts';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';

type Props = Readonly<{
  filter: FacetsQuery['facets']['items'][number];
  searchParamsToCopy: Omit<CollectionViewLoaderDeps, 'page'>;
  collectionSlug: string;
}>;

export function Filter({ filter, searchParamsToCopy, collectionSlug }: Props) {
  const { facetValues } = searchParamsToCopy;
  const navigate = useNavigate();

  const filterValuesMap = new Map<string, boolean>();

  for (const filterValue of filter.values) {
    filterValuesMap.set(filterValue.id, facetValues.includes(filterValue.id));
  }

  return (
    <fieldset className="collection-filter-group">
      <legend>{filter.name}</legend>
      <div className="collection-filter-options">
        {filter.values.map((value) => (
          <FormControlLabel
            key={value.id}
            label={value.name}
            control={
              <Checkbox
                size="small"
                checked={filterValuesMap.get(value.id) ?? false}
                onChange={() => {
                  void navigate({
                    to: '/$categorySlug',
                    params: { categorySlug: collectionSlug },
                    search: {
                      page: 1,
                      facetValues: (facetValues.includes(value.id)
                        ? facetValues.filter((id) => id !== value.id)
                        : [...facetValues, value.id]
                      ).join(','),
                    },
                  });
                }}
              />
            }
          />
        ))}
      </div>
    </fieldset>
  );
}
