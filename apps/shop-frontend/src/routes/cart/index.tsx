import { Link, createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { CartViewContent } from '#/features/cart-view/components/cart-view-content.tsx';
import '#/features/collection-view/collection.css';
import '#/features/cart-view/cart.css';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  return (
    <main className="collection-page cart-page">
      <div className="collection-shell">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Cart</span>
        </nav>
        <header className="cart-heading">
          <span className="collection-eyebrow">Your selection</span>
          <h1>Your shopping cart</h1>
          <p>A few good finds, all in one place.</p>
        </header>
        <CartViewContent />
      </div>
    </main>
  );
}
