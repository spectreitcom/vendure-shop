import { Link, useRouter } from '@tanstack/react-router';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useId, useState } from 'react';
import { logout, useActiveUser } from '#/features/shared/authentication';
import { useServerFn } from '@tanstack/react-start';
import { useActiveCart } from '#/features/shared/cart';

export function AuthButtons() {
  const {
    isFetching,
    activeUser,
    refresh: refreshActiveUser,
  } = useActiveUser();
  const { refresh: refreshActiveCart } = useActiveCart();
  const router = useRouter();
  const profileId = useId();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchor);
  const closeMenu = () => setMenuAnchor(null);

  const logoutFn = useServerFn(logout);

  const handleLogout = async () => {
    closeMenu();
    await logoutFn();
    await refreshActiveUser();
    await refreshActiveCart();
    await router.navigate({ to: '/auth/login' });
  };

  if (isFetching) return null;

  if (!activeUser) {
    return (
      <>
        <Link to={'/auth/login'}>
          <Button color="inherit" component="span">
            Login
          </Button>
        </Link>
        <Link to={'/auth/registration'}>
          <Button color="inherit" component="span">
            Register
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Button
        id={`${profileId}-button`}
        color="inherit"
        aria-controls={isMenuOpen ? `${profileId}-menu` : undefined}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen ? 'true' : undefined}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        Profile
      </Button>
      <Menu
        id={`${profileId}-menu`}
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-labelledby': `${profileId}-button` } }}
      >
        <MenuItem component={Link} to="/s/orders" onClick={closeMenu}>
          Orders
        </MenuItem>
        <MenuItem component={Link} to="/s/addresses" onClick={closeMenu}>
          Addresses
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
