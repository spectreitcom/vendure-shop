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
import { m } from '#/paraglide/messages';

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
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{m.orders_label()}</span>
        </nav>
        <header className="orders-heading">
          <span className="collection-eyebrow">{m.common_your_account()}</span>
          <h1>{m.orders_title()}</h1>
          <p>{m.orders_description()}</p>
        </header>
        {error ? (
          <section className="collection-state orders-state" role="alert">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>{m.orders_error_title()}</h2>
            <p>{m.common_try_again_in_moment()}</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              {m.common_try_again()}
            </Button>
          </section>
        ) : orders.totalItems === 0 ? (
          <section className="collection-state orders-state">
            <ReceiptLongOutlined sx={{ fontSize: 44 }} />
            <h2>{m.orders_empty_title()}</h2>
            <p>{m.orders_empty_description()}</p>
            <Link className="collection-text-link" to="/">
              {m.common_explore_shop()} <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : orders.items.length === 0 ? (
          <section className="collection-state orders-state">
            <h2>{m.orders_page_empty_title()}</h2>
            <p>{m.orders_page_empty_description()}</p>
            <Link
              className="collection-text-link"
              to="/s/orders"
              search={{ page: 1 }}
            >
              {m.orders_back()} <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : (
          <section aria-labelledby="orders-list-title">
            <div className="collection-results-heading">
              <h2 id="orders-list-title">{m.orders_history_title()}</h2>
              <span className="collection-count" aria-live="polite">
                {m.orders_count({ count: orders.totalItems })}
              </span>
            </div>
            <ul className="orders-list">
              {orders.items.map((order) => {
                const status = statuses[order.state] ?? {
                  label: () => order.state.replace(/([a-z])([A-Z])/g, '$1 $2'),
                  tone: 'neutral',
                };
                const date = order.orderPlacedAt ?? order.createdAt;
                return (
                  <li className="orders-item" key={order.id}>
                    <div className="orders-number">
                      <span className="collection-eyebrow">
                        {m.orders_number()}
                      </span>
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
                        aria-label={m.orders_view_label({ code: order.code })}
                      >
                        {m.orders_view_details()}{' '}
                        <ArrowForward fontSize="small" />
                      </Link>
                    </div>
                    <dl className="orders-details">
                      <div>
                        <dt>
                          {order.orderPlacedAt
                            ? m.orders_date_placed()
                            : m.orders_date_created()}
                        </dt>
                        <dd>
                          <time dateTime={date}>
                            {dateFormatter.format(new Date(date))}
                          </time>
                        </dd>
                      </div>
                      <div>
                        <dt>{m.orders_status()}</dt>
                        <dd>
                          <span
                            className={`orders-status orders-status-${status.tone}`}
                          >
                            {status.label()}
                          </span>
                        </dd>
                      </div>
                      <div className="orders-total">
                        <dt>{m.orders_total()}</dt>
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
                {m.orders_showing({
                  from: (page - 1) * TAKE + 1,
                  to: (page - 1) * TAKE + orders.items.length,
                  total: orders.totalItems,
                })}
              </span>
              {orders.totalItems > TAKE && (
                <Pagination
                  aria-label={m.orders_pagination_label()}
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
                            ? m.common_pagination_page({ page: item.page })
                            : m.common_pagination_go_to({ type: item.type })
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
              {m.common_continue_shopping()} <ArrowForward fontSize="small" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
