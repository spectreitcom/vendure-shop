import { createFileRoute } from '@tanstack/react-router';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { getProductDetailsView } from '#/features/product-view';
import { ShoppingCart } from '@mui/icons-material';
import { ProductPrice } from '#/components/product-price.tsx';

export const Route = createFileRoute('/$categorySlug/$productSlug/')({
  component: RouteComponent,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
  loader: async ({ params: { productSlug } }) => {
    try {
      const productViewDetails = await getProductDetailsView({
        data: { slug: productSlug },
      });

      return {
        error: false,
        productViewDetails,
      };
    } catch {
      return {
        error: true,
        productViewDetails: null,
      };
    }
  },
});

function RouteComponent() {
  const { error, productViewDetails } = Route.useLoaderData();

  if (error || !productViewDetails) return <div>error</div>;

  return (
    <div className={'container'}>
      <header className={'mt-8'}>
        <Grid container columns={12} spacing={4}>
          <Grid size={6}>
            {productViewDetails.featuredAsset && (
              <img
                src={productViewDetails.featuredAsset.preview}
                loading={'lazy'}
                alt={productViewDetails.name}
              />
            )}
          </Grid>
          <Grid size={6}>
            <div>
              <Typography variant={'h4'} component={'h1'}>
                {productViewDetails.name}
              </Typography>

              {productViewDetails.variants.length && (
                <ProductPrice
                  className={'font-semibold text-2xl mt-4'}
                  price={productViewDetails.variants[0].priceWithTax}
                  currencyCode={productViewDetails.variants[0].currencyCode}
                />
              )}
            </div>

            <div className={'mt-4'}>
              <Button
                className={'w-full'}
                variant={'contained'}
                size={'large'}
                startIcon={<ShoppingCart />}
              >
                Add to Cart
              </Button>
            </div>
          </Grid>
        </Grid>
      </header>
      <div>
        <div
          className={'prose prose-neutral mt-8 max-w-none'}
          dangerouslySetInnerHTML={{ __html: productViewDetails.description }}
        />
      </div>
    </div>
  );
}
