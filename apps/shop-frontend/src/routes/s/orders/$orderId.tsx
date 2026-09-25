import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import {
  ArrowBack,
  Inventory2Outlined,
  ReceiptLongOutlined,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { ProductPrice } from '#/components/product-price.tsx';
import { dateFormatter, statuses } from '#/features/orders-view/presentation';
import '#/features/collection-view/collection.css';
import '#/features/orders-view/orders.css';
import '#/features/order-detials/order-details.css';
import { PendingComponent } from '#/components/pending-component.tsx';
import type { OrderQuery } from '#/graphql/generated.ts';
import { getOrder } from '#/features/order-detials';

type LoaderSuccess = {
  error: false;
  order: OrderQuery['order'];
};

type LoaderError = {
  error: true;
  message: string;
};

type LoaderData = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/s/orders/$orderId')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ params: { orderId } }) => {
    try {
      const order = await getOrder({ data: { id: orderId } });
      return { error: false, order } satisfies LoaderData;
    } catch {
      return {
        error: true,
        message: 'Failed to fetch order',
      } satisfies LoaderData;
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const order = data.error ? null : data.order;
  const status = order
    ? (statuses[order.state] ?? {
        label: order.state.replace(/([a-z])([A-Z])/g, '$1 $2'),
        tone: 'neutral',
      })
    : null;
  const date = order?.orderPlacedAt ?? order?.createdAt;

  return (
    <main className="collection-page orders-page order-page">
      <div className="collection-shell">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/s/orders" search={{ page: 1 }}>
            Orders
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {order ? `#${order.code}` : 'Order details'}
          </span>
        </nav>
        <header className="orders-heading">
          <span className="collection-eyebrow">Your account</span>
          <h1>{order ? `Order #${order.code}` : 'Order details'}</h1>
          {order && status && date && (
            <div className="order-heading-meta">
              <p>
                {order.orderPlacedAt ? 'Placed on' : 'Created on'}{' '}
                <time dateTime={date}>
                  {dateFormatter.format(new Date(date))}
                </time>
              </p>
              <span className={`orders-status orders-status-${status.tone}`}>
                {status.label}
              </span>
            </div>
          )}
        </header>
        {data.error ? (
          <section className="collection-state orders-state" role="alert">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>We couldn’t load your order</h2>
            <p>Please try again in a moment.</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              Try again
            </Button>
          </section>
        ) : !order ? (
          <section className="collection-state orders-state">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>Order not found</h2>
            <p>This order is unavailable or does not belong to your account.</p>
          </section>
        ) : (
          <>
            <div className="order-layout">
              <section
                className="order-products"
                aria-labelledby="order-items-title"
              >
                <div className="collection-results-heading">
                  <h2 id="order-items-title">Order items</h2>
                  <span className="collection-count">
                    {order.lines.reduce((sum, line) => sum + line.quantity, 0)}{' '}
                    items
                  </span>
                </div>
                {order.lines.length === 0 ? (
                  <p>No items in this order.</p>
                ) : (
                  <ul className="order-lines">
                    {order.lines.map((line) => (
                      <li className="order-line" key={line.id}>
                        <div className="order-line-image">
                          {line.featuredAsset ? (
                            <img
                              src={line.featuredAsset.preview}
                              alt={line.productVariant.name}
                              loading="lazy"
                            />
                          ) : (
                            <Inventory2Outlined aria-hidden="true" />
                          )}
                        </div>
                        <div className="order-line-description">
                          <h3>{line.productVariant.name}</h3>
                          <p>SKU: {line.productVariant.sku}</p>
                          <p>Quantity: {line.quantity}</p>
                        </div>
                        <div className="order-line-price">
                          <ProductPrice
                            price={line.proratedLinePriceWithTax}
                            currencyCode={order.currencyCode}
                          />
                          <span>incl. tax</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section
                className="order-summary"
                aria-labelledby="order-summary-title"
              >
                <span className="collection-eyebrow">At a glance</span>
                <h2 id="order-summary-title">Order summary</h2>
                <dl>
                  <div>
                    <dt>Subtotal incl. tax</dt>
                    <dd>
                      <ProductPrice
                        price={order.subTotalWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>Shipping incl. tax</dt>
                    <dd>
                      <ProductPrice
                        price={order.shippingWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                  <div className="order-summary-total">
                    <dt>Total incl. tax</dt>
                    <dd>
                      <ProductPrice
                        price={order.totalWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                </dl>
                <p>Item totals include applicable discounts.</p>
              </section>
            </div>
            <div className="order-addresses">
              <Address
                title="Shipping address"
                address={order.shippingAddress}
              />
              <Address title="Billing address" address={order.billingAddress} />
            </div>
            <section
              className="order-fulfillments"
              aria-labelledby="order-delivery-title"
            >
              <h2 id="order-delivery-title">Shipment details</h2>
              {order.fulfillments?.length ? (
                <ul>
                  {order.fulfillments.map((fulfillment) => (
                    <li key={fulfillment.id}>
                      <h3>{fulfillment.method}</h3>
                      <p>
                        Status:{' '}
                        {fulfillment.state.replace(/([a-z])([A-Z])/g, '$1 $2')}
                      </p>
                      <p>
                        Tracking number:{' '}
                        {fulfillment.trackingCode || 'Not available'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No shipment information available yet.</p>
              )}
            </section>
          </>
        )}
        <Link
          className="collection-text-link"
          to="/s/orders"
          search={{ page: 1 }}
        >
          <ArrowBack fontSize="small" /> Back to your orders
        </Link>
      </div>
    </main>
  );
}

type OrderAddress = NonNullable<OrderQuery['order']>['billingAddress'];

function Address({ title, address }: { title: string; address: OrderAddress }) {
  const lines = address
    ? [
        address.fullName,
        address.company,
        address.streetLine1,
        address.streetLine2,
        [address.postalCode, address.city].filter(Boolean).join(' '),
        address.country,
        address.phoneNumber,
      ].filter(Boolean)
    : [];

  return (
    <section>
      <h2>{title}</h2>
      {lines.length ? (
        <address>
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </address>
      ) : (
        <p>No address provided.</p>
      )}
    </section>
  );
}
