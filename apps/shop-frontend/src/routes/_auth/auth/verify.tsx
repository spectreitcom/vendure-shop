import { createFileRoute } from '@tanstack/react-router';
import { verifyPageSearchSchema } from '#/features/authentication/schemas';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { verifyCustomerAccount } from '#/features/authentication';

type LoaderResponse = { error: true; message: string } | { error: false };

export const Route = createFileRoute('/_auth/auth/verify')({
  component: RouteComponent,
  validateSearch: verifyPageSearchSchema,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
  loaderDeps: ({ search }) => ({
    token: search.token,
  }),
  loader: async ({ deps: { token } }) => {
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
    <div>
      <Card>
        <CardContent>
          {loaderData.error ? loaderData.message : 'Your account was verified'}
        </CardContent>
      </Card>
    </div>
  );
}
