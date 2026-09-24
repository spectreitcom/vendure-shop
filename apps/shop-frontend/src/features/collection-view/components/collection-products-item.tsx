import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ProductPrice } from '#/components/product-price.tsx';
import { AddToCartButton } from '#/features/shared/cart/components/add-to-cart-button.tsx';
import type { CollectionProductsQuery } from '#/graphql/generated.ts';

type Props = Readonly<{
  item: CollectionProductsQuery['search']['items'][number];
  categorySlug: string;
}>;

export function CollectionProductsItem({ item, categorySlug }: Props) {
  return (
    <Card>
      <Link
        to={`/$categorySlug/$productSlug`}
        params={{
          categorySlug,
          productSlug: item.slug,
        }}
      >
        <CardMedia
          component={'img'}
          alt={''}
          image={item.productAsset?.preview}
          className={'h-[250px]'}
        />
      </Link>
      <CardContent>
        <ProductPrice
          price={
            item.priceWithTax.__typename === 'SinglePrice'
              ? item.priceWithTax.value
              : 0
          }
          currencyCode={item.currencyCode}
        />
        <Typography component={'h4'} variant={'h5'}>
          {item.productName}
        </Typography>
      </CardContent>
      <CardActions>
        <AddToCartButton
          variant={'small'}
          productVariantId={item.productVariantId}
          quantity={1}
        />
      </CardActions>
    </Card>
  );
}
