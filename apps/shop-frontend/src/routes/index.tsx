import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import {
  CollectionsList,
  getHomeCollections,
} from '#/features/home-collections';

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: PendingComponent,
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
