import { createFileRoute } from '@tanstack/react-router';
import { CircularProgress } from '@mui/material';
import {
  CollectionsList,
  getHomeCollections,
} from '#/features/home-collections';

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
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
