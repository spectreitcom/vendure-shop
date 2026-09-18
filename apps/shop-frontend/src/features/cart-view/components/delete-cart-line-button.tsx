import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { IconButton, Snackbar } from '@mui/material';
import { useActiveCart } from '#/features/shared/cart';
import { useServerFn } from '@tanstack/react-start';
import { removeCartLine } from '#/features/cart-view';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';

type Props = Readonly<{ orderLineId: string }>;

export function DeleteCartLineButton({ orderLineId }: Props) {
  const { refresh } = useActiveCart();
  const deleteCartLineFn = useServerFn(removeCartLine);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCartLine = async () => {
    try {
      setIsDeleting(true);
      await deleteCartLineFn({ data: { orderLineId } });
      await router.invalidate();
      await refresh();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      setError('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <IconButton
        size={'large'}
        onClick={handleDeleteCartLine}
        loading={isDeleting}
        disabled={isDeleting}
      >
        <DeleteSweepOutlinedIcon color={'error'} />
      </IconButton>
      <Snackbar open={!!error} message={error} autoHideDuration={6000} />
    </>
  );
}
