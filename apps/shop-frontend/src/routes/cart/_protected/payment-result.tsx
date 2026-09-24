import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import {
  CheckCircleOutlined,
  HourglassEmpty,
  InfoOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { PurchaseLayout } from '#/components/purchase-layout';
import { ProductPrice } from '#/components/product-price';
import { getPaymentOrderResult } from '#/features/payment/api/order-result';
import { PendingComponent } from '#/components/pending-component';

export const Route = createFileRoute('/cart/_protected/payment-result')({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === 'string' ? search.orderId : '',
  }),
  loaderDeps: ({ search }) => ({ orderId: search.orderId }),
  loader: async ({ deps }) => {
    if (!deps.orderId) return { order: null, error: false };
    try {
      return {
        order: await getPaymentOrderResult({ data: deps }),
        error: false,
      };
    } catch {
      return { order: null, error: true };
    }
  },
  pendingComponent: PendingComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const { order, error } = Route.useLoaderData();
  const router = useRouter();
  const confirmed =
    !!order &&
    [
      'PaymentSettled',
      'PaymentAuthorized',
      'Shipped',
      'PartiallyShipped',
      'Delivered',
      'PartiallyDelivered',
    ].includes(order.state);
  const cancelled = order?.state === 'Cancelled';
  const title = confirmed
    ? 'Thank you for your order'
    : cancelled
      ? 'Order cancelled'
      : order
        ? 'Payment in progress'
        : 'Check your order status';
  return (
    <PurchaseLayout
      step={confirmed ? 3 : 2}
      title={title}
      description={
        confirmed
          ? 'Your selection has found a new home.'
          : 'The latest information about your order.'
      }
    >
      <section className="purchase-result" aria-live="polite">
        {confirmed ? (
          <CheckCircleOutlined />
        ) : order && !cancelled ? (
          <HourglassEmpty />
        ) : (
          <InfoOutlined />
        )}
        <h2>
          {confirmed
            ? 'Your order is confirmed'
            : cancelled
              ? 'This order has been cancelled'
              : order
                ? 'Awaiting payment confirmation'
                : 'We couldn’t confirm your order'}
        </h2>
        <p>
          {confirmed
            ? 'Your payment has been accepted. Keep your order reference for your records.'
            : cancelled
              ? 'You can return to the shop to place a new order.'
              : order
                ? 'Your payment is not confirmed yet. Refresh the status before attempting another payment.'
                : error
                  ? 'Order status is temporarily unavailable. Please try again.'
                  : 'Open the confirmation link for your order to view its status.'}
        </p>
        {order && (
          <div className="purchase-result-details">
            <span className="collection-eyebrow">Order reference</span>
            <p>{order.code}</p>
            <ProductPrice
              price={order.totalWithTax}
              currencyCode={order.currencyCode}
            />
          </div>
        )}
        {!confirmed && !cancelled && (
          <Button variant="contained" onClick={() => router.invalidate()}>
            Refresh status
          </Button>
        )}
        <div>
          <Link to="/" className="collection-text-link">
            Continue shopping <ArrowForward fontSize="small" />
          </Link>
        </div>
      </section>
    </PurchaseLayout>
  );
}
