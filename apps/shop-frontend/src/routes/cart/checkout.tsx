import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { CheckoutView, getEligibleShippingMethods } from '#/features/checkout';
import { Typography } from '@mui/material';
import type { EligibleShippingMethodsQuery } from '#/graphql/generated.ts';

type LoaderSuccess = {
  error: false;
  shippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
};

type LoaderError = {
  error: true;
  message: string;
};

type LoaderResult = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/cart/checkout')({
  pendingComponent: PendingComponent,
  component: RouteComponent,
  loader: async () => {
    try {
      const shippingMethods = await getEligibleShippingMethods();
      return {
        error: false,
        shippingMethods,
      } satisfies LoaderResult;
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        } satisfies LoaderResult;
      }
      return {
        error: true,
        message: 'Unknown error',
      } satisfies LoaderResult;
    }
  },
});

function RouteComponent() {
  const { shippingMethods } = Route.useLoaderData();

  return (
    <div className={'mt-8'}>
      <div className={'container'}>
        <Typography variant={'h4'} component={'h1'}>
          Checkout
        </Typography>
        <div className={'mt-4'}>
          <CheckoutView shippingMethods={shippingMethods ?? []} />
        </div>
      </div>
    </div>
  );
}
