import { useActiveCart } from '#/features/shared/cart';
import {
  ArrowBack,
  ArrowForward,
  ShoppingBagOutlined,
} from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { ProductLine } from './product-line';
import { ProductPrice } from '#/components/product-price.tsx';
import { CouponCodeForm } from '#/features/cart-view/components/coupon-code-form.tsx';
import { CouponCodesList } from '#/features/cart-view/components/coupon-codes-list.tsx';
import { useActiveUser } from '#/features/shared/authentication';
import { Link, useRouter } from '@tanstack/react-router';
import { m } from '#/paraglide/messages';

export function CartViewContent() {
  const { activeCart, fetching } = useActiveCart();
  const { activeUser, showLoginModal, isFetching } = useActiveUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (isFetching) return;
    if (!activeUser) showLoginModal();
    else await router.navigate({ to: '/cart/checkout' });
  };

  if (fetching) {
    return (
      <div className="collection-state cart-state" role="status">
        <CircularProgress
          size={32}
          color="inherit"
          aria-label={m.cart_loading_label()}
        />
        <p>{m.cart_loading_message()}</p>
      </div>
    );
  }

  if (!activeCart?.lines.length) {
    return (
      <section className="collection-state cart-state">
        <ShoppingBagOutlined sx={{ fontSize: 44 }} />
        <h2>{m.cart_empty_title()}</h2>
        <p>{m.cart_empty_description()}</p>
        <Link className="collection-text-link" to="/">
          {m.cart_empty_explore_link()} <ArrowForward fontSize="small" />
        </Link>
      </section>
    );
  }

  return (
    <div className="cart-layout">
      <section className="cart-items" aria-labelledby="cart-items-title">
        <div className="collection-results-heading">
          <h2 id="cart-items-title">{m.cart_items_title()}</h2>
          <span className="collection-count" aria-live="polite">
            {m.cart_items_count({ count: activeCart.totalQuantity })}
          </span>
        </div>
        <ul className="cart-lines">
          {activeCart.lines.map((line) => (
            <ProductLine
              key={line.id}
              line={line}
              currencyCode={activeCart.currencyCode}
            />
          ))}
        </ul>
        <Link to="/" className="collection-text-link">
          <ArrowBack fontSize="small" /> {m.cart_continue_shopping()}
        </Link>
      </section>
      <aside className="cart-summary" aria-labelledby="cart-summary-title">
        <span className="collection-eyebrow">{m.cart_summary_eyebrow()}</span>
        <h2 id="cart-summary-title">{m.cart_summary_title()}</h2>
        {activeCart.discounts.length > 0 && (
          <div className="cart-discounts">
            <span className="collection-eyebrow">
              {m.cart_applied_savings()}
            </span>
            {activeCart.discounts.map((discount, index) => (
              <div
                className="cart-summary-row"
                key={`${discount.description}-${index}`}
              >
                <span>{discount.description}</span>
                <ProductPrice
                  price={discount.amountWithTax}
                  currencyCode={activeCart.currencyCode}
                />
              </div>
            ))}
            <p className="cart-note">{m.cart_discounts_note()}</p>
          </div>
        )}
        <div
          className="cart-summary-total"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{m.cart_total()}</span>
          <ProductPrice
            price={activeCart.totalWithTax}
            currencyCode={activeCart.currencyCode}
          />
        </div>
        <p className="cart-note">{m.cart_total_note()}</p>
        <div className="cart-coupon-section">
          <CouponCodeForm />
          <CouponCodesList />
        </div>
        <Button
          className="cart-checkout-button"
          variant="contained"
          disableElevation
          fullWidth
          disabled={isFetching}
          onClick={handleCheckout}
          endIcon={<ArrowForward fontSize="small" />}
        >
          {m.cart_checkout_button()}
        </Button>
        {!isFetching && !activeUser && (
          <p className="cart-checkout-note">{m.cart_checkout_sign_in_note()}</p>
        )}
      </aside>
    </div>
  );
}
