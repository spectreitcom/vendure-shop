import { useId } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { getAddressCountries } from '../api';
import { addNewAddressFormSchema } from '../schema';
import type { AddNewAddressFormSchema } from '../schema';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  onSubmit: (value: AddNewAddressFormSchema) => void | Promise<void>;
  submitting: boolean;
  values?: AddNewAddressFormSchema;
  onCancel: () => void;
  error: string | null;
}>;

const textFields = [
  {
    name: 'fullName',
    label: m.address_form_full_name,
    autoComplete: 'name',
    required: true,
  },
  {
    name: 'company',
    label: m.address_form_company,
    autoComplete: 'organization',
  },
  {
    name: 'streetLine1',
    label: m.address_form_street_line1,
    autoComplete: 'address-line1',
    required: true,
    wide: true,
  },
  {
    name: 'streetLine2',
    label: m.address_form_street_line2,
    autoComplete: 'address-line2',
    wide: true,
  },
  {
    name: 'postalCode',
    label: m.address_form_postal_code,
    autoComplete: 'postal-code',
    required: true,
  },
  {
    name: 'city',
    label: m.address_form_city,
    autoComplete: 'address-level2',
    required: true,
  },
  {
    name: 'phoneNumber',
    label: m.address_form_phone_number,
    autoComplete: 'tel',
  },
] as const;

export function AddNewAddressForm({
  onSubmit,
  submitting,
  values,
  onCancel,
  error,
}: Props) {
  const id = useId();
  const getCountries = useServerFn(getAddressCountries);
  const countries = useQuery({
    queryKey: ['address-countries'],
    queryFn: () => getCountries(),
    staleTime: 60 * 60 * 1000,
  });
  const form = useForm({
    validators: { onSubmit: addNewAddressFormSchema },
    defaultValues: {
      fullName: values?.fullName ?? '',
      company: values?.company ?? '',
      streetLine1: values?.streetLine1 ?? '',
      streetLine2: values?.streetLine2 ?? '',
      city: values?.city ?? '',
      postalCode: values?.postalCode ?? '',
      countryCode: values?.countryCode ?? '',
      phoneNumber: values?.phoneNumber ?? '',
      defaultShippingAddress: values?.defaultShippingAddress ?? false,
      defaultBillingAddress: values?.defaultBillingAddress ?? false,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      className="address-form"
      noValidate
      aria-busy={submitting}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!submitting) await form.handleSubmit();
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <p className="address-form-note">{m.address_form_required_note()}</p>
      <div className="address-fields">
        {textFields.map((input) => (
          <form.Field key={input.name} name={input.name}>
            {(field) => (
              <TextField
                id={`${id}-${input.name}`}
                className={'wide' in input ? 'address-field-wide' : undefined}
                fullWidth
                label={input.label()}
                required={'required' in input}
                autoComplete={input.autoComplete}
                autoFocus={input.name === 'fullName'}
                type={input.name === 'phoneNumber' ? 'tel' : 'text'}
                name={input.name}
                disabled={submitting}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors
                  .map((issue) => issue?.message)
                  .join(' ')}
              />
            )}
          </form.Field>
        ))}
        <form.Field name="countryCode">
          {(field) => (
            <TextField
              id={`${id}-country`}
              select
              fullWidth
              required
              label={m.address_form_country()}
              name="countryCode"
              autoComplete="country"
              value={field.state.value}
              disabled={submitting || !countries.data?.length}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={
                field.state.meta.errors
                  .map((issue) => issue?.message)
                  .join(' ') ||
                (countries.isPending
                  ? m.address_form_loading_countries()
                  : undefined)
              }
            >
              {field.state.value &&
                !countries.data?.some(
                  (country) => country.code === field.state.value,
                ) && (
                  <MenuItem value={field.state.value}>
                    {field.state.value}
                  </MenuItem>
                )}
              {countries.data?.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </form.Field>
      </div>
      {(countries.isError ||
        (countries.isSuccess && !countries.data.length)) && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => countries.refetch()}
              disabled={countries.isFetching}
            >
              {m.address_form_retry()}
            </Button>
          }
        >
          {m.address_form_countries_error()}
        </Alert>
      )}
      <fieldset className="address-defaults" disabled={submitting}>
        <legend>{m.address_form_preferences()}</legend>
        {(
          [
            ['defaultShippingAddress', m.address_form_default_shipping],
            ['defaultBillingAddress', m.address_form_default_billing],
          ] as const
        ).map(([name, label]) => (
          <form.Field key={name} name={name}>
            {(field) => (
              <FormControlLabel
                label={label()}
                control={
                  <Checkbox
                    name={name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(_, checked) => field.handleChange(checked)}
                  />
                }
              />
            )}
          </form.Field>
        ))}
      </fieldset>
      <div className="address-form-actions">
        <Button
          className="address-cancel"
          variant="outlined"
          onClick={onCancel}
          disabled={submitting}
        >
          {m.address_form_cancel()}
        </Button>
        <Button
          className="auth-submit"
          variant="contained"
          type="submit"
          loading={submitting}
          disabled={submitting || !countries.data?.length}
        >
          {values ? m.address_form_save() : m.address_form_add()}
        </Button>
      </div>
    </form>
  );
}
