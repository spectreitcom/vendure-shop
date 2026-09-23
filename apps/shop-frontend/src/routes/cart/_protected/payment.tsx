import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/_protected/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cart/payment"!</div>
}
