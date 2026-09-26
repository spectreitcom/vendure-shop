import { m } from '#/paraglide/messages';

export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const statuses: Record<string, { label: () => string; tone: string }> = {
  AddingItems: { label: m.order_status_adding_items, tone: 'neutral' },
  ArrangingPayment: {
    label: m.order_status_arranging_payment,
    tone: 'pending',
  },
  PaymentAuthorized: {
    label: m.order_status_payment_authorized,
    tone: 'pending',
  },
  PaymentSettled: { label: m.order_status_payment_settled, tone: 'success' },
  PartiallyShipped: {
    label: m.order_status_partially_shipped,
    tone: 'pending',
  },
  Shipped: { label: m.order_status_shipped, tone: 'success' },
  PartiallyDelivered: {
    label: m.order_status_partially_delivered,
    tone: 'pending',
  },
  Delivered: { label: m.order_status_delivered, tone: 'success' },
  Cancelled: { label: m.order_status_cancelled, tone: 'cancelled' },
};
