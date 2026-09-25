import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isCustomerLoggedIn } from '#/features/authentication';
import { PendingComponent } from '#/components/pending-component.tsx';

export const Route = createFileRoute('/s')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  beforeLoad: async () => {
    const isLoggedIn = await isCustomerLoggedIn();
    if (!isLoggedIn) throw redirect({ to: '/' });
  },
});

function RouteComponent() {
  return <Outlet />;
}
