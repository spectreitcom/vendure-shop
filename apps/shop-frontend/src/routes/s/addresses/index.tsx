import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import { LocationOnOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  AddNewAddressBtn,
  EditAddressBtn,
  getAddresses,
} from '#/features/addresses-view';
import '#/features/collection-view/collection.css';
import '#/features/orders-view/orders.css';
import '#/features/addresses-view/addresses.css';
import { m } from '#/paraglide/messages';

export const Route = createFileRoute('/s/addresses/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async () => {
    try {
      const addresses = await getAddresses();
      if (!addresses) return { error: true as const, addresses: null };
      return { error: false as const, addresses };
    } catch {
      return { error: true as const, addresses: null };
    }
  },
});

function RouteComponent() {
  const { error, addresses } = Route.useLoaderData();
  const router = useRouter();

  return (
    <main className="collection-page addresses-page">
      <div className="collection-shell">
        <nav
          className="collection-breadcrumbs"
          aria-label={m.common_breadcrumb_label()}
        >
          <Link to="/">{m.home_link_label()}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{m.addresses_label()}</span>
        </nav>
        <header className="orders-heading addresses-heading">
          <div>
            <span className="collection-eyebrow">
              {m.common_your_account()}
            </span>
            <h1>{m.addresses_title()}</h1>
            <p>{m.addresses_description()}</p>
          </div>
          <AddNewAddressBtn />
        </header>
        {error ? (
          <section className="collection-state orders-state" role="alert">
            <LocationOnOutlined sx={{ fontSize: 44 }} />
            <h2>{m.addresses_error_title()}</h2>
            <p>{m.common_try_again_in_moment()}</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              {m.common_try_again()}
            </Button>
          </section>
        ) : addresses.length === 0 ? (
          <section className="collection-state orders-state">
            <LocationOnOutlined sx={{ fontSize: 44 }} />
            <h2>{m.addresses_empty_title()}</h2>
            <p>{m.addresses_empty_description()}</p>
          </section>
        ) : (
          <section aria-labelledby="addresses-list-title">
            <div className="collection-results-heading">
              <h2 id="addresses-list-title">{m.addresses_book_title()}</h2>
              <span className="collection-count">
                {m.addresses_count({ count: addresses.length })}
              </span>
            </div>
            <ul className="addresses-list">
              {addresses.map((address, index) => (
                <li className="addresses-card" key={address.id}>
                  <div className="addresses-card-heading">
                    <span className="collection-eyebrow">
                      {m.addresses_card_eyebrow({ number: index + 1 })}
                    </span>
                    <LocationOnOutlined aria-hidden="true" fontSize="small" />
                  </div>
                  <h3>
                    {address.fullName ||
                      address.company ||
                      m.addresses_saved_fallback()}
                  </h3>
                  <div className="addresses-details">
                    {address.company && address.fullName && (
                      <p>{address.company}</p>
                    )}
                    <p>{address.streetLine1}</p>
                    {address.streetLine2 && <p>{address.streetLine2}</p>}
                    <p>
                      {[address.postalCode, address.city]
                        .filter(Boolean)
                        .join(' ')}
                    </p>
                    <p>{address.country.name}</p>
                    {address.phoneNumber && (
                      <p className="addresses-phone">
                        <span>{m.addresses_phone()} </span>
                        {address.phoneNumber}
                      </p>
                    )}
                  </div>
                  {(address.defaultShippingAddress ||
                    address.defaultBillingAddress) && (
                    <div className="addresses-badges">
                      {address.defaultShippingAddress && (
                        <span className="orders-status orders-status-success">
                          {m.addresses_default_shipping()}
                        </span>
                      )}
                      {address.defaultBillingAddress && (
                        <span className="orders-status orders-status-success">
                          {m.addresses_default_billing()}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="addresses-card-actions">
                    <EditAddressBtn address={address} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
