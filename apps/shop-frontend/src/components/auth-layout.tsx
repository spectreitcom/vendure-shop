import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowBack, ShoppingBagOutlined } from '@mui/icons-material';
import '#/features/collection-view/collection.css';
import './auth.css';

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
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span aria-current="page">
            {breadcrumb ?? (registration ? 'Create an account' : 'Sign in')}
          </span>
        </nav>
        <div className="auth-layout">
          <section className="auth-intro">
            <span className="collection-eyebrow">A little more personal</span>
            <h2>
              {introTitle ??
                (registration
                  ? 'Make yourself\nat home.'
                  : 'Good to have\nyou back.')}
            </h2>
            <p>
              {introDescription ??
                (registration
                  ? 'Create your account and take the next step towards something you’ll love.'
                  : 'Your next favourite find is waiting. Sign in to continue your shopping journey.')}
            </p>
            <div className="auth-intro-detail">
              <ShoppingBagOutlined fontSize="small" />
              <span>Thoughtful finds. A shop to return to.</span>
            </div>
            <Link to="/" className="collection-text-link">
              <ArrowBack fontSize="small" /> Explore the shop
            </Link>
          </section>
          <section className="auth-surface auth-card">{children}</section>
        </div>
      </div>
    </main>
  );
}
