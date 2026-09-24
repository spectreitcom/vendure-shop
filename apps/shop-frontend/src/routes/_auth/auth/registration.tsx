import { AuthLayout } from '#/components/auth-layout';
import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { RegistrationForm } from '#/features/registration';

export const Route = createFileRoute('/_auth/auth/registration')({
  pendingComponent: PendingComponent,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout registration>
      <RegistrationForm />
    </AuthLayout>
  );
}
