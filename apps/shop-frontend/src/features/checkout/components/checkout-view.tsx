import { useActiveCart } from '#/features/shared/cart';
import { PurchaseSummary } from '#/components/purchase-layout';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';
import { useForm, useSelector } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { cn } from '#/utils';
import { AddressPicker } from './address-picker';
import {
  addressFields,
  initialAddress,
  normalizeAddress,
  sameAddress,
} from '../address-selection';
import type { CheckoutAddress, SavedAddress } from '../address-selection';
import type { GetActiveCartQuery } from '#/graphql/generated';
import {
  setOrderBillingAddress,
  setOrderShippingAddress,
  setOrderShippingMethod,
} from '#/features/checkout';
import { useServerFn } from '@tanstack/react-start';
import { ShippingMethodsFormControl } from './shipping-methods-form-control.tsx';
import { checkoutFormSchema } from '../schemas';
import type { EligibleShippingMethodsQuery } from '#/graphql/generated.ts';
import { orderStates, transitionOrderToState } from '#/features/shared/order';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  shippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
  addresses: Array<SavedAddress>;
  countries: Array<{ code: string; name: string }>;
}>;

export function CheckoutView(props: Props) {
  const { activeCart, fetching } = useActiveCart();
  if (fetching && !activeCart)
    return (
      <p className="purchase-note" role="status">
        {m.common_loading_order()}
      </p>
    );
  if (!activeCart?.lines.length)
    return <p className="purchase-note">{m.checkout_empty()}</p>;
  return (
    <CheckoutForm key={activeCart.id} {...props} activeCart={activeCart} />
  );
}

function CheckoutForm({
  shippingMethods,
  addresses,
  countries,
  activeCart,
}: Props & {
  activeCart: NonNullable<GetActiveCartQuery['activeOrder']>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh: refreshActiveCart } = useActiveCart();
  const [initialShipping] = useState(() =>
    initialAddress(activeCart.shippingAddress, addresses, 'shipping'),
  );
  const [initialBilling] = useState(() =>
    initialAddress(activeCart.billingAddress, addresses, 'billing'),
  );
  const setOrderShippingAddressFn = useServerFn(setOrderShippingAddress);
  const setOrderBillingAddressFn = useServerFn(setOrderBillingAddress);
  const setOrderShippingMethodFn = useServerFn(setOrderShippingMethod);
  const transitionOrderToStateFn = useServerFn(transitionOrderToState);

  const needInvoiceInputValue =
    (
      activeCart.shippingAddress?.customFields as
        { needInvoice?: boolean } | null | undefined
    )?.needInvoice ?? false;

  const form = useForm({
    validators: {
      onSubmit: checkoutFormSchema,
    },
    defaultValues: {
      needInvoice: needInvoiceInputValue,
      billingSameAsShipping:
        sameAddress(initialShipping, initialBilling) ||
        !addressFields.some((field) => initialBilling[field]),
      shippingCity: initialShipping.City,
      shippingCompany: initialShipping.Company,
      shippingCountryCode: initialShipping.CountryCode,
      shippingFullName: initialShipping.FullName,
      shippingPhoneNumber: initialShipping.PhoneNumber,
      shippingPostalCode: initialShipping.PostalCode,
      shippingStreetLine1: initialShipping.StreetLine1,
      shippingStreetLine2: initialShipping.StreetLine2,
      billingCity: initialBilling.City,
      billingCompany: initialBilling.Company,
      billingCountryCode: initialBilling.CountryCode,
      billingFullName: initialBilling.FullName,
      billingPhoneNumber: initialBilling.PhoneNumber,
      billingPostalCode: initialBilling.PostalCode,
      billingStreetLine1: initialBilling.StreetLine1,
      billingStreetLine2: initialBilling.StreetLine2,

      shippingMethodId: activeCart.shippingLines[0]?.shippingMethod?.id ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        setIsSubmitting(true);
        await setOrderShippingAddressFn({
          data: {
            fullName: value.shippingFullName,
            phoneNumber: value.shippingPhoneNumber,
            countryCode: value.shippingCountryCode,
            company: value.shippingCompany,
            city: value.shippingCity,
            postalCode: value.shippingPostalCode,
            streetLine1: value.shippingStreetLine1,
            streetLine2: value.shippingStreetLine2,
            needInvoice: value.needInvoice,
          },
        });

        if (value.needInvoice && !value.billingSameAsShipping) {
          await setOrderBillingAddressFn({
            data: {
              fullName: value.billingFullName,
              phoneNumber: value.billingPhoneNumber,
              countryCode: value.billingCountryCode,
              company: value.billingCompany,
              city: value.billingCity,
              postalCode: value.billingPostalCode,
              streetLine1: value.billingStreetLine1,
              streetLine2: value.billingStreetLine2,
            },
          });
        } else {
          await setOrderBillingAddressFn({
            data: {
              fullName: value.shippingFullName,
              phoneNumber: value.shippingPhoneNumber,
              countryCode: value.shippingCountryCode,
              company: value.shippingCompany,
              city: value.shippingCity,
              postalCode: value.shippingPostalCode,
              streetLine1: value.shippingStreetLine1,
              streetLine2: value.shippingStreetLine2,
            },
          });
        }
        if (activeCart.state === orderStates.AddingItems) {
          await transitionOrderToStateFn({
            data: { state: 'ArrangingPayment' },
          });
        }

        await refreshActiveCart();
        await router.navigate({ to: '/cart/payment' });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError(m.common_unexpected_error());
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const needInvoice = useSelector(
    form.store,
    (state) => state.values.needInvoice,
  );

  const handleShippingMethodChange = async (shippingMethodId: string) => {
    try {
      setError(null);
      setIsUpdatingShipping(true);
      await setOrderShippingMethodFn({ data: { shippingMethodId } });
      await refreshActiveCart();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      setError(m.common_unexpected_error());
      return false;
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  const values = useSelector(form.store, (state) => state.values);
  const readAddress = (kind: 'shipping' | 'billing'): CheckoutAddress => ({
    FullName: values[`${kind}FullName`],
    Company: values[`${kind}Company`],
    PhoneNumber: values[`${kind}PhoneNumber`],
    PostalCode: values[`${kind}PostalCode`],
    City: values[`${kind}City`],
    StreetLine1: values[`${kind}StreetLine1`],
    StreetLine2: values[`${kind}StreetLine2`],
    CountryCode: values[`${kind}CountryCode`],
  });
  const drafts = useRef<{
    shipping: CheckoutAddress;
    billing: CheckoutAddress;
  }>({ shipping: normalizeAddress(), billing: normalizeAddress() });
  const selectAddress = (
    kind: 'shipping' | 'billing',
    address: SavedAddress | null,
  ) => {
    const current = readAddress(kind);
    if (
      !addresses.some((saved) => sameAddress(current, normalizeAddress(saved)))
    )
      drafts.current[kind] = current;
    const normalized = address
      ? normalizeAddress(address)
      : drafts.current[kind];
    for (const field of addressFields)
      form.setFieldValue(`${kind}${field}`, normalized[field]);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSubmitting && !isUpdatingShipping) await form.handleSubmit();
      }}
    >
      <fieldset
        disabled={isSubmitting || isUpdatingShipping}
        className="m-0 min-w-0 border-0 p-0"
      >
        <div className="purchase-grid">
          <div>
            <div>
              <Card>
                <CardContent>
                  <h2>{m.checkout_shipping_address()}</h2>
                  <AddressPicker
                    kind="shipping"
                    addresses={addresses}
                    value={readAddress('shipping')}
                    onChange={(address) => selectAddress('shipping', address)}
                  />
                  <div className={'mt-4'}>
                    <div>
                      <form.Field
                        name={'shippingFullName'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            label={m.checkout_full_name()}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            helperText={field.state.meta.errors.map(
                              (fieldError) => fieldError?.message,
                            )}
                          />
                        )}
                      />
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'shippingCompany'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            label={m.checkout_company()}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            helperText={field.state.meta.errors.map(
                              (fieldError) => fieldError?.message,
                            )}
                          />
                        )}
                      />
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'shippingPhoneNumber'}
                        children={(field) => (
                          <TextField
                            type={'tel'}
                            size={'small'}
                            className={'w-full'}
                            label={m.checkout_phone()}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            helperText={field.state.meta.errors.map(
                              (fieldError) => fieldError?.message,
                            )}
                          />
                        )}
                      />
                    </div>

                    <div
                      className={'mt-4 flex items-center justify-between gap-4'}
                    >
                      <div className={'w-4/12'}>
                        <form.Field
                          name={'shippingPostalCode'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_postal_code()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div className={'w-8/12'}>
                        <form.Field
                          name={'shippingCity'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_city()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'shippingStreetLine1'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            label={m.checkout_address()}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            helperText={field.state.meta.errors.map(
                              (fieldError) => fieldError?.message,
                            )}
                          />
                        )}
                      />
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'shippingStreetLine2'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            label={m.checkout_address_line2()}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            helperText={field.state.meta.errors.map(
                              (fieldError) => fieldError?.message,
                            )}
                          />
                        )}
                      />
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'shippingCountryCode'}
                        children={(field) => (
                          <TextField
                            select
                            label={m.checkout_country()}
                            variant={'outlined'}
                            size={'small'}
                            className={'w-full'}
                            value={field.state.value}
                            error={field.state.meta.errors.length > 0}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          >
                            {field.state.value &&
                              !countries.some(
                                (country) => country.code === field.state.value,
                              ) && (
                                <MenuItem value={field.state.value}>
                                  {field.state.value}
                                </MenuItem>
                              )}
                            {countries.map((country) => (
                              <MenuItem key={country.code} value={country.code}>
                                {country.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </div>

                    <div className={'mt-4'}>
                      <form.Field
                        name={'needInvoice'}
                        children={(field) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.state.value}
                                onChange={(_, checked) =>
                                  field.handleChange(checked)
                                }
                              />
                            }
                            label={m.checkout_need_invoice()}
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={cn('mt-4', !needInvoice && 'hidden')}>
              <Card>
                <CardContent>
                  <h2>{m.checkout_billing_address()}</h2>
                  <form.Field name="billingSameAsShipping">
                    {(field) => (
                      <FormControlLabel
                        label={m.checkout_billing_same()}
                        control={
                          <Checkbox
                            checked={field.state.value}
                            onChange={(_, checked) =>
                              field.handleChange(checked)
                            }
                          />
                        }
                      />
                    )}
                  </form.Field>
                  {values.billingSameAsShipping && (
                    <p className="purchase-note">
                      {m.checkout_billing_same_note()}
                    </p>
                  )}
                  <div className={cn(values.billingSameAsShipping && 'hidden')}>
                    <AddressPicker
                      kind="billing"
                      addresses={addresses}
                      value={readAddress('billing')}
                      onChange={(address) => selectAddress('billing', address)}
                    />
                    <div className={'mt-4'}>
                      <div>
                        <form.Field
                          name={'billingFullName'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_full_name()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div className={'mt-4'}>
                        <form.Field
                          name={'billingCompany'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_company()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div className={'mt-4'}>
                        <form.Field
                          name={'billingPhoneNumber'}
                          children={(field) => (
                            <TextField
                              type={'tel'}
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_phone()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div
                        className={
                          'mt-4 flex items-center justify-between gap-4'
                        }
                      >
                        <div className={'w-4/12'}>
                          <form.Field
                            name={'billingPostalCode'}
                            children={(field) => (
                              <TextField
                                size={'small'}
                                className={'w-full'}
                                label={m.checkout_postal_code()}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                value={field.state.value}
                                error={field.state.meta.errors.length > 0}
                                helperText={field.state.meta.errors.map(
                                  (fieldError) => fieldError?.message,
                                )}
                              />
                            )}
                          />
                        </div>

                        <div className={'w-8/12'}>
                          <form.Field
                            name={'billingCity'}
                            children={(field) => (
                              <TextField
                                size={'small'}
                                className={'w-full'}
                                label={m.checkout_city()}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                value={field.state.value}
                                error={field.state.meta.errors.length > 0}
                                helperText={field.state.meta.errors.map(
                                  (fieldError) => fieldError?.message,
                                )}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className={'mt-4'}>
                        <form.Field
                          name={'billingStreetLine1'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_address()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div className={'mt-4'}>
                        <form.Field
                          name={'billingStreetLine2'}
                          children={(field) => (
                            <TextField
                              size={'small'}
                              className={'w-full'}
                              label={m.checkout_address_line2()}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              helperText={field.state.meta.errors.map(
                                (fieldError) => fieldError?.message,
                              )}
                            />
                          )}
                        />
                      </div>

                      <div className={'mt-4'}>
                        <form.Field
                          name={'billingCountryCode'}
                          children={(field) => (
                            <TextField
                              select
                              label={m.checkout_country()}
                              variant={'outlined'}
                              size={'small'}
                              className={'w-full'}
                              value={field.state.value}
                              error={field.state.meta.errors.length > 0}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            >
                              {field.state.value &&
                                !countries.some(
                                  (country) =>
                                    country.code === field.state.value,
                                ) && (
                                  <MenuItem value={field.state.value}>
                                    {field.state.value}
                                  </MenuItem>
                                )}
                              {countries.map((country) => (
                                <MenuItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={'mt-4'}>
              <Card>
                <CardContent>
                  <h2>{m.checkout_shipping_method()}</h2>
                  <div className={'mt-4'}>
                    <form.Field
                      name={'shippingMethodId'}
                      children={(field) => (
                        <ShippingMethodsFormControl
                          onChange={async (value) => {
                            if (await handleShippingMethodChange(value ?? '')) {
                              field.handleChange(value ?? '');
                            }
                          }}
                          disabled={isUpdatingShipping || isSubmitting}
                          shippingMethods={shippingMethods}
                          currencyCode={activeCart.currencyCode}
                          error={field.state.meta.errors.length > 0}
                          helperText={field.state.meta.errors.map(
                            (fieldError) => fieldError?.message,
                          )}
                          value={field.state.value}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <PurchaseSummary>
            <Button
              type={'submit'}
              variant={'contained'}
              className={'w-full'}
              loading={isSubmitting}
              disabled={
                isSubmitting || isUpdatingShipping || !shippingMethods.length
              }
            >
              {m.checkout_submit()}
            </Button>
          </PurchaseSummary>
        </div>
      </fieldset>
      <Snackbar
        open={!!error}
        message={error}
        onClose={() => setError(null)}
        autoHideDuration={6000}
      />
    </form>
  );
}
