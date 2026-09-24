import { Link } from '@tanstack/react-router';
import { MenuCartButton } from '#/features/cart-view';
import { AuthButtons } from '#/features/shared/authentication';
import './top-bar.css';

export function TopBar() {
  return (
    <header className="shop-header">
      <div className="shop-header-inner">
        <Link to="/" className="shop-brand" aria-label="Vendure Shop home">
          vendure<span>SHOP</span>
        </Link>
        <nav className="shop-navigation" aria-label="Main navigation">
          <Link to="/">Explore the shop</Link>
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
