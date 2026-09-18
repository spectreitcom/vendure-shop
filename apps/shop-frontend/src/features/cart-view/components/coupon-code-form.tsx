import { Button, Snackbar, TextField } from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { applyCouponCode } from '#/features/cart-view';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { useActiveCart } from '#/features/shared/cart';

const formValidationSchema = z.object({
  couponCode: z.string().min(3, 'Coupon code is required'),
});

export function CouponCodeForm() {
  const applyCouponCodeFn = useServerFn(applyCouponCode);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useActiveCart();

  const form = useForm({
    defaultValues: {
      couponCode: '',
    },
    validators: {
      onSubmit: formValidationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitting(true);
        await applyCouponCodeFn({ data: { couponCode: value.couponCode } });
        setShowSuccessSnackbar(true);
        form.reset();
        await refresh();
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Error during applying a coupon code');
        }
      } finally {
        setSubmitting(false);
        setShowSuccessSnackbar(false);
      }
    },
  });

  return (
    <>
      <div className={'flex items-center gap-4'}>
        <form.Field
          name={'couponCode'}
          children={(field) => (
            <>
              <TextField
                value={field.state.value}
                placeholder={'Enter coupon code'}
                variant={'outlined'}
                size={'small'}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors.map(
                  (fieldError) => fieldError?.message ?? '',
                )}
              />
            </>
          )}
        />
        <Button
          onClick={() => form.handleSubmit()}
          loading={submitting}
          disabled={submitting}
        >
          Apply
        </Button>
      </div>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        message={'Coupon code applied successfully'}
        onClose={() => setShowSuccessSnackbar(false)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        message={error}
        onClose={() => setError(null)}
      />
    </>
  );
}
