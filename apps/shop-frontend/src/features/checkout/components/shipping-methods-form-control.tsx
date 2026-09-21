import { FormControl, FormControlLabel, Radio } from '@mui/material';
import type {
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '#/graphql/generated.ts';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

type Props = Readonly<{
  value?: string;
  onChange?: (value: string | null) => void;
  error?: boolean;
  helperText?: ReactNode;
  shippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
  currencyCode: CurrencyCode;
}>;

export function ShippingMethodsFormControl({
  value,
  onChange,
  shippingMethods,
  currencyCode,
}: Props) {
  const cachedShippingMethods = useMemo(
    () => shippingMethods,
    [shippingMethods],
  );

  return (
    <div>
      <FormControl>
        {cachedShippingMethods.map((method) => (
          <FormControlLabel
            checked={method.id === value}
            key={method.id}
            value={method.id}
            control={<Radio onChange={(e) => onChange?.(e.target.value)} />}
            label={`${method.name} - ${method.priceWithTax / 100} ${currencyCode}`}
          />
        ))}
      </FormControl>
    </div>
  );
}
