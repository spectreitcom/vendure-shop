import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import {
  ArrowForward,
  FavoriteBorder,
  ImageNotSupportedOutlined,
} from '@mui/icons-material';
import { Button, Pagination, PaginationItem } from '@mui/material';
import { z } from 'zod';
import { PendingComponent } from '#/components/pending-component.tsx';
import { getActiveCustomerFavoriteProducts } from '#/features/favorite-products';
import { AddToCartButton } from '#/features/shared/cart/components/add-to-cart-button.tsx';
import { m } from '#/paraglide/messages';
import '#/features/collection-view/collection.css';
import '#/features/orders-view/orders.css';

const TAKE = 12;

export const Route = createFileRoute('/s/favorite-products/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  validateSearch: z.object({ page: z.int().positive().catch(1).default(1) }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps: { page } }) => {
    try {
      const favorites = await getActiveCustomerFavoriteProducts({
        data: { take: TAKE, page },
      });
      if (!favorites) return { error: true as const, favorites: null };
      return { error: false as const, favorites };
    } catch {
      return { error: true as const, favorites: null };
    }
  },
});

function RouteComponent() {
  const { favorites, error } = Route.useLoaderData();
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
          <span aria-current="page">{m.auth_buttons_favorite_products()}</span>
        </nav>
        <header className="orders-heading">
          <span className="collection-eyebrow">{m.common_your_account()}</span>
          <h1>{m.favorites_title()}</h1>
          <p>{m.favorites_description()}</p>
        </header>
        {error ? (
          <section className="collection-state orders-state" role="alert">
            <FavoriteBorder sx={{ fontSize: 44 }} />
            <h2>{m.favorites_error_title()}</h2>
            <p>{m.common_try_again_in_moment()}</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              {m.common_try_again()}
            </Button>
          </section>
        ) : favorites.totalItems === 0 ? (
          <section className="collection-state orders-state">
            <FavoriteBorder sx={{ fontSize: 44 }} />
            <h2>{m.favorites_empty_title()}</h2>
            <p>{m.favorites_empty_description()}</p>
            <Link className="collection-text-link" to="/">
              {m.common_explore_shop()} <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : favorites.items.length === 0 ? (
          <section className="collection-state orders-state">
            <h2>{m.favorites_page_empty_title()}</h2>
            <p>{m.favorites_page_empty_description()}</p>
            <Link
              className="collection-text-link"
              to="/s/favorite-products"
              search={{ page: 1 }}
            >
              {m.favorites_back()} <ArrowForward fontSize="small" />
            </Link>
          </section>
        ) : (
          <section aria-labelledby="favorites-list-title">
            <div className="collection-results-heading">
              <h2 id="favorites-list-title">{m.favorites_list_title()}</h2>
              <span className="collection-count" aria-live="polite">
                {m.favorites_count({ count: favorites.totalItems })}
              </span>
            </div>
            <ul
              className="collection-product-grid"
              style={{ listStyle: 'none', margin: 0, padding: 0 }}
            >
              {favorites.items.map(
                ({ id, productVariantId, productVariant }) => {
                  const preview =
                    productVariant.featuredAsset?.preview ??
                    productVariant.product.featuredAsset?.preview;
                  return (
                    <li key={id}>
                      <article className="collection-product">
                        <div className="collection-product-image">
                          {preview ? (
                            <img
                              src={preview}
                              alt={productVariant.name}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span className="collection-image-placeholder">
                              <ImageNotSupportedOutlined />
                              <span>{m.common_image_coming_soon()}</span>
                            </span>
                          )}
                        </div>
                        <div className="collection-product-info">
                          <div>
                            <h3>{productVariant.name}</h3>
                            <p className="collection-product-price">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: productVariant.currencyCode,
                              }).format(productVariant.priceWithTax / 100)}
                            </p>
                          </div>
                          <AddToCartButton
                            className="collection-cart-button"
                            variant="small"
                            productVariantId={productVariantId}
                            quantity={1}
                          />
                        </div>
                      </article>
                    </li>
                  );
                },
              )}
            </ul>
            <div className="collection-pagination">
              <span>
                {m.favorites_showing({
                  from: (page - 1) * TAKE + 1,
                  to: (page - 1) * TAKE + favorites.items.length,
                  total: favorites.totalItems,
                })}
              </span>
              {favorites.totalItems > TAKE && (
                <Pagination
                  aria-label={m.favorites_pagination_label()}
                  count={Math.ceil(favorites.totalItems / TAKE)}
                  page={page}
                  shape="rounded"
                  siblingCount={0}
                  renderItem={(item) =>
                    item.disabled || item.page === null ? (
                      <PaginationItem {...item} />
                    ) : (
                      <Link
                        to="/s/favorite-products"
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
