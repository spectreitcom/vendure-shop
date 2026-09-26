import { Link } from '@tanstack/react-router';
import { MenuCartButton } from '#/features/cart-view';
import { AuthButtons } from '#/features/shared/authentication';
import './top-bar.css';
import { m } from '#/paraglide/messages';

export function TopBar() {
  return (
    <header className="shop-header">
      <div className="shop-header-inner">
        <Link to="/" className="shop-brand" aria-label={m.top_bar_home_label()}>
          vendure<span>SHOP</span>
        </Link>
        <nav
          className="shop-navigation"
          aria-label={m.top_bar_main_navigation()}
        >
          <Link to="/">{m.common_explore_shop()}</Link>
        </nav>
        <div className="shop-header-actions">
          <AuthButtons />
          <span className="shop-header-divider" />
          <MenuCartButton />
        </div>
      </div>
    </header>
  );
}
