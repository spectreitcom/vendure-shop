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
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Addresses</span>
        </nav>
        <header className="orders-heading addresses-heading">
          <div>
            <span className="collection-eyebrow">Your account</span>
            <h1>Your addresses</h1>
            <p>Your saved shipping and billing addresses, all in one place.</p>
          </div>
          <AddNewAddressBtn />
        </header>
        {error ? (
          <section className="collection-state orders-state" role="alert">
            <LocationOnOutlined sx={{ fontSize: 44 }} />
            <h2>We couldn’t load your addresses</h2>
            <p>Please try again in a moment.</p>
            <Button variant="outlined" onClick={() => router.invalidate()}>
              Try again
            </Button>
          </section>
        ) : addresses.length === 0 ? (
          <section className="collection-state orders-state">
            <LocationOnOutlined sx={{ fontSize: 44 }} />
            <h2>No saved addresses yet</h2>
            <p>Your saved shipping and billing addresses will appear here.</p>
          </section>
        ) : (
          <section aria-labelledby="addresses-list-title">
            <div className="collection-results-heading">
              <h2 id="addresses-list-title">Address book</h2>
              <span className="collection-count">
                {addresses.length}{' '}
                {addresses.length === 1 ? 'address' : 'addresses'}
              </span>
            </div>
            <ul className="addresses-list">
              {addresses.map((address, index) => (
                <li className="addresses-card" key={address.id}>
                  <div className="addresses-card-heading">
                    <span className="collection-eyebrow">
                      Address {index + 1}
                    </span>
                    <LocationOnOutlined aria-hidden="true" fontSize="small" />
                  </div>
                  <h3>
                    {address.fullName || address.company || 'Saved address'}
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
                        <span>Phone: </span>
                        {address.phoneNumber}
                      </p>
                    )}
                  </div>
                  {(address.defaultShippingAddress ||
                    address.defaultBillingAddress) && (
                    <div className="addresses-badges">
                      {address.defaultShippingAddress && (
                        <span className="orders-status orders-status-success">
                          Default shipping
                        </span>
                      )}
                      {address.defaultBillingAddress && (
                        <span className="orders-status orders-status-success">
                          Default billing
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
