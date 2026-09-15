export type Props = Readonly<{
  price: number;
  currencyCode: string;
  className?: string;
}>;

export function ProductPrice({ currencyCode, price, className }: Props) {
  if (!Number.isInteger(price)) throw Error('Price must be an integer');

  return (
    <div className={className}>
      {price / 100} {currencyCode}
    </div>
  );
}
