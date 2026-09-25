import { ImageNotSupportedOutlined, ArrowDownward } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { ProductPrice } from '#/components/product-price.tsx';
import { AddToCartButton } from '#/features/shared/cart';
import type { GetProductDetailsViewQuery } from '#/graphql/generated.ts';

type Product = NonNullable<GetProductDetailsViewQuery['product']>;
type ProductVariant = NonNullable<
  GetProductDetailsViewQuery['product']
>['variants'][number];

type Props = Readonly<{
  categorySlug: string;
  product: Product;
  productVariant: ProductVariant;
  otherVariants: ProductVariant[];
}>;

const displayImage = (product: Product, productVariant: ProductVariant) => {
  if (productVariant.featuredAsset?.preview)
    return (
      <img
        src={productVariant.featuredAsset.preview}
        alt={product.name}
        fetchPriority="high"
        decoding="async"
      />
    );

  if (product.featuredAsset?.preview)
    return (
      <img
        src={product.featuredAsset.preview}
        alt={product.name}
        fetchPriority="high"
        decoding="async"
      />
    );

  return (
    <div className="collection-image-placeholder">
      <ImageNotSupportedOutlined sx={{ fontSize: 40 }} />
      <span>Image coming soon</span>
    </div>
  );
};

const displayProductName = (
  product: Product,
  productVariant: ProductVariant,
) => {
  if (productVariant.name) return productVariant.name;
  return product.name;
};

export function ProductDetails({
  categorySlug,
  product,
  productVariant,
  otherVariants,
}: Props) {
  const variant = productVariant;
  const features = Object.values(
    product.facetValues.reduce<
      Record<string, { name: string; values: Array<string> }>
    >((groups, value) => {
      const group = (groups[value.facet.id] ??= {
        name: value.facet.name,
        values: [],
      });
      group.values.push(value.name);
      return groups;
    }, {}),
  );

  return (
    <>
      <div className="product-layout">
        <div className="product-image">
          {displayImage(product, productVariant)}
        </div>

        <section className="product-summary" aria-labelledby="product-title">
          <span className="collection-eyebrow">From the collection</span>
          <h1 id="product-title">
            {displayProductName(product, productVariant)}
          </h1>
          <div className="product-purchase">
            <ProductPrice
              className="product-price"
              price={variant.priceWithTax}
              currencyCode={variant.currencyCode}
            />
            <p className="product-price-note">Including tax</p>
            <AddToCartButton
              className="product-cart-button"
              variant="large"
              quantity={1}
              productVariantId={variant.id}
            />
          </div>

          {otherVariants.length > 0 && (
            <section
              className="product-variants"
              aria-labelledby="product-variants-title"
            >
              <h2 id="product-variants-title" className="collection-eyebrow">
                Other variants
              </h2>
              <ul>
                {otherVariants.map((otherVariant) => (
                  <li key={otherVariant.id}>
                    <Link
                      to="/$categorySlug/$productSlug"
                      params={{ categorySlug, productSlug: product.slug }}
                      search={{ productVariantId: otherVariant.id }}
                    >
                      <span>{otherVariant.name}</span>
                      <ProductPrice
                        price={otherVariant.priceWithTax}
                        currencyCode={otherVariant.currencyCode}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {features.length > 0 && (
            <section
              className="product-features"
              aria-labelledby="product-features-title"
            >
              <h2 id="product-features-title" className="collection-eyebrow">
                At a glance
              </h2>
              <dl>
                {features.map((feature) => (
                  <div key={feature.name}>
                    <dt>{feature.name}</dt>
                    <dd>{feature.values.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {product.description && (
            <a href="#product-description" className="collection-text-link">
              Explore the details <ArrowDownward fontSize="small" />
            </a>
          )}
        </section>
      </div>

      {product.description && (
        <section
          className="product-description"
          id="product-description"
          aria-labelledby="product-description-title"
        >
          <header>
            <span className="collection-eyebrow">A closer look</span>
            <h2 id="product-description-title">About this product</h2>
          </header>
          <div
            className="prose prose-neutral product-description-content"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}
    </>
  );
}
