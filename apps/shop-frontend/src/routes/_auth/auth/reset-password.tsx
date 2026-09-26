import { AuthLayout } from '#/components/auth-layout';
import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  ChangePasswordForm,
  ResetPasswordForm,
} from '#/features/reset-password';
import { z } from 'zod';
import { m } from '#/paraglide/messages';

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
      breadcrumb={
        token
          ? m.reset_password_breadcrumb_new()
          : m.reset_password_breadcrumb()
      }
      introTitle={m.reset_password_intro_title()}
      introDescription={m.reset_password_intro_description()}
    >
      {token ? (
        <ChangePasswordForm key={token} token={token} />
      ) : (
        <ResetPasswordForm />
      )}
    </AuthLayout>
  );
}
