import { ArrowForward, CollectionsOutlined } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  slug: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
}>;

export function CollectionsListItem({
  title,
  imageUrl,
  imageAlt,
  slug,
}: Props) {
  return (
    <article className="home-collection">
      <Link to="/$categorySlug" params={{ categorySlug: slug }}>
        <div className="home-collection-image">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt ?? title} loading="lazy" />
          ) : (
            <div className="collection-image-placeholder">
              <CollectionsOutlined />
              <span>{m.collections_list_item_placeholder()}</span>
            </div>
          )}
          <span className="home-collection-browse">
            {m.collections_list_item_browse()} <ArrowForward fontSize="small" />
          </span>
        </div>
        <div className="home-collection-caption">
          <div>
            <span className="collection-eyebrow">
              {m.collections_list_item_eyebrow()}
            </span>
            <h3>{title}</h3>
          </div>
          <ArrowForward fontSize="small" />
        </div>
      </Link>
    </article>
  );
}
