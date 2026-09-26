import { Link } from '@tanstack/react-router';
import { ImageNotSupportedOutlined } from '@mui/icons-material';
import { AddToCartButton } from '#/features/shared/cart/components/add-to-cart-button.tsx';
import type { CollectionProductsQuery } from '#/graphql/generated.ts';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  item: CollectionProductsQuery['search']['items'][number];
  categorySlug: string;
}>;

const displayProductImage = (
  item: CollectionProductsQuery['search']['items'][number],
) => {
  if (item.productVariantAsset?.preview)
    return (
      <img
        src={item.productVariantAsset.preview}
        alt={item.productName}
        loading="lazy"
        decoding="async"
      />
    );

  if (item.productAsset?.preview) {
    return (
      <img
        src={item.productAsset.preview}
        alt={item.productName}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span className="collection-image-placeholder">
      <ImageNotSupportedOutlined />
      <span>{m.common_image_coming_soon()}</span>
    </span>
  );
};

const displayProductName = (
  item: CollectionProductsQuery['search']['items'][number],
) => {
  if (item.productVariantName) return item.productVariantName;
  return item.productName;
};

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
        search={{ productVariantId: item.productVariantId }}
      >
        {displayProductImage(item)}
        <span className="collection-product-discover">
          {m.collection_product_view()} <span aria-hidden="true">↗</span>
        </span>
      </Link>
      <div className="collection-product-info">
        <div>
          <h3>
            <Link
              to="/$categorySlug/$productSlug"
              params={{ categorySlug, productSlug: item.slug }}
              search={{ productVariantId: item.productVariantId }}
            >
              {displayProductName(item)}
            </Link>
          </h3>
          <p className="collection-product-price">
            {price ?? m.collection_product_pricing_fallback()}
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
