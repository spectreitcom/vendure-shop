import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { CheckoutView, getEligibleShippingMethods } from '#/features/checkout';
import { PurchaseLayout } from '#/components/purchase-layout';
import type { EligibleShippingMethodsQuery } from '#/graphql/generated.ts';
import { m } from '#/paraglide/messages';

type LoaderSuccess = {
  error: false;
  shippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
};

type LoaderError = {
  error: true;
  message: string;
};

type LoaderResult = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/cart/_protected/checkout')({
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
        message: m.common_unknown_error(),
      } satisfies LoaderResult;
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <PurchaseLayout
      step={1}
      title={m.checkout_title()}
      description={m.checkout_description()}
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
        <CheckoutView shippingMethods={data.shippingMethods} />
      )}
    </PurchaseLayout>
  );
}
