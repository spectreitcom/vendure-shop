import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  ChangePasswordForm,
  ResetPasswordForm,
} from '#/features/reset-password';
import { z } from 'zod';

const searchInputSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/_auth/auth/reset-password')({
  pendingComponent: PendingComponent,
  component: RouteComponent,
  validateSearch: searchInputSchema,
  loaderDeps: ({ search }) => ({ token: search.token }),
});

function RouteComponent() {
  const { token } = Route.useLoaderDeps();

  return (
    <div className={'flex  justify-center'}>
      <div className={'mt-64 w-[500px]'}>
        {token ? <ChangePasswordForm token={token} /> : <ResetPasswordForm />}
      </div>
    </div>
  );
}
