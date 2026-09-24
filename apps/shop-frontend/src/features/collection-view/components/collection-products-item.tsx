import { Link } from '@tanstack/react-router';
import { ImageNotSupportedOutlined } from '@mui/icons-material';
import { AddToCartButton } from '#/features/shared/cart/components/add-to-cart-button.tsx';
import type { CollectionProductsQuery } from '#/graphql/generated.ts';

type Props = Readonly<{
  item: CollectionProductsQuery['search']['items'][number];
  categorySlug: string;
}>;

export function CollectionProductsItem({ item, categorySlug }: Props) {
  const price =
    item.priceWithTax.__typename === 'SinglePrice'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: item.currencyCode,
        }).format(item.priceWithTax.value / 100)
      : null;

  return (
    <article className="collection-product">
      <Link
        className="collection-product-image"
        to="/$categorySlug/$productSlug"
        params={{ categorySlug, productSlug: item.slug }}
      >
        {item.productAsset?.preview ? (
          <img
            src={item.productAsset.preview}
            alt={item.productName}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="collection-image-placeholder">
            <ImageNotSupportedOutlined />
            <span>Image coming soon</span>
          </span>
        )}
        <span className="collection-product-discover">
          View product <span aria-hidden="true">↗</span>
        </span>
      </Link>
      <div className="collection-product-info">
        <div>
          <h3>
            <Link
              to="/$categorySlug/$productSlug"
              params={{ categorySlug, productSlug: item.slug }}
            >
              {item.productName}
            </Link>
          </h3>
          <p className="collection-product-price">
            {price ?? 'See product for pricing'}
          </p>
        </div>
        <AddToCartButton
          className="collection-cart-button"
          variant="small"
          productVariantId={item.productVariantId}
          quantity={1}
        />
      </div>
    </article>
  );
}
