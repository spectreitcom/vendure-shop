import { EditOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { AddressesQuery } from '#/graphql/generated.ts';
import { useState } from 'react';
import { updateCustomerAddress } from '../api';
import { AddressDialog } from './address-dialog';
import type { AddNewAddressFormSchema } from '#/features/addresses-view/schema';
import { useServerFn } from '@tanstack/react-start';
import { useRouter } from '@tanstack/react-router';

type Props = Readonly<{
  address: NonNullable<
    NonNullable<AddressesQuery['activeCustomer']>['addresses']
  >[number];
}>;

export function EditAddressBtn({ address }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const updateCustomerAddressFn = useServerFn(updateCustomerAddress);
  const router = useRouter();

  const { id } = address;

  const handleSubmit = async (value: AddNewAddressFormSchema) => {
    try {
      setError(null);
      setSubmitting(true);
      await updateCustomerAddressFn({ data: { id, ...value } });
      await router.invalidate();
      setShowModal(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        startIcon={<EditOutlined />}
        onClick={() => {
          setError(null);
          setShowModal(true);
        }}
      >
        Edit address
      </Button>

      <AddressDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        values={{
          fullName: address.fullName ?? '',
          company: address.company ?? '',
          streetLine1: address.streetLine1,
          streetLine2: address.streetLine2 ?? '',
          city: address.city ?? '',
          postalCode: address.postalCode ?? '',
          countryCode: address.country.code,
          phoneNumber: address.phoneNumber ?? '',
          defaultShippingAddress: address.defaultShippingAddress ?? false,
          defaultBillingAddress: address.defaultBillingAddress ?? false,
        }}
      />
    </>
  );
}
