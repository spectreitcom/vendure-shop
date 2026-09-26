import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { ProductPrice } from './product-price';
import '#/features/collection-view/collection.css';
import './purchase.css';
import { m } from '#/paraglide/messages';

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
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span>/</span>
          <Link to="/cart">{m.cart_label()}</Link>
          <span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <ol
          className="purchase-steps"
          aria-label={m.purchase_layout_order_progress()}
        >
          {[
            m.purchase_layout_step_delivery(),
            m.purchase_layout_step_payment(),
            m.purchase_layout_step_confirmation(),
          ].map((label, index) => (
            <li
              key={index}
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
            {m.purchase_layout_eyebrow()}
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
      <span className="collection-eyebrow">{m.purchase_summary_eyebrow()}</span>
      <h2>{m.purchase_summary_title()}</h2>
      <ul className="purchase-items">
        {activeCart.lines.map((line) => (
          <li key={line.id}>
            {line.featuredAsset && (
              <img src={line.featuredAsset.preview} alt="" />
            )}
            <div>
              <span>{line.productVariant.name}</span>
              <small>
                {m.purchase_summary_quantity({ quantity: line.quantity })}
              </small>
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
        <span>{m.purchase_summary_total()}</span>
        <ProductPrice
          price={activeCart.totalWithTax}
          currencyCode={activeCart.currencyCode}
        />
      </div>
      <p className="purchase-note">{m.purchase_summary_note()}</p>
      {children}
    </aside>
  );
}
