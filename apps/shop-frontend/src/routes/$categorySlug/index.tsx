import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import {
  CollectionProductsGrid,
  Filters,
  getCollection,
  getCollectionProducts,
  getFacets,
} from '#/features/collection-view';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';
import { CollectionProductsPagination } from '../../features/collection-view/components/collection-products-pagination.tsx';
import type {
  CollectionProductsQuery,
  FacetsQuery,
  GetCollectionQuery,
} from '#/graphql/generated.ts';
import { validateSearchSchema } from '#/features/collection-view/schemas';

const TAKE = 9;

type LoaderSuccess = {
  error: false;
  collection: GetCollectionQuery['collection'];
  facets: FacetsQuery['facets']['items'];
  products?: CollectionProductsQuery['search'];
};

type LoaderError = {
  error: true;
};

type LoaderData = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/$categorySlug/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  validateSearch: validateSearchSchema,
  loaderDeps: ({ search }) => {
    return {
      page: search.page,
      facetValues: search.facetValues?.split(',').filter(Boolean) ?? [],
    } satisfies CollectionViewLoaderDeps;
  },
  loader: async ({ deps: { page, facetValues }, params: { categorySlug } }) => {
    try {
      const collection = await getCollection({
        data: { slug: categorySlug },
      });

      const products = await getCollectionProducts({
        data: {
          collectionSlug: categorySlug,
          take: TAKE,
          page,
          facetValueFilters: facetValues.map((fValue) => ({
            and: fValue,
            or: [],
          })),
        },
      });

      const facets = await getFacets();

      return {
        error: false,
        collection,
        facets,
        products,
      } satisfies LoaderData;
    } catch {
      return {
        error: true,
      } satisfies LoaderData;
    }
  },
});

function RouteComponent() {
  const { error, collection, facets, products } = Route.useLoaderData();
  const { page, facetValues } = Route.useLoaderDeps();

  if (error || !collection)
    return (
      <Card>
        <CardContent>
          <Typography variant={'body1'}>Something went wrong</Typography>
        </CardContent>
      </Card>
    );

  return (
    <div className={'mt-8'}>
      <div className={'container'}>
        <header>
          <Typography variant={'h5'} component={'h1'}>
            <Grid container columns={12} spacing={4}>
              {collection.featuredAsset && (
                <Grid size={3}>
                  <img src={collection.featuredAsset.preview} alt="any alt" />
                </Grid>
              )}
              <Grid size={9}>
                <Typography variant={'h4'} component={'h1'}>
                  {collection.name}
                </Typography>
                {collection.description && (
                  <Typography variant={'body1'}>
                    {collection.description}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Typography>
        </header>

        <Grid className={'mt-8'} container spacing={4} columns={12}>
          {/* Filters */}
          <Grid size={3}>
            <Filters
              facets={facets}
              collectionSlug={collection.slug}
              searchParamsToCopy={{ facetValues }}
            />
          </Grid>
          {/* Products grid */}
          <Grid size={9}>
            {products?.items.length ? (
              <>
                <CollectionProductsGrid
                  items={products.items}
                  categorySlug={collection.slug}
                />
                <div className={'flex justify-center p-8'}>
                  <CollectionProductsPagination
                    totalItems={calcTotalPageNumbers(products.totalItems, TAKE)}
                    categorySlug={collection.slug}
                    page={page}
                  />
                </div>
              </>
            ) : (
              <NoProductsFound />
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function calcTotalPageNumbers(totalItems: number, take: number) {
  if (take <= 0) throw new Error('Take must be greater than 0');
  return Math.ceil(totalItems / take);
}

function NoProductsFound() {
  return <Typography>No products found</Typography>;
}
