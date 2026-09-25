import { useId } from 'react';
import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { AddNewAddressForm } from './add-new-address-form';
import type { AddNewAddressFormSchema } from '../schema';
import '#/components/auth.css';
import '../addresses.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: AddNewAddressFormSchema) => Promise<void>;
  submitting: boolean;
  error: string | null;
  values?: AddNewAddressFormSchema;
};

export function AddressDialog({
  open,
  onClose,
  onSubmit,
  submitting,
  error,
  values,
}: Props) {
  const id = useId();
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!submitting) onClose();
      }}
      className="auth-dialog address-dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      fullWidth
      maxWidth="sm"
    >
      <div className="auth-surface">
        <div className="auth-dialog-header">
          <span className="auth-eyebrow">Your address book</span>
          <IconButton
            className="auth-close"
            aria-label="Close address dialog"
            onClick={onClose}
            disabled={submitting}
          >
            <Close fontSize="small" />
          </IconButton>
          <DialogTitle id={`${id}-title`} className="auth-dialog-title">
            {values ? 'Edit address' : 'Add a new address'}
          </DialogTitle>
          <p id={`${id}-description`} className="auth-description">
            {values
              ? 'Keep your delivery and billing details up to date.'
              : 'Save your details for a smoother checkout next time.'}
          </p>
        </div>
        <DialogContent className="auth-dialog-content">
          <AddNewAddressForm
            onSubmit={onSubmit}
            submitting={submitting}
            values={values}
            onCancel={onClose}
            error={error}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
