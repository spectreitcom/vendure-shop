import { z } from 'zod';

export const setOrderShippingAddressInputSchema = z.object({
  city: z.string(),
  company: z.string().optional(),
  countryCode: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  postalCode: z.string(),
  streetLine1: z.string(),
  streetLine2: z.string().optional(),
  needInvoice: z.boolean().default(false),
});

export const setOrderShippingMethodInputSchema = z.object({
  shippingMethodId: z.string(),
});

export const checkoutFormSchema = z
  .object({
    needInvoice: z.boolean(),
    shippingCity: z.string().trim().min(1),
    shippingCompany: z.string().trim(),
    shippingCountryCode: z.string().trim().min(1),
    shippingFullName: z.string().trim().min(1),
    shippingPhoneNumber: z.string().trim().min(1),
    shippingPostalCode: z.string().trim().min(1),
    shippingStreetLine1: z.string().trim().min(1),
    shippingStreetLine2: z.string().trim(),

    billingCity: z.string().trim(),
    billingCompany: z.string().trim(),
    billingCountryCode: z.string().trim(),
    billingFullName: z.string().trim(),
    billingPhoneNumber: z.string().trim(),
    billingPostalCode: z.string().trim(),
    billingStreetLine1: z.string().trim(),
    billingStreetLine2: z.string().trim(),

    shippingMethodId: z.string().trim().min(1),
  })
  .superRefine((fields, ctx) => {
    if (fields.needInvoice) {
      if (fields.billingFullName.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing full name is required',
          path: ['billingFullName'],
        });
      }
      if (fields.billingCountryCode.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing country code is required',
          path: ['billingCountryCode'],
        });
      }
      if (fields.billingPostalCode.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing postal code is required',
          path: ['billingPostalCode'],
        });
      }
      if (fields.billingCity.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing city is required',
          path: ['billingCity'],
        });
      }
      if (fields.billingStreetLine1.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing street line 1 is required',
          path: ['billingStreetLine1'],
        });
      }
      if (fields.billingPhoneNumber.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Billing phone number is required',
          path: ['billingPhoneNumber'],
        });
      }
    }
  });
