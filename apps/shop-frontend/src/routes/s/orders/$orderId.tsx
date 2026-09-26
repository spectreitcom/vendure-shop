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
import { m } from '#/paraglide/messages';

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
        message: m.order_details_fetch_error(),
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
        label: () => order.state.replace(/([a-z])([A-Z])/g, '$1 $2'),
        tone: 'neutral',
      })
    : null;
  const date = order?.orderPlacedAt ?? order?.createdAt;

  return (
    <main className="collection-page orders-page order-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/s/orders" search={{ page: 1 }}>
            {m.orders_label()}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {order ? `#${order.code}` : m.order_details_fallback_title()}
          </span>
        </nav>
        <header className="orders-heading">
          <span className="collection-eyebrow">{m.common_your_account()}</span>
          <h1>
            {order
              ? m.order_details_title({ code: order.code })
              : m.order_details_fallback_title()}
          </h1>
          {order && status && date && (
            <div className="order-heading-meta">
              <p>
                {order.orderPlacedAt
                  ? m.order_details_placed_on()
                  : m.order_details_created_on()}{' '}
                <time dateTime={date}>
                  {dateFormatter.format(new Date(date))}
                </time>
              </p>
              <span className={`orders-status orders-status-${status.tone}`}>
                {status.label()}
              </span>
            </div>
          )}
        </header>
        {data.error ? (
          <section className="collection-state orders-state" role="alert">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>{m.order_details_error_title()}</h2>
            <p>{m.common_try_again_in_moment()}</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              {m.common_try_again()}
            </Button>
          </section>
        ) : !order ? (
          <section className="collection-state orders-state">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>{m.order_details_not_found_title()}</h2>
            <p>{m.order_details_not_found_description()}</p>
          </section>
        ) : (
          <>
            <div className="order-layout">
              <section
                className="order-products"
                aria-labelledby="order-items-title"
              >
                <div className="collection-results-heading">
                  <h2 id="order-items-title">
                    {m.order_details_items_title()}
                  </h2>
                  <span className="collection-count">
                    {m.order_details_items_count({
                      count: order.lines.reduce(
                        (sum, line) => sum + line.quantity,
                        0,
                      ),
                    })}
                  </span>
                </div>
                {order.lines.length === 0 ? (
                  <p>{m.order_details_no_items()}</p>
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
                          <p>
                            {m.order_details_sku({
                              sku: line.productVariant.sku,
                            })}
                          </p>
                          <p>
                            {m.order_details_quantity({
                              quantity: line.quantity,
                            })}
                          </p>
                        </div>
                        <div className="order-line-price">
                          <ProductPrice
                            price={line.proratedLinePriceWithTax}
                            currencyCode={order.currencyCode}
                          />
                          <span>{m.order_details_incl_tax()}</span>
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
                <span className="collection-eyebrow">
                  {m.order_details_summary_eyebrow()}
                </span>
                <h2 id="order-summary-title">
                  {m.order_details_summary_title()}
                </h2>
                <dl>
                  <div>
                    <dt>{m.order_details_subtotal()}</dt>
                    <dd>
                      <ProductPrice
                        price={order.subTotalWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>{m.order_details_shipping()}</dt>
                    <dd>
                      <ProductPrice
                        price={order.shippingWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                  <div className="order-summary-total">
                    <dt>{m.order_details_total()}</dt>
                    <dd>
                      <ProductPrice
                        price={order.totalWithTax}
                        currencyCode={order.currencyCode}
                      />
                    </dd>
                  </div>
                </dl>
                <p>{m.order_details_discounts_note()}</p>
              </section>
            </div>
            <div className="order-addresses">
              <Address
                title={m.order_details_shipping_address()}
                address={order.shippingAddress}
              />
              <Address
                title={m.order_details_billing_address()}
                address={order.billingAddress}
              />
            </div>
            <section
              className="order-fulfillments"
              aria-labelledby="order-delivery-title"
            >
              <h2 id="order-delivery-title">
                {m.order_details_shipment_title()}
              </h2>
              {order.fulfillments?.length ? (
                <ul>
                  {order.fulfillments.map((fulfillment) => (
                    <li key={fulfillment.id}>
                      <h3>{fulfillment.method}</h3>
                      <p>
                        {m.order_details_shipment_status({
                          status: fulfillment.state.replace(
                            /([a-z])([A-Z])/g,
                            '$1 $2',
                          ),
                        })}
                      </p>
                      <p>
                        {m.order_details_tracking_number({
                          trackingCode:
                            fulfillment.trackingCode ||
                            m.order_details_not_available(),
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{m.order_details_no_shipment()}</p>
              )}
            </section>
          </>
        )}
        <Link
          className="collection-text-link"
          to="/s/orders"
          search={{ page: 1 }}
        >
          <ArrowBack fontSize="small" /> {m.orders_back()}
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
        <p>{m.order_details_no_address()}</p>
      )}
    </section>
  );
}
