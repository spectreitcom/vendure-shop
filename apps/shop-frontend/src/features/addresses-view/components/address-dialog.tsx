import { useId } from 'react';
import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { AddNewAddressForm } from './add-new-address-form';
import type { AddNewAddressFormSchema } from '../schema';
import '#/components/auth.css';
import '../addresses.css';
import { m } from '#/paraglide/messages';

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
          <span className="auth-eyebrow">{m.address_dialog_eyebrow()}</span>
          <IconButton
            className="auth-close"
            aria-label={m.address_dialog_close_label()}
            onClick={onClose}
            disabled={submitting}
          >
            <Close fontSize="small" />
          </IconButton>
          <DialogTitle id={`${id}-title`} className="auth-dialog-title">
            {values
              ? m.address_dialog_edit_title()
              : m.address_dialog_add_title()}
          </DialogTitle>
          <p id={`${id}-description`} className="auth-description">
            {values
              ? m.address_dialog_edit_description()
              : m.address_dialog_add_description()}
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
