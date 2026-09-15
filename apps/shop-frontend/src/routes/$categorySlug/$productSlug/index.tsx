import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$categorySlug/$productSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$categorySlug/$productSlug/"!</div>
}
