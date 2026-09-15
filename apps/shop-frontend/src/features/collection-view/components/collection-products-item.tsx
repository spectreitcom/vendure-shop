import type { CollectionProduct } from '../schemas';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ProductPrice } from '#/components/product-price.tsx';
import { ShoppingCart } from '@mui/icons-material';

type Props = Readonly<{
  item: CollectionProduct;
  categorySlug: string;
}>;

export function CollectionProductsItem({ item, categorySlug }: Props) {
  return (
    <Link
      to={`/$categorySlug/$productSlug`}
      params={{
        categorySlug,
        productSlug: item.product.slug,
      }}
    >
      <Card>
        <CardMedia
          component={'img'}
          alt={''}
          image={item.product.featuredAsset?.preview}
          className={'h-[250px]'}
        />
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
          <IconButton size={'medium'} color={'primary'}>
            <ShoppingCart />
          </IconButton>
        </CardActions>
      </Card>
    </Link>
  );
}
