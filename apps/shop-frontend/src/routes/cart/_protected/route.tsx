import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isCustomerLoggedIn } from '#/features/authentication';

export const Route = createFileRoute('/cart/_protected')({
  component: RouteComponent,
  beforeLoad: async () => {
    const isLoggedIn = await isCustomerLoggedIn();
    if (!isLoggedIn) throw redirect({ to: '/' });
  },
});

function RouteComponent() {
  return <Outlet />;
}
