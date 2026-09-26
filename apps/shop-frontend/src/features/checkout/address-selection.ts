import type { AddressesQuery } from '#/graphql/generated';

export type SavedAddress = NonNullable<
  NonNullable<AddressesQuery['activeCustomer']>['addresses']
>[number];

export const addressFields = [
  'FullName',
  'Company',
  'PhoneNumber',
  'PostalCode',
  'City',
  'StreetLine1',
  'StreetLine2',
  'CountryCode',
] as const;

export type CheckoutAddress = Record<(typeof addressFields)[number], string>;

type OrderAddress = {
  fullName?: string | null;
  company?: string | null;
  phoneNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  streetLine1?: string | null;
  streetLine2?: string | null;
  countryCode?: string | null;
  country?: string | { code?: string | null } | null;
};

export function normalizeAddress(
  address?: OrderAddress | SavedAddress | null,
): CheckoutAddress {
  return {
    FullName: address?.fullName ?? '',
    Company: address?.company ?? '',
    PhoneNumber: address?.phoneNumber ?? '',
    PostalCode: address?.postalCode ?? '',
    City: address?.city ?? '',
    StreetLine1: address?.streetLine1 ?? '',
    StreetLine2: address?.streetLine2 ?? '',
    CountryCode:
      (address && 'countryCode' in address ? address.countryCode : undefined) ??
      (typeof address?.country === 'object'
        ? address.country?.code
        : undefined) ??
      '',
  };
}

export function sameAddress(left: CheckoutAddress, right: CheckoutAddress) {
  return addressFields.every((field) => left[field] === right[field]);
}

export function initialAddress(
  current: OrderAddress | null | undefined,
  addresses: Array<SavedAddress>,
  kind: 'shipping' | 'billing',
): CheckoutAddress {
  const normalized = normalizeAddress(current);
  // Vendure can return an empty address object for a new order.
  if (addressFields.some((field) => normalized[field].trim()))
    return normalized;
  return normalizeAddress(
    addresses.find((address) =>
      kind === 'shipping'
        ? address.defaultShippingAddress
        : address.defaultBillingAddress,
    ) ?? (kind === 'shipping' ? addresses[0] : undefined),
  );
}
