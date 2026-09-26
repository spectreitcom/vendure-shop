import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowBack } from '@mui/icons-material';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  getProductDetailsView,
  productDetailsViewSearchSchema,
} from '#/features/product-view';
import { ProductDetails } from '#/features/product-view/components/product-details.tsx';
import '#/features/collection-view/collection.css';
import '#/features/product-view/product.css';
import { m } from '#/paraglide/messages';

export const Route = createFileRoute('/$categorySlug/$productSlug/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  validateSearch: productDetailsViewSearchSchema,
  loaderDeps: ({ search }) => ({ productVariantId: search.productVariantId }),
  loader: async ({ params: { productSlug }, deps: { productVariantId } }) => {
    try {
      const productViewDetails = await getProductDetailsView({
        data: { slug: productSlug },
      });

      const productVariant = productViewDetails?.variants.find(
        (v) => v.id === productVariantId,
      );

      const otherVariants = productViewDetails?.variants.filter(
        (v) => v.id !== productVariantId,
      );

      if (!productVariant) {
        return {
          error: true,
          productViewDetails: null,
          productVariant: null,
          otherVariants: null,
        };
      }

      return {
        error: false,
        productViewDetails,
        productVariant,
        otherVariants,
      };
    } catch {
      return {
        error: true,
        productViewDetails: null,
        productVariant: null,
        otherVariants: null,
      };
    }
  },
});

function RouteComponent() {
  const { error, productViewDetails, productVariant, otherVariants } =
    Route.useLoaderData();
  const { categorySlug } = Route.useParams();

  return (
    <main className="collection-page product-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <Link
            to="/$categorySlug"
            params={{ categorySlug }}
            search={{ page: 1 }}
          >
            {m.product_breadcrumb_collection()}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {productViewDetails?.name ?? m.product_breadcrumb_fallback()}
          </span>
        </nav>
        {error || !productViewDetails ? (
          <div className="collection-state" role="alert">
            <span className="collection-eyebrow">
              {m.common_error_eyebrow()}
            </span>
            <h1>{m.product_error_title()}</h1>
            <p>{m.product_error_description()}</p>
            <Link
              className="collection-text-link"
              to="/$categorySlug"
              params={{ categorySlug }}
              search={{ page: 1 }}
            >
              <ArrowBack fontSize="small" /> {m.product_back_to_collection()}
            </Link>
          </div>
        ) : (
          <ProductDetails
            key={productViewDetails.id}
            categorySlug={categorySlug}
            product={productViewDetails}
            productVariant={productVariant}
            otherVariants={otherVariants ?? []}
          />
        )}
      </div>
    </main>
  );
}
