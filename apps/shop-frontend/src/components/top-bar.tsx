import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@tanstack/react-router';
import { MenuCartButton } from '#/features/cart-view';
import { AuthButtons } from '#/features/shared/authentication';

export function TopBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to={'/'}>Vendure Shop</Link>
          </Typography>
          <MenuCartButton />
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
