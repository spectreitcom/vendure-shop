import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import { Button, Snackbar } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import {
  addPaymentMethodToOrder,
  PaymentMethodsFormControl,
} from '#/features/payment';
import { useServerFn } from '@tanstack/react-start';
import { useActiveCart } from '#/features/shared/cart';
import { PurchaseSummary } from '#/components/purchase-layout';
import { useRouter } from '@tanstack/react-router';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  paymentMethods: EligiblePaymentMethodsQuery['eligiblePaymentMethods'];
}>;

const formSchema = z.object({
  method: z.string().min(1, { error: () => m.payment_method_required() }),
});

export function PaymentViewContent({ paymentMethods }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addPaymentMethodToOrderFn = useServerFn(addPaymentMethodToOrder);
  const { activeCart, refresh: refreshActiveCart, fetching } = useActiveCart();
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
        setError(m.common_unexpected_error());
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (fetching && !activeCart)
    return (
      <p className="purchase-note" role="status">
        {m.common_loading_order()}
      </p>
    );

  if (!activeCart?.lines.length)
    return <p className="purchase-note">{m.payment_no_order()}</p>;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <div className="purchase-grid">
        <section className="purchase-panel">
          <h2>{m.payment_method_title()}</h2>
          <p className="purchase-note">{m.payment_method_hint()}</p>
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
        </section>
        <PurchaseSummary>
          <Button
            type={'submit'}
            variant="contained"
            disabled={
              isSubmitting || !paymentMethods.length || !activeCart.lines.length
            }
            loading={isSubmitting}
            className={'w-full'}
          >
            {m.payment_submit()}
          </Button>
        </PurchaseSummary>
      </div>

      <Snackbar
        open={!!error}
        message={error}
        onClose={() => setError(null)}
        autoHideDuration={6000}
      />
    </form>
  );
}
