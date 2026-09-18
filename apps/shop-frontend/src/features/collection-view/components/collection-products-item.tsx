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
import type { CollectionProduct } from '#/features/collection-view/types';

type Props = Readonly<{
  item: CollectionProduct;
  categorySlug: string;
}>;

export function CollectionProductsItem({ item, categorySlug }: Props) {
  return (
    <Card>
      <Link
        to={`/$categorySlug/$productSlug`}
        params={{
          categorySlug,
          productSlug: item.product.slug,
        }}
      >
        <CardMedia
          component={'img'}
          alt={''}
          image={item.product.featuredAsset?.preview}
          className={'h-[250px]'}
        />
      </Link>
      <CardContent>
        <ProductPrice
          price={item.priceWithTax}
          currencyCode={item.currencyCode}
        />
        <Typography component={'h4'} variant={'h5'}>
          {item.name}
        </Typography>
      </CardContent>
      <CardActions>
        <AddToCartButton
          variant={'small'}
          productVariantId={item.id}
          quantity={1}
        />
      </CardActions>
    </Card>
  );
}
