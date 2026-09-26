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
import { m } from '#/paraglide/messages';

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
            <span className="collection-eyebrow">{m.home_eyebrow()}</span>
            <h1 id="home-title">
              {m.home_title_line1()}
              <br />
              {m.home_title_line2()}
            </h1>
            <p>{m.home_description()}</p>
            <a href="#collections" className="home-primary-link">
              {m.home_explore_collections()} <ArrowDownward fontSize="small" />
            </a>
          </div>
          {featured && (
            <Link
              to="/$categorySlug"
              params={{ categorySlug: featured.slug }}
              className="home-featured"
              aria-label={m.home_featured_label({ name: featured.name })}
            >
              <img
                src={featured.featuredAsset?.source}
                alt={featured.name}
                fetchPriority="high"
              />
              <div className="home-featured-caption">
                <div>
                  <span>{m.home_spotlight()}</span>
                  <h2>{featured.name}</h2>
                </div>
                <ArrowForward />
              </div>
            </Link>
          )}
        </section>
        <div className="home-introduction">
          <span className="collection-eyebrow">{m.home_intro_eyebrow()}</span>
          <p>
            {m.home_intro_line1()}
            <br />
            {m.home_intro_line2()}
          </p>
          <span>{m.home_intro_description()}</span>
        </div>
        {error ? (
          <section id="collections" className="collection-state" role="alert">
            <h2>{m.home_error_title()}</h2>
            <p>{m.common_try_again_in_moment()}</p>
            <Button className="home-retry" onClick={() => router.invalidate()}>
              {m.common_try_again()}
            </Button>
          </section>
        ) : (
          <CollectionsList items={homeCollections} />
        )}
        <footer className="home-footer">
          <span className="home-wordmark">vendure</span>
          <span>{m.home_footer_tagline()}</span>
          <a href="#home-title">{m.home_back_to_top()}</a>
        </footer>
      </div>
    </main>
  );
}
