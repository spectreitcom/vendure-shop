import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/s/orders/$orderId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/s/orders/$orderId"!</div>
}
