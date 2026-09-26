import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from '@mui/material';
import type {
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '#/graphql/generated.ts';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '#/utils';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  value?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
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
  disabled,
  helperText,
}: Props) {
  const cachedShippingMethods = useMemo(
    () => shippingMethods,
    [shippingMethods],
  );

  return (
    <div>
      <FormControl
        disabled={disabled}
        error={error}
        className="purchase-methods"
      >
        <RadioGroup
          aria-label={m.checkout_shipping_method()}
          name="shippingMethod"
          value={value ?? ''}
        >
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
        </RadioGroup>
        {!shippingMethods.length && (
          <p className="purchase-note">{m.checkout_no_shipping_methods()}</p>
        )}
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
