import { createFileRoute } from '@tanstack/react-router';

// todo: this route must be protected

export const Route = createFileRoute('/cart/checkout')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/cart/checkout"!</div>;
}
