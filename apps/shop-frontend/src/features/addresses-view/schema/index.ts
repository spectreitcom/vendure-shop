import { z } from 'zod';
import { m } from '#/paraglide/messages';

export const addNewAddressFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: () => m.address_form_full_name_required() }),
  company: z.string().trim(),
  streetLine1: z
    .string()
    .trim()
    .min(1, { error: () => m.address_form_street_line1_required() }),
  streetLine2: z.string().trim(),
  city: z
    .string()
    .trim()
    .min(1, { error: () => m.address_form_city_required() }),
  postalCode: z
    .string()
    .trim()
    .min(1, { error: () => m.address_form_postal_code_required() }),
  countryCode: z
    .string()
    .trim()
    .min(1, { error: () => m.address_form_country_required() }),
  phoneNumber: z.string().trim(),
  defaultShippingAddress: z.boolean(),
  defaultBillingAddress: z.boolean(),
});

export type AddNewAddressFormSchema = z.infer<typeof addNewAddressFormSchema>;

export const updateCustomerAddressInput = addNewAddressFormSchema.extend({
  id: z.string().min(1, { error: () => m.address_form_id_required() }),
});
