import type { CurrencyCode } from '#/graphql/schema-types.ts';
import { cn } from '#/utils';

export type Props = Readonly<{
  price: number;
  currencyCode: CurrencyCode;
  className?: string;
}>;

export function ProductPrice({ currencyCode, price, className }: Props) {
  if (!Number.isInteger(price)) throw Error('Price must be an integer');

  return (
    <div className={cn('flex items-center flex-nowrap gap-1', className)}>
      <span>{price / 100}</span>
      <span>{currencyCode}</span>
    </div>
  );
}
