import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Badge, IconButton } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';

export function MenuCartButton() {
  const { activeCart } = useActiveCart();

  return (
    <Link
      to={'/cart'}
      aria-label={`Cart, ${activeCart?.totalQuantity ?? 0} items`}
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
