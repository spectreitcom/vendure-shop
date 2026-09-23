import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import { Button, Card, CardContent, Grid, Snackbar } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import {
  addPaymentMethodToOrder,
  PaymentMethodsFormControl,
} from '#/features/payment';
import { useServerFn } from '@tanstack/react-start';
import { useActiveCart } from '#/features/shared/cart';
import { useRouter } from '@tanstack/react-router';

type Props = Readonly<{
  paymentMethods: EligiblePaymentMethodsQuery['eligiblePaymentMethods'];
}>;

const formSchema = z.object({
  method: z.string().min(1),
});

export function PaymentViewContent({ paymentMethods }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addPaymentMethodToOrderFn = useServerFn(addPaymentMethodToOrder);
  const { activeCart, refresh: refreshActiveCart } = useActiveCart();
  const router = useRouter();

  const form = useForm({
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      method: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        setError(null);
        await addPaymentMethodToOrderFn({
          data: { method: value.method, metadata: {} },
        });
        await refreshActiveCart();
        await router.navigate({
          to: '/cart/payment-result',
          search: {
            orderId: activeCart?.id ?? '',
          },
        });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError('An unexpected error occurred');
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <Grid container columns={12} spacing={4}>
        <Grid size={8}>
          <form.Field
            name={'method'}
            children={(field) => (
              <PaymentMethodsFormControl
                paymentMethods={paymentMethods}
                value={field.state.value}
                onChange={(code) => field.handleChange(code)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors
                  .map((e) => e?.message)
                  .join(', ')}
              />
            )}
          />
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Button
                type={'submit'}
                variant="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
                className={'w-full'}
              >
                Pay
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={!!error} message={error} autoHideDuration={6000} />
    </form>
  );
}
