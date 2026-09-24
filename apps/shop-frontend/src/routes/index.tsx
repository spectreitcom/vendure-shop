import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { ArrowForward, ArrowDownward } from '@mui/icons-material';
import { Button } from '@mui/material';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  CollectionsList,
  getHomeCollections,
} from '#/features/home-collections';
import '#/features/collection-view/collection.css';
import '#/features/home-collections/home.css';

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: PendingComponent,
  loader: async () => {
    try {
      return { homeCollections: await getHomeCollections(), error: false };
    } catch {
      return { homeCollections: [], error: true };
    }
  },
});

function Home() {
  const { homeCollections, error } = Route.useLoaderData();
  const router = useRouter();
  const featured = homeCollections.find(
    (collection) => collection.featuredAsset?.source,
  );

  return (
    <main className="collection-page home-page">
      <div className="collection-shell">
        <section
          className={`home-hero${featured ? '' : ' home-hero-text'}`}
          aria-labelledby="home-title"
        >
          <div className="home-hero-copy">
            <span className="collection-eyebrow">Welcome to Vendure Shop</span>
            <h1 id="home-title">
              Find something
              <br />
              to make yours.
            </h1>
            <p>
              A little inspiration. A new favourite. Explore our collections and
              discover what speaks to you.
            </p>
            <a href="#collections" className="home-primary-link">
              Explore the collections <ArrowDownward fontSize="small" />
            </a>
          </div>
          {featured && (
            <Link
              to="/$categorySlug"
              params={{ categorySlug: featured.slug }}
              className="home-featured"
              aria-label={`Explore ${featured.name}`}
            >
              <img
                src={featured.featuredAsset?.source}
                alt={featured.name}
                fetchPriority="high"
              />
              <div className="home-featured-caption">
                <div>
                  <span>In the spotlight</span>
                  <h2>{featured.name}</h2>
                </div>
                <ArrowForward />
              </div>
            </Link>
          )}
        </section>
        <div className="home-introduction">
          <span className="collection-eyebrow">Take a closer look</span>
          <p>
            Different collections.
            <br />
            Your own way to explore.
          </p>
          <span>
            Start with a collection that catches your eye, then find the details
            that make it yours.
          </span>
        </div>
        {error ? (
          <section id="collections" className="collection-state" role="alert">
            <h2>Our collections couldn’t load</h2>
            <p>Please try again in a moment.</p>
            <Button className="home-retry" onClick={() => router.invalidate()}>
              Try again
            </Button>
          </section>
        ) : (
          <CollectionsList items={homeCollections} />
        )}
        <footer className="home-footer">
          <span className="home-wordmark">vendure</span>
          <span>A little inspiration for your everyday.</span>
          <a href="#home-title">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
