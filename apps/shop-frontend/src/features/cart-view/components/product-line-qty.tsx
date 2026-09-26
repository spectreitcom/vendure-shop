import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Snackbar } from '@mui/material';
import { adjustCartLine } from '#/features/cart-view';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { useActiveCart } from '#/features/shared/cart';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  quantity: number;
  orderLineId: string;
  productName: string;
}>;

export function ProductLineQty({ quantity, orderLineId, productName }: Props) {
  const { refresh } = useActiveCart();
  const adjustCartLineFn = useServerFn(adjustCartLine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjust = async (qty: number) => {
    await adjustCartLineFn({ data: { orderLineId, quantity: qty } });
    await refresh();
  };

  const handleError = (e: unknown) => {
    if (e instanceof Error) {
      setError(e.message);
      return;
    }
    setError(m.cart_line_update_error());
  };

  const increaseQuantity = async () => {
    const nextQty = quantity + 1;
    if (nextQty < 0 || nextQty > 100) return;
    setLoading(true);

    try {
      await adjust(nextQty);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = async () => {
    const nextQty = quantity - 1;
    if (nextQty < 1) return;
    setLoading(true);

    try {
      await adjust(nextQty);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cart-quantity"
      role="group"
      aria-label={m.cart_line_quantity_label({ productName })}
      aria-busy={loading}
    >
      <IconButton
        aria-label={m.cart_line_decrease_quantity_label({ productName })}
        disabled={loading || quantity <= 1}
        onClick={decreaseQuantity}
      >
        <RemoveIcon />
      </IconButton>
      <span aria-live="polite">{quantity}</span>
      <IconButton
        aria-label={m.cart_line_increase_quantity_label({ productName })}
        disabled={loading || quantity >= 100}
        onClick={increaseQuantity}
      >
        <AddIcon />
      </IconButton>
      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />
    </div>
  );
}
