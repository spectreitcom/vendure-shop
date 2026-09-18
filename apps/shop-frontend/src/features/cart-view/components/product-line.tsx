import { ListItem, Typography } from '@mui/material';
import { DeleteCartLineButton } from '#/features/cart-view/components/delete-cart-line-button.tsx';
import type { ActiveCartLine } from '#/features/shared/cart';
import { ProductLineQty } from '#/features/cart-view/components/product-line-qty.tsx';
import { ProductPrice } from '#/components/product-price.tsx';
import type { CurrencyCode } from '#/graphql/generated.ts';
import { cn } from '#/utils';

type Props = Readonly<{
  line: ActiveCartLine;
  currencyCode: CurrencyCode;
}>;

export function ProductLine({ line, currencyCode }: Props) {
  return (
    <ListItem>
      <div className={'flex gap-4'}>
        <div className={'w-[250px] h-[150px] overflow-hidden'}>
          {line.featuredAsset && (
            <img
              className={'aspect-4/3 object-cover'}
              src={line.featuredAsset.preview}
              alt={'image'}
              loading={'lazy'}
            />
          )}
        </div>
        <div>
          <Typography variant={'h5'} component={'h3'}>
            {line.productVariant.name}
          </Typography>
          <ProductPrice
            className={cn(
              line.proratedLinePriceWithTax !== line.linePriceWithTax &&
                'line-through',
            )}
            price={line.linePriceWithTax}
            currencyCode={currencyCode}
          />
          {line.proratedLinePriceWithTax !== line.linePriceWithTax && (
            <ProductPrice
              price={line.proratedLinePriceWithTax}
              currencyCode={currencyCode}
            />
          )}
          <ProductLineQty quantity={line.quantity} orderLineId={line.id} />
          <DeleteCartLineButton orderLineId={line.id} />
        </div>
      </div>
    </ListItem>
  );
}
