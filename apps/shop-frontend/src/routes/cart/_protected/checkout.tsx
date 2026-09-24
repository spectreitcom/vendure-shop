import { createFileRoute, Link } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { CheckoutView, getEligibleShippingMethods } from '#/features/checkout';
import { PurchaseLayout } from '#/components/purchase-layout';
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
        message: 'Unknown error',
      } satisfies LoaderResult;
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <PurchaseLayout
      step={1}
      title="Delivery details"
      description="A few details, and your selection will be on its way."
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
        <CheckoutView shippingMethods={data.shippingMethods} />
      )}
    </PurchaseLayout>
  );
}
