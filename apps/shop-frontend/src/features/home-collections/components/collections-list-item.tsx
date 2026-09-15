import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

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
    <Link to={`/$categorySlug`} params={{ categorySlug: slug }}>
      <Card>
        <CardActionArea>
          {imageUrl && (
            <div className={'h-[120px] overflow-hidden'}>
              <img
                className={'w-full aspect-[4/3] object-cover'}
                src={imageUrl}
                alt={imageAlt}
                loading={'lazy'}
              />
            </div>
          )}
          <CardContent>
            <Typography gutterBottom variant="h6" component="p">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
