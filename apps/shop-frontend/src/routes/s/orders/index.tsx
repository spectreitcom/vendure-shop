import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowForward, ReceiptLongOutlined } from '@mui/icons-material';
import { Button, Pagination, PaginationItem } from '@mui/material';
import { PendingComponent } from '#/components/pending-component.tsx';
import { ProductPrice } from '#/components/product-price.tsx';
import {
  getOrders,
  ordersViewSearchParamsSchema,
} from '#/features/orders-view';
import { dateFormatter, statuses } from '#/features/orders-view/presentation';
import '#/features/collection-view/collection.css';
import '#/features/orders-view/orders.css';

const TAKE = 10;
export const Route = createFileRoute('/s/orders/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  validateSearch: ordersViewSearchParamsSchema,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps: { page } }) => {
    try {
      const orders = await getOrders({ data: { take: TAKE, page } });
      if (!orders) return { error: true as const, orders: null };
      return { error: false as const, orders };
    } catch {
      return { error: true as const, orders: null };
    }
  },
});

function RouteComponent() {
  const { orders, error } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const router = useRouter();

  return (
    <main className="collection-page orders-page">
      <div className="collection-shell">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Orders</span>
        </nav>
        <header className="orders-heading">
          <span className="collection-eyebrow">Your account</span>
          <h1>Your orders</h1>
          <p>Your purchases, all in one place. Keep track of every order.</p>
        </header>
        {error ? (
          <section className="collection-state orders-state" role="alert">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>We couldn’t load your orders</h2>
            <p>Please try again in a moment.</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              Try again
            </Button>
          </section>
        ) : orders.totalItems === 0 ? (
          <section className="collection-state orders-state">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>Your story starts here</h2>
            <p>Once you place an order, you’ll find it here.</p>
            <Link className="collection-text-link" to="/">
              Explore the shop <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : orders.items.length === 0 ? (
          <section className="collection-state orders-state">
            <h2>No orders on this page</h2>
            <p>Return to the first page to see your latest purchases.</p>
            <Link
              className="collection-text-link"
              to="/s/orders"
              search={{ page: 1 }}
            >
              Back to your orders <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : (
          <section aria-labelledby="orders-list-title">
            <div className="collection-results-heading">
              <h2 id="orders-list-title">Order history</h2>
              <span className="collection-count" aria-live="polite">
                {orders.totalItems}{' '}
                {orders.totalItems === 1 ? 'order' : 'orders'}
              </span>
            </div>
            <ul className="orders-list">
              {orders.items.map((order) => {
                const status = statuses[order.state] ?? {
                  label: order.state.replace(/([a-z])([A-Z])/g, '$1 $2'),
                  tone: 'neutral',
                };
                const date = order.orderPlacedAt ?? order.createdAt;
                return (
                  <li className="orders-item" key={order.id}>
                    <div className="orders-number">
                      <span className="collection-eyebrow">Order number</span>
                      <h3>
                        <Link
                          to="/s/orders/$orderId"
                          params={{ orderId: order.id }}
                        >
                          #{order.code}
                        </Link>
                      </h3>
                      <Link
                        className="collection-text-link"
                        to="/s/orders/$orderId"
                        params={{ orderId: order.id }}
                        aria-label={`View order ${order.code}`}
                      >
                        View details <ArrowForward fontSize="small" />
                      </Link>
                    </div>
                    <dl className="orders-details">
                      <div>
                        <dt>
                          {order.orderPlacedAt ? 'Date placed' : 'Date created'}
                        </dt>
                        <dd>
                          <time dateTime={date}>
                            {dateFormatter.format(new Date(date))}
                          </time>
                        </dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>
                          <span
                            className={`orders-status orders-status-${status.tone}`}
                          >
                            {status.label}
                          </span>
                        </dd>
                      </div>
                      <div className="orders-total">
                        <dt>Total incl. tax</dt>
                        <dd>
                          <ProductPrice
                            price={order.totalWithTax}
                            currencyCode={order.currencyCode}
                          />
                        </dd>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </ul>
            <div className="collection-pagination">
              <span>
                Showing {(page - 1) * TAKE + 1}–
                {(page - 1) * TAKE + orders.items.length} of {orders.totalItems}{' '}
                orders
              </span>
              {orders.totalItems > TAKE && (
                <Pagination
                  aria-label="Order history pages"
                  count={Math.ceil(orders.totalItems / TAKE)}
                  page={page}
                  shape="rounded"
                  siblingCount={0}
                  renderItem={(item) =>
                    item.disabled || item.page === null ? (
                      <PaginationItem {...item} />
                    ) : (
                      <Link
                        to="/s/orders"
                        search={{ page: item.page }}
                        aria-label={
                          item.type === 'page'
                            ? `Page ${item.page}`
                            : `Go to ${item.type} page`
                        }
                        aria-current={item.selected ? 'page' : undefined}
                      >
                        <PaginationItem {...item} component="span" />
                      </Link>
                    )
                  }
                />
              )}
            </div>
            <Link className="collection-text-link" to="/">
              Continue shopping <ArrowForward fontSize="small" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
