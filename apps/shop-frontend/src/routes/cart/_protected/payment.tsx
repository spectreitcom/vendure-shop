import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import {
  getEligiblePaymentMethods,
  PaymentViewContent,
} from '#/features/payment';
import { Typography } from '@mui/material';

type LoaderSuccess = {
  error: false;
  paymentMethods: EligiblePaymentMethodsQuery['eligiblePaymentMethods'];
};

type LoaderError = {
  error: true;
  message: string;
};

type LoaderResponse = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/cart/_protected/payment')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async () => {
    try {
      const paymentMethods = await getEligiblePaymentMethods();
      return { error: false, paymentMethods } satisfies LoaderResponse;
    } catch (error) {
      return {
        error: true,
        message: 'Failed to load payment methods',
      } satisfies LoaderResponse;
    }
  },
});

function RouteComponent() {
  const { paymentMethods } = Route.useLoaderData();

  return (
    <div className={'mt-8'}>
      <div className={'container'}>
        <Typography variant={'h4'} component={'h1'}>
          Payment
        </Typography>
        <div className={'mt-4'}>
          {paymentMethods?.length ? (
            <PaymentViewContent paymentMethods={paymentMethods} />
          ) : (
            <Typography color={'error'}>
              Failed to load payment methods
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
