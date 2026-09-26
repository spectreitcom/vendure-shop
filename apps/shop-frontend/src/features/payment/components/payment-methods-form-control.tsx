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
import { m } from '#/paraglide/messages';

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
          aria-label={m.payment_method_title()}
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
          <p className="purchase-note">{m.payment_no_methods()}</p>
        )}
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
