import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
} from '@mui/material';
import type {
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '#/graphql/generated.ts';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '#/utils';

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
  error,
  helperText,
}: Props) {
  const cachedShippingMethods = useMemo(
    () => shippingMethods,
    [shippingMethods],
  );

  return (
    <div>
      <FormControl error={error}>
        {cachedShippingMethods.map((method) => (
          <FormControlLabel
            className={cn(error && 'border border-red-500')}
            checked={method.id === value}
            key={method.id}
            value={method.id}
            control={<Radio onChange={(e) => onChange?.(e.target.value)} />}
            label={`${method.name} - ${method.priceWithTax / 100} ${currencyCode}`}
          />
        ))}
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
