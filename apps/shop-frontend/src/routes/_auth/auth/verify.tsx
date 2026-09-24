import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { verifyPageSearchSchema } from '#/features/authentication/schemas';
import { AuthLayout } from '#/components/auth-layout';
import {
  CheckCircleOutlined,
  MarkEmailUnreadOutlined,
} from '@mui/icons-material';
import { verifyCustomerAccount } from '#/features/authentication';

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
        message:
          'Open the verification link from your email to activate your account.',
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
        message = 'Invalid token';
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
      breadcrumb="Account verification"
      introTitle={'One last step.\nThen you’re home.'}
      introDescription="Verify your email address to finish setting up your account."
    >
      <header className="auth-form-heading">
        <span className="auth-eyebrow">Account verification</span>
        <h1>
          {loaderData.error ? 'Check your verification link' : 'You’re all set'}
        </h1>
        <p>
          {loaderData.error
            ? 'We couldn’t verify your account with this link.'
            : 'Your email address has been verified.'}
        </p>
      </header>
      <div className="auth-status" role={loaderData.error ? 'alert' : 'status'}>
        {loaderData.error ? (
          <MarkEmailUnreadOutlined />
        ) : (
          <CheckCircleOutlined />
        )}
        <p>
          {loaderData.error
            ? loaderData.message
            : 'Your account is ready. Continue to sign in or explore the shop.'}
        </p>
      </div>
      <div className="auth-switch">
        <Link to="/auth/login">Continue to sign in</Link>
        <Link to="/">Explore the shop</Link>
      </div>
    </AuthLayout>
  );
}
