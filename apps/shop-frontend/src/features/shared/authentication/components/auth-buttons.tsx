import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@mui/material';
import { logout, useActiveUser } from '#/features/shared/authentication';
import { useServerFn } from '@tanstack/react-start';

export function AuthButtons() {
  const { isFetching, activeUser, refresh } = useActiveUser();
  const router = useRouter();

  const logoutFn = useServerFn(logout);

  const handleLogout = async () => {
    await logoutFn();
    await refresh();
    await router.navigate({ to: '/auth/login' });
  };

  if (isFetching) return null;

  if (!activeUser) {
    return (
      <>
        <Link to={'/auth/login'}>
          <Button color="inherit">Login</Button>
        </Link>
        <Link to={'/auth/registration'}>
          <Button color="inherit">Register</Button>
        </Link>
      </>
    );
  }

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
}
