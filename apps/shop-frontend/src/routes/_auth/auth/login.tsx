import { AuthLayout } from '#/components/auth-layout';
import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { LoginForm } from '#/features/authentication/components/login-form.tsx';

export const Route = createFileRoute('/_auth/auth/login')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
