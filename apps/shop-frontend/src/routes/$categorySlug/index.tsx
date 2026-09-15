import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import {
  CollectionProductsGrid,
  getCollectionViewWithProducts,
} from '#/features/collection-view';
import { CollectionProductsPagination } from '../../features/collection-view/components/collection-products-pagination.tsx';
import { z } from 'zod';

const TAKE = 9;

const validateSearchSchema = z.object({
  page: z.number().positive().optional().default(1),
});

export const Route = createFileRoute('/$categorySlug/')({
  component: RouteComponent,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
  validateSearch: validateSearchSchema,
  loaderDeps: ({ search }) => {
    return { page: search.page };
  },
  loader: async ({ deps: { page }, params: { categorySlug } }) => {
    try {
      const response = await getCollectionViewWithProducts({
        data: { slug: categorySlug, page, take: TAKE },
      });
      return {
        error: false,
        collectionViewWithProducts: response,
      };
    } catch {
      return {
        error: true,
        collectionViewWithProducts: null,
      };
    }
  },
});

function RouteComponent() {
  const { error, collectionViewWithProducts } = Route.useLoaderData();
  const { page } = Route.useLoaderDeps();

  if (error || !collectionViewWithProducts)
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
              {collectionViewWithProducts.featuredAsset && (
                <Grid size={3}>
                  <img
                    src={collectionViewWithProducts.featuredAsset.preview}
                    alt="any alt"
                  />
                </Grid>
              )}
              <Grid size={9}>
                <Typography variant={'h4'} component={'h1'}>
                  {collectionViewWithProducts.name}
                </Typography>
                {collectionViewWithProducts.description && (
                  <Typography variant={'body1'}>
                    {collectionViewWithProducts.description}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Typography>
        </header>

        <Grid className={'mt-8'} container spacing={2} columns={12}>
          {/* Filters */}
          <Grid size={3}>
            <div>Filters</div>
          </Grid>
          {/* Products grid */}
          <Grid size={9}>
            {collectionViewWithProducts.productVariants.items.length ? (
              <>
                <CollectionProductsGrid
                  items={collectionViewWithProducts.productVariants.items}
                  categorySlug={collectionViewWithProducts.slug}
                />
                <div className={'flex justify-center p-8'}>
                  <CollectionProductsPagination
                    totalItems={calcTotalPageNumbers(
                      collectionViewWithProducts.productVariants.totalItems,
                      TAKE,
                    )}
                    categorySlug={collectionViewWithProducts.slug}
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
