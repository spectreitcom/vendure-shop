import { Link, createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { CartViewContent } from '#/features/cart-view/components/cart-view-content.tsx';
import '#/features/collection-view/collection.css';
import '#/features/cart-view/cart.css';
import { m } from '#/paraglide/messages';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  return (
    <main className="collection-page cart-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{m.cart_label()}</span>
        </nav>
        <header className="cart-heading">
          <span className="collection-eyebrow">{m.cart_eyebrow()}</span>
          <h1>{m.cart_header()}</h1>
          <p>{m.cart_subheader()}</p>
        </header>
        <CartViewContent />
      </div>
    </main>
  );
}
