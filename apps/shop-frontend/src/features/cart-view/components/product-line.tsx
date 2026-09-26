import { ImageNotSupportedOutlined } from '@mui/icons-material';
import { DeleteCartLineButton } from '#/features/cart-view/components/delete-cart-line-button.tsx';
import type { ActiveCartLine } from '#/features/shared/cart';
import { ProductLineQty } from '#/features/cart-view/components/product-line-qty.tsx';
import { ProductPrice } from '#/components/product-price.tsx';
import type { CurrencyCode } from '#/graphql/generated.ts';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  line: ActiveCartLine;
  currencyCode: CurrencyCode;
}>;

export function ProductLine({ line, currencyCode }: Props) {
  const discounted = line.proratedLinePriceWithTax !== line.linePriceWithTax;

  return (
    <li className="cart-line">
      <div className="cart-line-image">
        {line.featuredAsset ? (
          <img
            src={line.featuredAsset.preview}
            alt={line.productVariant.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="collection-image-placeholder">
            <ImageNotSupportedOutlined />
            <span>{m.cart_line_no_image()}</span>
          </div>
        )}
      </div>
      <div className="cart-line-details">
        <h3>{line.productVariant.name}</h3>
        <div className="cart-line-prices">
          {discounted && (
            <del aria-label={m.cart_line_original_total_label()}>
              <ProductPrice
                price={line.linePriceWithTax}
                currencyCode={currencyCode}
              />
            </del>
          )}
          <ProductPrice
            price={line.proratedLinePriceWithTax}
            currencyCode={currencyCode}
          />
        </div>
        <span className="cart-note">{m.cart_line_total_note()}</span>
        <div className="cart-line-actions">
          <ProductLineQty
            quantity={line.quantity}
            orderLineId={line.id}
            productName={line.productVariant.name}
          />
          <DeleteCartLineButton
            orderLineId={line.id}
            productName={line.productVariant.name}
          />
        </div>
      </div>
    </li>
  );
}
