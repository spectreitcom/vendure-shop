import { ShoppingCart } from '@mui/icons-material';
import { Button, IconButton, Snackbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { addItemToCart, useActiveCart } from '#/features/shared/cart';
import { m } from '#/paraglide/messages';

type Props = {
  variant: 'small' | 'large';
  className?: string;
  quantity: number;
  productVariantId: string;
  disabled?: boolean;
  isOutOfStock?: boolean;
};

export function AddToCartButton({
  variant,
  className,
  productVariantId,
  quantity,
  disabled = false,
  isOutOfStock = false,
}: Props) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const { refresh: refreshActiveCart } = useActiveCart();

  const addItemToCartFn = useServerFn(addItemToCart);

  const isDisabled = disabled || isOutOfStock || addingToCart;

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError(m.add_to_cart_error());
    } finally {
      setAddingToCart(false);
    }
  };

  let component = null;

  if (variant === 'small') {
    const iconButton = (
      <IconButton
        loading={addingToCart}
        className={[className, isOutOfStock ? 'is-out-of-stock' : '']
          .filter(Boolean)
          .join(' ')}
        size={'medium'}
        aria-label={
          isOutOfStock ? m.add_to_cart_out_of_stock() : m.add_to_cart_label()
        }
        title={isOutOfStock ? m.add_to_cart_out_of_stock() : undefined}
        color={'primary'}
        onClick={handleAddToCart}
        disabled={isDisabled}
      >
        <ShoppingCart />
      </IconButton>
    );

    component = isOutOfStock ? (
      <Tooltip title={m.add_to_cart_out_of_stock()} arrow>
        <span className="inline-flex">{iconButton}</span>
      </Tooltip>
    ) : (
      iconButton
    );
  }

  if (variant === 'large') {
    component = (
      <Button
        loading={addingToCart}
        disabled={isDisabled}
        className={['w-full', className, isOutOfStock ? 'is-out-of-stock' : '']
          .filter(Boolean)
          .join(' ')}
        variant={'contained'}
        size={'large'}
        onClick={handleAddToCart}
        startIcon={<ShoppingCart />}
      >
        {isOutOfStock ? m.add_to_cart_out_of_stock() : m.add_to_cart_button()}
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
        message={m.add_to_cart_success()}
        onClose={() => setShowSuccessSnackbar(false)}
      />
    </>
  );
}
