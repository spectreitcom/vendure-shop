import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Badge, IconButton } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { m } from '#/paraglide/messages';

export function MenuCartButton() {
  const { activeCart } = useActiveCart();

  return (
    <Link
      to={'/cart'}
      aria-label={m.cart_menu_label({
        count: activeCart?.totalQuantity ?? 0,
      })}
    >
      <IconButton color="inherit" component="span">
        <Badge
          badgeContent={activeCart ? activeCart.totalQuantity : undefined}
          color={'error'}
        >
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>
    </Link>
  );
}
