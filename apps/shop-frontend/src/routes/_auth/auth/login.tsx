import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { LoginForm } from '#/features/authentication/components/login-form.tsx';

export const Route = createFileRoute('/_auth/auth/login')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
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
