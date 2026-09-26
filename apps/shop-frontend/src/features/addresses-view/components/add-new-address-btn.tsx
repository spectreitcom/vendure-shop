import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';
import { AddressDialog } from './address-dialog';
import { useRouter } from '@tanstack/react-router';
import { createCustomerAddress } from '../api';
import { useServerFn } from '@tanstack/react-start';
import type { AddNewAddressFormSchema } from '../schema';
import { m } from '#/paraglide/messages';

export function AddNewAddressBtn() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const createCustomerAddressFn = useServerFn(createCustomerAddress);

  const handleSubmit = async (value: AddNewAddressFormSchema) => {
    try {
      setError(null);
      setSubmitting(true);
      await createCustomerAddressFn({ data: value });
      await router.invalidate();
      setShowModal(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      setError(m.addresses_generic_error());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        disableElevation
        startIcon={<Add />}
        onClick={() => {
          setError(null);
          setShowModal(true);
        }}
      >
        {m.addresses_add_button()}
      </Button>

      <AddressDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </>
  );
}
