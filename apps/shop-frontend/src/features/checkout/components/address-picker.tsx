import {
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useId } from 'react';
import { m } from '#/paraglide/messages';
import { normalizeAddress, sameAddress } from '../address-selection';
import type { CheckoutAddress, SavedAddress } from '../address-selection';

type Props = {
  kind: 'shipping' | 'billing';
  addresses: Array<SavedAddress>;
  value: CheckoutAddress;
  onChange: (address: SavedAddress | null) => void;
};

export function AddressPicker({ kind, addresses, value, onChange }: Props) {
  const id = useId();
  if (!addresses.length)
    return <p className="purchase-note">{m.checkout_no_saved_addresses()}</p>;
  const selected = addresses.find((address) =>
    sameAddress(value, normalizeAddress(address)),
  );
  const isDefault = (address: SavedAddress) =>
    kind === 'shipping'
      ? address.defaultShippingAddress
      : address.defaultBillingAddress;
  const sorted = [...addresses].sort(
    (a, b) => Number(isDefault(b)) - Number(isDefault(a)),
  );

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <FormLabel id={id}>{m.checkout_saved_addresses()}</FormLabel>
      <RadioGroup
        aria-labelledby={id}
        name={`${kind}-address`}
        value={selected?.id ?? 'new'}
        onChange={(_, addressId) =>
          onChange(
            addresses.find((address) => address.id === addressId) ?? null,
          )
        }
      >
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {sorted.map((address) => (
            <FormControlLabel
              key={address.id}
              value={address.id}
              control={<Radio size="small" />}
              sx={{
                m: 0,
                p: 1,
                alignItems: 'flex-start',
                border: 1,
                borderColor:
                  selected?.id === address.id ? 'primary.main' : 'divider',
                borderRadius: 1,
              }}
              label={
                <span className="block py-1 text-sm">
                  <span className="block font-medium">{address.fullName}</span>
                  {address.company && (
                    <span className="block">{address.company}</span>
                  )}
                  <span className="block">
                    {address.streetLine1}
                    {address.streetLine2 ? `, ${address.streetLine2}` : ''}
                  </span>
                  <span className="block">
                    {address.postalCode} {address.city}, {address.country.name}
                  </span>
                  {address.phoneNumber && (
                    <span className="block">{address.phoneNumber}</span>
                  )}
                  {isDefault(address) && (
                    <Chip
                      size="small"
                      sx={{ mt: 1 }}
                      label={
                        kind === 'shipping'
                          ? m.addresses_default_shipping()
                          : m.addresses_default_billing()
                      }
                    />
                  )}
                </span>
              }
            />
          ))}
          <FormControlLabel
            value="new"
            control={<Radio size="small" />}
            sx={{ m: 0 }}
            label={m.checkout_new_address()}
          />
        </div>
      </RadioGroup>
      <p className="purchase-note">{m.checkout_address_edit_note()}</p>
    </FormControl>
  );
}
