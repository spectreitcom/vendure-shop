import { createFileRoute } from '@tanstack/react-router';
import { CircularProgress, Typography } from '@mui/material';
import { CartViewContent } from '#/features/cart-view/components/cart-view-content.tsx';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
  pendingComponent: () => <CircularProgress size={24} aria-label="Loading…" />,
});

function RouteComponent() {
  return (
    <div className={'mt-8'}>
      <div className={'container'}>
        <Typography variant={'h4'} component={'h1'}>
          Cart
        </Typography>

        <div className={'mt-4'}>
          <CartViewContent />
        </div>
      </div>
    </div>
  );
}
