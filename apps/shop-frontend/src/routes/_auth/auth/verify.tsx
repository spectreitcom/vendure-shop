import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { verifyPageSearchSchema } from '#/features/authentication/schemas';
import { AuthLayout } from '#/components/auth-layout';
import {
  CheckCircleOutlined,
  MarkEmailUnreadOutlined,
} from '@mui/icons-material';
import { verifyCustomerAccount } from '#/features/authentication';
import { m } from '#/paraglide/messages';

type LoaderResponse = { error: true; message: string } | { error: false };

export const Route = createFileRoute('/_auth/auth/verify')({
  component: RouteComponent,
  validateSearch: verifyPageSearchSchema.extend({
    token: verifyPageSearchSchema.shape.token.catch(''),
  }),
  pendingComponent: PendingComponent,
  loaderDeps: ({ search }) => ({
    token: search.token,
  }),
  loader: async ({ deps: { token } }) => {
    if (!token)
      return {
        error: true,
        message: m.verify_missing_token(),
      } satisfies LoaderResponse;
    try {
      await verifyCustomerAccount({ data: { token } });

      return {
        error: false,
      } satisfies LoaderResponse;
    } catch (e) {
      let message: string;

      if (e instanceof Error) {
        message = e.message;
      } else {
        message = m.verify_invalid_token();
      }

      return {
        error: true,
        message,
      } satisfies LoaderResponse;
    }
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  return (
    <AuthLayout
      breadcrumb={m.verify_title()}
      introTitle={m.verify_intro_title()}
      introDescription={m.verify_intro_description()}
    >
      <header className="auth-form-heading">
        <span className="auth-eyebrow">{m.verify_title()}</span>
        <h1>
          {loaderData.error ? m.verify_error_title() : m.verify_success_title()}
        </h1>
        <p>
          {loaderData.error
            ? m.verify_error_description()
            : m.verify_success_description()}
        </p>
      </header>
      <div className="auth-status" role={loaderData.error ? 'alert' : 'status'}>
        {loaderData.error ? (
          <MarkEmailUnreadOutlined />
        ) : (
          <CheckCircleOutlined />
        )}
        <p>
          {loaderData.error ? loaderData.message : m.verify_success_message()}
        </p>
      </div>
      <div className="auth-switch">
        <Link to="/auth/login">{m.verify_continue_sign_in()}</Link>
        <Link to="/">{m.common_explore_shop()}</Link>
      </div>
    </AuthLayout>
  );
}
