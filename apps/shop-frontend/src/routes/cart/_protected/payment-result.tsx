import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/_protected/payment-result')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cart/_protected/payment-result"!</div>
}
