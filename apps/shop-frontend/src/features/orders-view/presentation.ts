export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const statuses: Record<string, { label: string; tone: string }> = {
  AddingItems: { label: 'In progress', tone: 'neutral' },
  ArrangingPayment: { label: 'Awaiting payment', tone: 'pending' },
  PaymentAuthorized: { label: 'Payment authorized', tone: 'pending' },
  PaymentSettled: { label: 'Paid', tone: 'success' },
  PartiallyShipped: { label: 'Partially shipped', tone: 'pending' },
  Shipped: { label: 'Shipped', tone: 'success' },
  PartiallyDelivered: { label: 'Partially delivered', tone: 'pending' },
  Delivered: { label: 'Delivered', tone: 'success' },
  Cancelled: { label: 'Cancelled', tone: 'cancelled' },
};
