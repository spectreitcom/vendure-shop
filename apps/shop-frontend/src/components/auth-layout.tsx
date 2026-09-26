import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowBack, ShoppingBagOutlined } from '@mui/icons-material';
import '#/features/collection-view/collection.css';
import './auth.css';
import { m } from '#/paraglide/messages';

export function AuthLayout({
  registration = false,
  children,
  breadcrumb,
  introTitle,
  introDescription,
}: {
  registration?: boolean;
  children: ReactNode;
  breadcrumb?: string;
  introTitle?: string;
  introDescription?: string;
}) {
  return (
    <main className="collection-page auth-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span>/</span>
          <span aria-current="page">
            {breadcrumb ??
              (registration ? m.common_create_account() : m.common_sign_in())}
          </span>
        </nav>
        <div className="auth-layout">
          <section className="auth-intro">
            <span className="collection-eyebrow">
              {m.auth_layout_eyebrow()}
            </span>
            <h2>
              {introTitle ??
                (registration
                  ? m.auth_layout_registration_title()
                  : m.auth_layout_login_title())}
            </h2>
            <p>
              {introDescription ??
                (registration
                  ? m.auth_layout_registration_description()
                  : m.auth_layout_login_description())}
            </p>
            <div className="auth-intro-detail">
              <ShoppingBagOutlined fontSize="small" />
              <span>{m.auth_layout_detail()}</span>
            </div>
            <Link to="/" className="collection-text-link">
              <ArrowBack fontSize="small" /> {m.common_explore_shop()}
            </Link>
          </section>
          <section className="auth-surface auth-card">{children}</section>
        </div>
      </div>
    </main>
  );
}
