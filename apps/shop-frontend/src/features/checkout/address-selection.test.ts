import { describe, expect, it } from 'vitest';
import {
  initialAddress,
  normalizeAddress,
  sameAddress,
} from './address-selection';
import type { SavedAddress } from './address-selection';
import { checkoutFormSchema } from './schemas';

const address = (
  id: string,
  flags: Partial<SavedAddress> = {},
): SavedAddress => ({
  __typename: 'Address',
  id,
  fullName: 'Jan Kowalski',
  company: '',
  phoneNumber: '123456789',
  postalCode: '00-001',
  city: 'Warsaw',
  streetLine1: `Street ${id}`,
  streetLine2: '',
  country: { __typename: 'Country', id: 'pl', code: 'PL', name: 'Poland' },
  defaultShippingAddress: false,
  defaultBillingAddress: false,
  ...flags,
});

const addresses = [
  address('1'),
  address('2', { defaultShippingAddress: true }),
  address('3', { defaultBillingAddress: true }),
];

describe('checkout address selection', () => {
  it('handles a new order with country explicitly set to null', () => {
    expect(normalizeAddress({ country: null, countryCode: null })).toEqual(
      normalizeAddress(),
    );
    expect(
      initialAddress(
        { country: null, countryCode: null },
        addresses,
        'shipping',
      ),
    ).toEqual(normalizeAddress(addresses[1]));
  });
  it('uses countryCode for order addresses whose country is a display name or null', () => {
    expect(
      normalizeAddress({ country: 'Poland', countryCode: 'PL' }).CountryCode,
    ).toBe('PL');
    expect(
      normalizeAddress({ country: null, countryCode: 'PL' }).CountryCode,
    ).toBe('PL');
    expect(normalizeAddress({ country: 'Poland' }).CountryCode).toBe('');
  });

  it('prefers the order address over saved defaults, including partially filled addresses', () => {
    expect(
      initialAddress({ streetLine1: 'Edited street' }, addresses, 'shipping')
        .StreetLine1,
    ).toBe('Edited street');
  });
  it('selects separate shipping and billing defaults for an empty order', () => {
    expect(initialAddress({}, addresses, 'shipping')).toEqual(
      normalizeAddress(addresses[1]),
    );
    expect(initialAddress(null, addresses, 'billing')).toEqual(
      normalizeAddress(addresses[2]),
    );
  });
  it('uses the first saved shipping address when no default exists, but leaves billing empty', () => {
    expect(initialAddress(null, [addresses[0]], 'shipping')).toEqual(
      normalizeAddress(addresses[0]),
    );
    expect(initialAddress(null, [addresses[0]], 'billing')).toEqual(
      normalizeAddress(),
    );
  });
  it('supports an empty address book', () => {
    expect(initialAddress(null, [], 'shipping')).toEqual(normalizeAddress());
  });
  it('matches order addresses against saved addresses without IDs or default flags', () => {
    const saved = normalizeAddress(addresses[0]);
    expect(
      sameAddress(
        saved,
        normalizeAddress({ ...addresses[0], countryCode: 'PL' }),
      ),
    ).toBe(true);
    expect(sameAddress(saved, { ...saved, PhoneNumber: '987654321' })).toBe(
      false,
    );
  });
});

const values = {
  needInvoice: true,
  billingSameAsShipping: true,
  shippingMethodId: '1',
  shippingFullName: 'Jan Kowalski',
  shippingCompany: '',
  shippingPhoneNumber: '123456789',
  shippingCountryCode: 'PL',
  shippingPostalCode: '00-001',
  shippingCity: 'Warsaw',
  shippingStreetLine1: 'Street 1',
  shippingStreetLine2: '',
  billingFullName: '',
  billingCompany: '',
  billingPhoneNumber: '',
  billingCountryCode: '',
  billingPostalCode: '',
  billingCity: '',
  billingStreetLine1: '',
  billingStreetLine2: '',
};

describe('billing address validation', () => {
  it('allows empty separate billing fields when the invoice uses the shipping address', () => {
    expect(checkoutFormSchema.safeParse(values).success).toBe(true);
  });
  it('requires billing details when a separate invoice address is selected', () => {
    const result = checkoutFormSchema.safeParse({
      ...values,
      billingSameAsShipping: false,
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path[0])).toContain(
        'billingFullName',
      );
  });
  it('does not require billing details without an invoice', () => {
    expect(
      checkoutFormSchema.safeParse({
        ...values,
        needInvoice: false,
        billingSameAsShipping: false,
      }).success,
    ).toBe(true);
  });
});
