import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '#/features/authentication/components/login-form.tsx';
import { CircularProgress } from '@mui/material';

export const Route = createFileRoute('/_auth/auth/login')({
  component: RouteComponent,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
});

function RouteComponent() {
  return (
    <div className={'flex  justify-center'}>
      <div className={'mt-64 w-[500px]'}>
        <LoginForm />
      </div>
    </div>
  );
}
