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
import { m } from '#/paraglide/messages';

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
    ? m.payment_result_title_confirmed()
    : cancelled
      ? m.payment_result_title_cancelled()
      : order
        ? m.payment_result_title_pending()
        : m.payment_result_title_unknown();
  return (
    <PurchaseLayout
      step={confirmed ? 3 : 2}
      title={title}
      description={
        confirmed
          ? m.payment_result_description_confirmed()
          : m.payment_result_description()
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
            ? m.payment_result_heading_confirmed()
            : cancelled
              ? m.payment_result_heading_cancelled()
              : order
                ? m.payment_result_heading_pending()
                : m.payment_result_heading_unknown()}
        </h2>
        <p>
          {confirmed
            ? m.payment_result_message_confirmed()
            : cancelled
              ? m.payment_result_message_cancelled()
              : order
                ? m.payment_result_message_pending()
                : error
                  ? m.payment_result_message_error()
                  : m.payment_result_message_unknown()}
        </p>
        {order && (
          <div className="purchase-result-details">
            <span className="collection-eyebrow">
              {m.payment_result_order_reference()}
            </span>
            <p>{order.code}</p>
            <ProductPrice
              price={order.totalWithTax}
              currencyCode={order.currencyCode}
            />
          </div>
        )}
        {!confirmed && !cancelled && (
          <Button variant="contained" onClick={() => router.invalidate()}>
            {m.payment_result_refresh()}
          </Button>
        )}
        <div>
          <Link to="/" className="collection-text-link">
            {m.common_continue_shopping()} <ArrowForward fontSize="small" />
          </Link>
        </div>
      </section>
    </PurchaseLayout>
  );
}
