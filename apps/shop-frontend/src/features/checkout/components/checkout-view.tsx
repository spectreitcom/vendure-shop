import { useActiveCart } from '#/features/shared/cart';
import { ProductPrice } from '#/components/product-price.tsx';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, useSelector } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { cn } from '#/utils';
import {
  setOrderBillingAddress,
  setOrderShippingAddress,
  setOrderShippingMethod,
} from '#/features/checkout';
import { useServerFn } from '@tanstack/react-start';
import { ShippingMethodsFormControl } from './shipping-methods-form-control.tsx';
import { checkoutFormSchema } from '../schemas';
import type { EligibleShippingMethodsQuery } from '#/graphql/generated.ts';

type Props = Readonly<{
  shippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
}>;

export function CheckoutView({ shippingMethods }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh: refreshActiveCart, activeCart } = useActiveCart();
  const setOrderShippingAddressFn = useServerFn(setOrderShippingAddress);
  const setOrderBillingAddressFn = useServerFn(setOrderBillingAddress);
  const setOrderShippingMethodFn = useServerFn(setOrderShippingMethod);

  const needInvoiceInputValue =
    (
      activeCart?.shippingAddress?.customFields as
        { needInvoice?: boolean } | null | undefined
    )?.needInvoice ?? false;

  const form = useForm({
    validators: {
      onSubmit: checkoutFormSchema,
    },
    defaultValues: {
      needInvoice: needInvoiceInputValue,
      shippingCity: activeCart?.shippingAddress?.city ?? '',
      shippingCompany: activeCart?.shippingAddress?.company ?? '',
      shippingCountryCode: activeCart?.shippingAddress?.countryCode ?? '',
      shippingFullName: activeCart?.shippingAddress?.fullName ?? '',
      shippingPhoneNumber: activeCart?.shippingAddress?.phoneNumber ?? '',
      shippingPostalCode: activeCart?.shippingAddress?.postalCode ?? '',
      shippingStreetLine1: activeCart?.shippingAddress?.streetLine1 ?? '',
      shippingStreetLine2: activeCart?.shippingAddress?.streetLine2 ?? '',

      billingCity: activeCart?.billingAddress?.city ?? '',
      billingCompany: activeCart?.billingAddress?.company ?? '',
      billingCountryCode: activeCart?.billingAddress?.countryCode ?? '',
      billingFullName: activeCart?.billingAddress?.fullName ?? '',
      billingPhoneNumber: activeCart?.billingAddress?.phoneNumber ?? '',
      billingPostalCode: activeCart?.billingAddress?.postalCode ?? '',
      billingStreetLine1: activeCart?.billingAddress?.streetLine1 ?? '',
      billingStreetLine2: activeCart?.billingAddress?.streetLine2 ?? '',

      shippingMethodId: activeCart?.shippingLines[0]?.shippingMethod?.id ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
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

        if (value.needInvoice) {
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
        await refreshActiveCart();
        await router.navigate({ to: '/cart/payment' });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError('An unexpected error occurred');
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
      await setOrderShippingMethodFn({ data: { shippingMethodId } });
      await refreshActiveCart();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      setError('An unexpected error occurred');
    }
  };

  if (!activeCart) return null;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <Grid container columns={12} spacing={4}>
        <Grid size={8}>
          <div className={'flex items-center gap-4'}>
            <span className={'text-2xl font-semibold'}>Total:</span>
            <ProductPrice
              className={'text-2xl font-semibold'}
              price={activeCart.totalWithTax}
              currencyCode={activeCart.currencyCode}
            />
          </div>

          <div className={'mt-4'}>
            <Card>
              <CardContent>
                <Typography variant={'h6'} component={'h6'}>
                  Shipping address
                </Typography>
                <div className={'mt-4'}>
                  <div>
                    <form.Field
                      name={'shippingFullName'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Full name'}
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
                          placeholder={'Company name'}
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
                          placeholder={'Phone number'}
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
                            placeholder={'Postal code'}
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

                    <div className={'w-8/12'}>
                      <form.Field
                        name={'shippingCity'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            placeholder={'City'}
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
                  </div>

                  <div className={'mt-4'}>
                    <form.Field
                      name={'shippingStreetLine1'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Address'}
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
                          placeholder={'Address line 2'}
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
                        <Select
                          variant={'outlined'}
                          size={'small'}
                          className={'w-full'}
                          value={field.state.value}
                          error={field.state.meta.errors.length > 0}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <MenuItem value={'PL'}>Poland</MenuItem>
                        </Select>
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
                          label="Need invoice?"
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
                <Typography variant={'h6'} component={'h6'}>
                  Billing address
                </Typography>
                <div className={'mt-4'}>
                  <div>
                    <form.Field
                      name={'billingFullName'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Full name'}
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
                      name={'billingCompany'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Company name'}
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
                      name={'billingPhoneNumber'}
                      children={(field) => (
                        <TextField
                          type={'tel'}
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Phone number'}
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
                        name={'billingPostalCode'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            placeholder={'Postal code'}
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

                    <div className={'w-8/12'}>
                      <form.Field
                        name={'billingCity'}
                        children={(field) => (
                          <TextField
                            size={'small'}
                            className={'w-full'}
                            placeholder={'City'}
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
                  </div>

                  <div className={'mt-4'}>
                    <form.Field
                      name={'billingStreetLine1'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Address'}
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
                      name={'billingStreetLine2'}
                      children={(field) => (
                        <TextField
                          size={'small'}
                          className={'w-full'}
                          placeholder={'Address line 2'}
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
                      name={'billingCountryCode'}
                      children={(field) => (
                        <Select
                          variant={'outlined'}
                          size={'small'}
                          className={'w-full'}
                          value={field.state.value}
                          error={field.state.meta.errors.length > 0}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <MenuItem value={'PL'}>Poland</MenuItem>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={'mt-4'}>
            <Card>
              <CardContent>
                <Typography variant={'h6'} component={'h6'}>
                  Shipping method
                </Typography>
                <div className={'mt-4'}>
                  <form.Field
                    name={'shippingMethodId'}
                    children={(field) => (
                      <ShippingMethodsFormControl
                        onChange={async (value) => {
                          await handleShippingMethodChange(value ?? '');
                          field.handleChange(value ?? '');
                        }}
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
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Button
                type={'submit'}
                variant={'contained'}
                className={'w-full'}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Go to payment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={!!error} message={error} autoHideDuration={6000} />
    </form>
  );
}
