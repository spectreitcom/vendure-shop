import { createFileRoute } from '@tanstack/react-router';
import { getHomeCollections } from '#/features/home-collections/api';
import { CircularProgress } from '@mui/material';
import { CollectionsList } from '#/features/home-collections';

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => <CircularProgress aria-label="Loading…" />,
  loader: async () => {
    const homeCollections = await getHomeCollections();

    return {
      homeCollections,
    };
  },
});

function Home() {
  const { homeCollections } = Route.useLoaderData();

  return (
    <div>
      <div className="container">
        <CollectionsList className={'mt-8'} items={homeCollections} />
      </div>
    </div>
  );
}
