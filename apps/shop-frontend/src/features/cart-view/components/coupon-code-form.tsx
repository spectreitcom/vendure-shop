import { Button, Snackbar, TextField } from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { applyCouponCode } from '#/features/cart-view';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { useActiveCart } from '#/features/shared/cart';

const formValidationSchema = z.object({
  couponCode: z
    .string()
    .trim()
    .min(3, 'Enter a coupon code of at least 3 characters'),
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
        await applyCouponCodeFn({
          data: { couponCode: value.couponCode.trim() },
        });
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
      }
    },
  });

  return (
    <>
      <form
        className="cart-coupon-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!submitting) void form.handleSubmit();
        }}
      >
        <form.Field
          name={'couponCode'}
          children={(field) => (
            <>
              <TextField
                value={field.state.value}
                label="Coupon code"
                placeholder="Enter your code"
                disabled={submitting}
                fullWidth
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
          type="submit"
          variant="outlined"
          loading={submitting}
          disabled={submitting}
        >
          Apply
        </Button>
      </form>
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
