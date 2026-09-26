import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import type { EligiblePaymentMethodsQuery } from '#/graphql/generated.ts';
import {
  getEligiblePaymentMethods,
  PaymentViewContent,
} from '#/features/payment';
import { PurchaseLayout } from '#/components/purchase-layout';
import { m } from '#/paraglide/messages';

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
        message: m.payment_load_error(),
      } satisfies LoaderResponse;
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <PurchaseLayout
      step={2}
      title={m.payment_title()}
      description={m.payment_description()}
    >
      {data.error ? (
        <section className="collection-state" role="alert">
          <h2>{m.common_step_error_title()}</h2>
          <p>{data.message}</p>
          <Link to="/cart" className="collection-text-link">
            {m.common_return_to_cart()}
          </Link>
        </section>
      ) : (
        <PaymentViewContent paymentMethods={data.paymentMethods} />
      )}
    </PurchaseLayout>
  );
}
