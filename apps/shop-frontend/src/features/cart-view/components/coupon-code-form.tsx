import { Button, Snackbar, TextField } from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { applyCouponCode } from '#/features/cart-view';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { useActiveCart } from '#/features/shared/cart';
import { m } from '#/paraglide/messages';

const formValidationSchema = z.object({
  couponCode: z
    .string()
    .trim()
    .min(3, { error: () => m.cart_coupon_code_min_length() }),
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
          setError(m.cart_coupon_code_apply_error());
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
                label={m.cart_coupon_code_label()}
                placeholder={m.cart_coupon_code_placeholder()}
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
          {m.cart_coupon_code_apply()}
        </Button>
      </form>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        message={m.cart_coupon_code_applied()}
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
