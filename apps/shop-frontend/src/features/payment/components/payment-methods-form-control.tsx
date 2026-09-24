import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import { useMemo } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from '@mui/material';
import { cn } from '#/utils';

type Props = Readonly<{
  paymentMethods: EligiblePaymentMethodsQuery['eligiblePaymentMethods'];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
}>;

export function PaymentMethodsFormControl({
  paymentMethods,
  value,
  helperText,
  error,
  onChange,
}: Props) {
  const cachedPaymentMethods = useMemo(() => paymentMethods, [paymentMethods]);

  return (
    <div>
      <FormControl error={error} className="purchase-methods">
        <RadioGroup
          aria-label="Payment method"
          name="paymentMethod"
          value={value ?? ''}
        >
          {cachedPaymentMethods.map((method) => (
            <FormControlLabel
              className={cn(error && 'border border-red-500')}
              checked={method.code === value}
              key={method.id}
              value={method.code}
              control={<Radio onChange={(e) => onChange?.(e.target.value)} />}
              label={method.name}
            />
          ))}
        </RadioGroup>
        {!paymentMethods.length && (
          <p className="purchase-note">
            No payment methods are available right now. Please try again later.
          </p>
        )}
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
