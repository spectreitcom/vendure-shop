import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import {
  getEligiblePaymentMethods,
  PaymentViewContent,
} from '#/features/payment';
import { PurchaseLayout } from '#/components/purchase-layout';

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
  const data = Route.useLoaderData();
  return (
    <PurchaseLayout
      step={2}
      title="Complete your order"
      description="Review your selection and choose how you would like to pay."
    >
      {data.error ? (
        <section className="collection-state" role="alert">
          <h2>We couldn’t load this step</h2>
          <p>{data.message}</p>
          <Link to="/cart" className="collection-text-link">
            Return to cart
          </Link>
        </section>
      ) : (
        <PaymentViewContent paymentMethods={data.paymentMethods} />
      )}
    </PurchaseLayout>
  );
}
