import { createFileRoute } from '@tanstack/react-router';
import { PendingComponent } from '#/components/pending-component.tsx';
import { Typography } from '@mui/material';
import { CartViewContent } from '#/features/cart-view/components/cart-view-content.tsx';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
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
