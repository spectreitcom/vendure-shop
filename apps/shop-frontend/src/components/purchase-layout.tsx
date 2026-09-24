import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { ProductPrice } from './product-price';
import '#/features/collection-view/collection.css';
import './purchase.css';

export function PurchaseLayout({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="collection-page purchase-page">
      <div className="collection-shell">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/cart">Cart</Link>
          <span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <ol className="purchase-steps" aria-label="Order progress">
          {['Delivery', 'Payment', 'Confirmation'].map((label, index) => (
            <li
              key={label}
              className={index + 1 <= step ? 'is-active' : ''}
              aria-current={index + 1 === step ? 'step' : undefined}
            >
              <span>{index + 1 < step ? '✓' : `0${index + 1}`}</span>
              {label}
            </li>
          ))}
        </ol>
        <header className="purchase-heading">
          <span className="collection-eyebrow">
            Your selection, almost yours
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}

export function PurchaseSummary({ children }: { children: ReactNode }) {
  const { activeCart } = useActiveCart();
  if (!activeCart) return null;
  return (
    <aside className="purchase-summary">
      <span className="collection-eyebrow">The details</span>
      <h2>Order summary</h2>
      <ul className="purchase-items">
        {activeCart.lines.map((line) => (
          <li key={line.id}>
            {line.featuredAsset && (
              <img src={line.featuredAsset.preview} alt="" />
            )}
            <div>
              <span>{line.productVariant.name}</span>
              <small>Quantity: {line.quantity}</small>
            </div>
            <ProductPrice
              price={line.proratedLinePriceWithTax}
              currencyCode={activeCart.currencyCode}
            />
          </li>
        ))}
      </ul>
      {activeCart.shippingLines.map((line) => (
        <div className="purchase-summary-row" key={line.id}>
          <span>{line.shippingMethod.name}</span>
          <ProductPrice
            price={line.priceWithTax}
            currencyCode={activeCart.currencyCode}
          />
        </div>
      ))}
      <div className="purchase-total" aria-live="polite">
        <span>Total</span>
        <ProductPrice
          price={activeCart.totalWithTax}
          currencyCode={activeCart.currencyCode}
        />
      </div>
      <p className="purchase-note">
        Including tax. Any discounts are included in the total.
      </p>
      {children}
    </aside>
  );
}
