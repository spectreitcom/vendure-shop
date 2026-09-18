import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Snackbar } from '@mui/material';
import { adjustCartLine } from '#/features/cart-view';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { useActiveCart } from '#/features/shared/cart';

type Props = Readonly<{
  quantity: number;
  orderLineId: string;
}>;

export function ProductLineQty({ quantity, orderLineId }: Props) {
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
    setError('Error occurred during updating a cart');
  };

  const increaseQuantity = async () => {
    setLoading(true);
    const nextQty = quantity + 1;
    if (nextQty < 0 || nextQty > 100) return;

    try {
      await adjust(nextQty);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = async () => {
    setLoading(true);
    const nextQty = quantity - 1;
    if (nextQty < 0) return;
    try {
      await adjust(nextQty);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'flex items-center gap-2'}>
      <IconButton disabled={loading} onClick={decreaseQuantity}>
        <RemoveIcon />
      </IconButton>
      <span>{quantity}</span>
      <IconButton disabled={loading} onClick={increaseQuantity}>
        <AddIcon />
      </IconButton>
      <Snackbar open={!!error} message={error} autoHideDuration={6000} />
    </div>
  );
}
