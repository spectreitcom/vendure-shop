import { CollectionsListItem } from './collections-list-item.tsx';
import { cn } from '#/utils';
import type { HomeCollectionItem } from '#/features/home-collections/types';
import { m } from '#/paraglide/messages';

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
          <span className="collection-eyebrow">
            {m.collections_list_eyebrow()}
          </span>
          <h2 id="home-collections-title">{m.collections_list_title()}</h2>
        </div>
        <span className="collection-count">
          {m.collections_list_count({ count: items.length })}
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
          <h3>{m.collections_list_empty_title()}</h3>
          <p>{m.collections_list_empty_description()}</p>
        </div>
      )}
    </section>
  );
}
