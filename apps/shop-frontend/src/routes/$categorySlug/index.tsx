import { Link, createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { ArrowForward, SearchOff } from '@mui/icons-material';
import '#/features/collection-view/collection.css';
import {
  CollectionProductsGrid,
  Filters,
  getCollection,
  getCollectionProducts,
  getFacets,
} from '#/features/collection-view';
import type { CollectionViewLoaderDeps } from '#/features/collection-view';
import { CollectionProductsPagination } from '../../features/collection-view/components/collection-products-pagination.tsx';
import type {
  CollectionProductsQuery,
  FacetsQuery,
  GetCollectionQuery,
} from '#/graphql/generated.ts';
import { validateSearchSchema } from '#/features/collection-view/schemas';
import { m } from '#/paraglide/messages';

const TAKE = 9;

type LoaderSuccess = {
  error: false;
  collection: GetCollectionQuery['collection'];
  facets: FacetsQuery['facets']['items'];
  products?: CollectionProductsQuery['search'];
};

type LoaderError = {
  error: true;
};

type LoaderData = LoaderSuccess | LoaderError;

export const Route = createFileRoute('/$categorySlug/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  validateSearch: validateSearchSchema,
  loaderDeps: ({ search }) => {
    return {
      page: search.page,
      facetValues: search.facetValues?.split(',').filter(Boolean) ?? [],
    } satisfies CollectionViewLoaderDeps;
  },
  loader: async ({ deps: { page, facetValues }, params: { categorySlug } }) => {
    try {
      const collection = await getCollection({
        data: { slug: categorySlug },
      });

      const products = await getCollectionProducts({
        data: {
          collectionSlug: categorySlug,
          take: TAKE,
          page,
          facetValueFilters: facetValues.map((fValue) => ({
            and: fValue,
            or: [],
          })),
        },
      });

      const facets = await getFacets();

      return {
        error: false,
        collection,
        facets,
        products,
      } satisfies LoaderData;
    } catch {
      return {
        error: true,
      } satisfies LoaderData;
    }
  },
});

function RouteComponent() {
  const { error, collection, facets, products } = Route.useLoaderData();
  const { page, facetValues } = Route.useLoaderDeps();

  if (error || !collection) {
    return (
      <main className="collection-page">
        <div className="collection-state collection-shell" role="alert">
          <span className="collection-eyebrow">{m.common_error_eyebrow()}</span>
          <h1>{m.collection_error_title()}</h1>
          <p>{m.collection_error_description()}</p>
          <Link to="/" className="collection-text-link">
            {m.collection_back_to_shop()} <ArrowForward fontSize="small" />
          </Link>
        </div>
      </main>
    );
  }

  const totalItems = products?.totalItems ?? 0;
  const activeFilters = facets.flatMap((facet) =>
    facet.values.filter((value) => facetValues.includes(value.id)),
  );

  return (
    <main className="collection-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{collection.name}</span>
        </nav>
        <header
          className={`collection-hero${collection.featuredAsset ? '' : ' collection-hero-text'}`}
        >
          <div className="collection-hero-copy">
            <span className="collection-eyebrow">
              {m.collection_hero_eyebrow()}
            </span>
            <h1>{collection.name}</h1>
            {collection.description && (
              <p className="collection-description">
                {collection.description
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()}
              </p>
            )}
            <a className="collection-text-link" href="#">
              {m.collection_discover_link()} <ArrowForward fontSize="small" />
            </a>
          </div>
          {collection.featuredAsset && (
            <div className="collection-hero-image">
              <img
                src={collection.featuredAsset.preview}
                alt={collection.name}
                fetchPriority="high"
              />
            </div>
          )}
        </header>

        <div className="collection-layout" id="collection-products">
          <aside aria-label={m.collection_filters_label()}>
            <Filters
              facets={facets}
              collectionSlug={collection.slug}
              searchParamsToCopy={{ facetValues }}
            />
          </aside>
          <section
            aria-label={m.collection_products_label()}
            className="collection-results"
          >
            <div className="collection-results-heading">
              <div>
                <span className="collection-eyebrow">
                  {m.collection_selection_eyebrow()}
                </span>
                <h2>{m.collection_results_title({ name: collection.name })}</h2>
              </div>
              <span className="collection-count">
                {m.collection_products_count({ count: totalItems })}
              </span>
            </div>
            {activeFilters.length > 0 && (
              <div
                className="collection-active-filters"
                aria-label={m.collection_active_filters_label()}
              >
                {activeFilters.map((value) => (
                  <Link
                    key={value.id}
                    to="/$categorySlug"
                    params={{ categorySlug: collection.slug }}
                    search={{
                      page: 1,
                      facetValues: facetValues
                        .filter((id) => id !== value.id)
                        .join(','),
                    }}
                    aria-label={m.collection_remove_filter_label({
                      name: value.name,
                    })}
                  >
                    {value.name}
                    <span aria-hidden="true">×</span>
                  </Link>
                ))}
              </div>
            )}
            {products?.items.length ? (
              <>
                <CollectionProductsGrid
                  items={products.items}
                  categorySlug={collection.slug}
                />
                <div className="collection-pagination">
                  <span>
                    {m.collection_showing({
                      from: (page - 1) * TAKE + 1,
                      to: Math.min(page * TAKE, totalItems),
                      total: totalItems,
                    })}
                  </span>
                  <CollectionProductsPagination
                    totalItems={calcTotalPageNumbers(totalItems, TAKE)}
                    categorySlug={collection.slug}
                    page={page}
                    searchParamsToCopy={{ facetValues: facetValues.join(',') }}
                  />
                </div>
              </>
            ) : (
              <div className="collection-state">
                <SearchOff sx={{ fontSize: 40 }} />
                <h2>{m.collection_empty_title()}</h2>
                <p>
                  {facetValues.length
                    ? m.collection_empty_filtered_description()
                    : m.collection_empty_description()}
                </p>
                {facetValues.length ? (
                  <Link
                    className="collection-text-link"
                    to="/$categorySlug"
                    params={{ categorySlug: collection.slug }}
                    search={{ page: 1 }}
                  >
                    {m.collection_clear_all_filters()}{' '}
                    <ArrowForward fontSize="small" />
                  </Link>
                ) : (
                  <Link className="collection-text-link" to="/">
                    {m.common_explore_shop()} <ArrowForward fontSize="small" />
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function calcTotalPageNumbers(totalItems: number, take: number) {
  if (take <= 0) throw new Error('Take must be greater than 0');
  return Math.ceil(totalItems / take);
}
