import { CollectionsListItem } from './collections-list-item.tsx';
import { cn } from '#/utils';
import type { HomeCollectionItem } from '#/features/home-collections/types';

type Props = Readonly<{
  items: ReadonlyArray<HomeCollectionItem>;
  className?: string;
}>;

export function CollectionsList({ items, className }: Props) {
  return (
    <section
      id="collections"
      className={cn('home-collections', className)}
      aria-labelledby="home-collections-title"
    >
      <div className="home-section-heading">
        <div>
          <span className="collection-eyebrow">Find your inspiration</span>
          <h2 id="home-collections-title">Explore our collections</h2>
        </div>
        <span className="collection-count">
          {items.length} {items.length === 1 ? 'collection' : 'collections'}
        </span>
      </div>
      {items.length ? (
        <div className="home-collections-grid">
          {items.map((item) => (
            <CollectionsListItem
              key={item.id}
              slug={item.slug}
              title={item.name}
              imageUrl={item.featuredAsset?.source}
              imageAlt={item.name}
            />
          ))}
        </div>
      ) : (
        <div className="collection-state">
          <h3>Something new is on its way</h3>
          <p>
            Our collections will appear here when they’re available. Come back
            soon.
          </p>
        </div>
      )}
    </section>
  );
}
