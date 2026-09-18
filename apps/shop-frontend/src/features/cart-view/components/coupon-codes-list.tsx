import { Chip, Snackbar } from '@mui/material';
import { useActiveCart } from '#/features/shared/cart';
import { useServerFn } from '@tanstack/react-start';
import { removeCouponCode } from '#/features/cart-view';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export function CouponCodesList() {
  const { activeCart, refresh } = useActiveCart();
  const removeCouponCodeFn = useServerFn(removeCouponCode);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!activeCart) return;

  const handleRemoveCouponCode = async (couponCode: string) => {
    try {
      await removeCouponCodeFn({ data: { couponCode } });
      setShowSuccess(true);
      await refresh();
    } catch (e) {
      setShowSuccess(false);

      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <>
      {activeCart.promotions.map((promotion) => (
        <Chip
          label={promotion.couponCode}
          variant="outlined"
          deleteIcon={<CloseIcon />}
          onDelete={() => handleRemoveCouponCode(promotion.couponCode ?? '')}
        />
      ))}

      <Snackbar
        open={showSuccess}
        message="Coupon code removed successfully"
        autoHideDuration={6000}
      />

      <Snackbar open={!!error} message={error} autoHideDuration={6000} />
    </>
  );
}
