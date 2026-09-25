import { z } from 'zod';

export const addNewAddressFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  company: z.string().trim(),
  streetLine1: z.string().trim().min(1, 'Street line 1 is required'),
  streetLine2: z.string().trim(),
  city: z.string().trim().min(1, 'City is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
  countryCode: z.string().trim().min(1, 'Country code is required'),
  phoneNumber: z.string().trim(),
  defaultShippingAddress: z.boolean(),
  defaultBillingAddress: z.boolean(),
});

export type AddNewAddressFormSchema = z.infer<typeof addNewAddressFormSchema>;

export const updateCustomerAddressInput = addNewAddressFormSchema.extend({
  id: z.string().min(1, 'Address id is required'),
});
