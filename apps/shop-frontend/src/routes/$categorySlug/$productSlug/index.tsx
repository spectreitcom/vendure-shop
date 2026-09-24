import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowBack } from '@mui/icons-material';
import { PendingComponent } from '#/components/pending-component.tsx';
import { getProductDetailsView } from '#/features/product-view';
import { ProductDetails } from '#/features/product-view/components/product-details.tsx';
import '#/features/collection-view/collection.css';
import '#/features/product-view/product.css';

export const Route = createFileRoute('/$categorySlug/$productSlug/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ params: { productSlug } }) => {
    try {
      const productViewDetails = await getProductDetailsView({
        data: { slug: productSlug },
      });

      return {
        error: false,
        productViewDetails,
      };
    } catch {
      return {
        error: true,
        productViewDetails: null,
      };
    }
  },
});

function RouteComponent() {
  const { error, productViewDetails } = Route.useLoaderData();
  const { categorySlug } = Route.useParams();

  return (
    <main className="collection-page product-page">
      <div className="collection-shell">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link
            to="/$categorySlug"
            params={{ categorySlug }}
            search={{ page: 1 }}
          >
            Collection
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {productViewDetails?.name ?? 'Product'}
          </span>
        </nav>
        {error || !productViewDetails ? (
          <div className="collection-state" role="alert">
            <span className="collection-eyebrow">A little interruption</span>
            <h1>We couldn’t load this product.</h1>
            <p>
              Please try again in a moment, or explore the rest of the
              collection.
            </p>
            <Link
              className="collection-text-link"
              to="/$categorySlug"
              params={{ categorySlug }}
              search={{ page: 1 }}
            >
              <ArrowBack fontSize="small" /> Back to collection
            </Link>
          </div>
        ) : (
          <ProductDetails
            key={productViewDetails.id}
            product={productViewDetails}
          />
        )}
      </div>
    </main>
  );
}
