import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { RegistrationForm } from '#/features/registration';

export const Route = createFileRoute('/_auth/auth/registration')({
  pendingComponent: PendingComponent,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={'flex  justify-center'}>
      <div className={'mt-64 w-[500px]'}>
        <RegistrationForm />
      </div>
    </div>
  );
}
