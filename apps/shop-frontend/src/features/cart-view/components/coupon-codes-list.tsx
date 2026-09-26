import { Chip, Snackbar } from '@mui/material';
import { useActiveCart } from '#/features/shared/cart';
import { useServerFn } from '@tanstack/react-start';
import { removeCouponCode } from '#/features/cart-view';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { m } from '#/paraglide/messages';

export function CouponCodesList() {
  const { activeCart, refresh } = useActiveCart();
  const removeCouponCodeFn = useServerFn(removeCouponCode);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [removing, setRemoving] = useState(false);

  if (!activeCart) return null;

  const handleRemoveCouponCode = async (couponCode: string) => {
    try {
      setRemoving(true);
      await removeCouponCodeFn({ data: { couponCode } });
      setShowSuccess(true);
      await refresh();
    } catch (e) {
      setShowSuccess(false);

      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(m.cart_coupon_code_remove_error());
      }
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <div className="cart-coupons">
        {activeCart.promotions
          .filter((promotion) => promotion.couponCode)
          .map((promotion) => (
            <Chip
              key={promotion.id}
              label={promotion.couponCode}
              variant="outlined"
              disabled={removing}
              deleteIcon={<CloseIcon />}
              onDelete={() =>
                handleRemoveCouponCode(promotion.couponCode ?? '')
              }
            />
          ))}
      </div>

      <Snackbar
        open={showSuccess}
        message={m.cart_coupon_code_removed()}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      />

      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />
    </>
  );
}
