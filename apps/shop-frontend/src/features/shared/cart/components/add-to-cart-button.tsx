import { ShoppingCart } from '@mui/icons-material';
import { Button, IconButton, Snackbar } from '@mui/material';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { addItemToCart, useActiveCart } from '#/features/shared/cart';

type Props = {
  variant: 'small' | 'large';
  className?: string;
  quantity: number;
  productVariantId: string;
};

export function AddToCartButton({
  variant,
  className,
  productVariantId,
  quantity,
}: Props) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const { refresh: refreshActiveCart } = useActiveCart();

  const addItemToCartFn = useServerFn(addItemToCart);

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setShowSuccessSnackbar(false);
    setError(null);

    setAddingToCart(true);

    try {
      await addItemToCartFn({
        data: {
          productVariantId,
          quantity,
        },
      });
      setShowSuccessSnackbar(true);
      await refreshActiveCart();
    } catch {
      setError(`Add to Cart Error`);
    } finally {
      setAddingToCart(false);
    }
  };

  let component = null;

  if (variant === 'small') {
    component = (
      <IconButton
        loading={addingToCart}
        className={className}
        size={'medium'}
        aria-label="Add to cart"
        color={'primary'}
        onClick={handleAddToCart}
      >
        <ShoppingCart />
      </IconButton>
    );
  }

  if (variant === 'large') {
    component = (
      <Button
        loading={addingToCart}
        className={'w-full'}
        variant={'contained'}
        size={'large'}
        onClick={handleAddToCart}
        startIcon={<ShoppingCart />}
      >
        Add to Cart
      </Button>
    );
  }

  return (
    <>
      {component}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        message={error}
        onClick={() => setError(null)}
      />
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        message={'Product został dodany poprawnie do koszyka'}
        onClose={() => setShowSuccessSnackbar(false)}
      />
    </>
  );
}
