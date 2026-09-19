import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getCurrentUser } from '#/features/authentication';

class ActiveUserError extends Error {}

const checkIfUserIsLoggedIn = async () => {
  await getCurrentUser();
  throw new ActiveUserError();
};

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async () => {
    try {
      await checkIfUserIsLoggedIn();
    } catch (e) {
      if (e instanceof ActiveUserError) {
        throw redirect({ to: '/' });
      }
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
