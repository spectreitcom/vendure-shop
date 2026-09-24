import { AuthLayout } from '#/components/auth-layout';
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
    <AuthLayout
      breadcrumb={token ? 'New password' : 'Reset password'}
      introTitle={'A fresh start,\njust for you.'}
      introDescription="Let’s get you back to your account and the things you love."
    >
      {token ? (
        <ChangePasswordForm key={token} token={token} />
      ) : (
        <ResetPasswordForm />
      )}
    </AuthLayout>
  );
}
