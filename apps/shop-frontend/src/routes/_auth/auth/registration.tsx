import { createFileRoute } from '@tanstack/react-router';
import { RegistrationForm } from '#/features/registration';

export const Route = createFileRoute('/_auth/auth/registration')({
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
