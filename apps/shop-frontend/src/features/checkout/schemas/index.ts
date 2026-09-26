import { z } from 'zod';
import { m } from '#/paraglide/messages';

export const setOrderShippingAddressInputSchema = z.object({
  city: z.string().trim().min(1),
  company: z.string().optional(),
  countryCode: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  streetLine1: z.string().trim().min(1),
  streetLine2: z.string().optional(),
  needInvoice: z.boolean().default(false),
});

export const setOrderShippingMethodInputSchema = z.object({
  shippingMethodId: z.string(),
});

export const checkoutFormSchema = z
  .object({
    needInvoice: z.boolean(),
    shippingCity: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_city_required() }),
    shippingCompany: z.string().trim(),
    shippingCountryCode: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_country_required() }),
    shippingFullName: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_full_name_required() }),
    shippingPhoneNumber: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_phone_required() }),
    shippingPostalCode: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_postal_code_required() }),
    shippingStreetLine1: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_street_required() }),
    shippingStreetLine2: z.string().trim(),

    billingCity: z.string().trim(),
    billingCompany: z.string().trim(),
    billingCountryCode: z.string().trim(),
    billingFullName: z.string().trim(),
    billingPhoneNumber: z.string().trim(),
    billingPostalCode: z.string().trim(),
    billingStreetLine1: z.string().trim(),
    billingStreetLine2: z.string().trim(),

    shippingMethodId: z
      .string()
      .trim()
      .min(1, { error: () => m.checkout_shipping_method_required() }),
  })
  .superRefine((fields, ctx) => {
    if (fields.needInvoice) {
      if (fields.billingFullName.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_full_name_required(),
          path: ['billingFullName'],
        });
      }
      if (fields.billingCountryCode.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_country_required(),
          path: ['billingCountryCode'],
        });
      }
      if (fields.billingPostalCode.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_postal_code_required(),
          path: ['billingPostalCode'],
        });
      }
      if (fields.billingCity.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_city_required(),
          path: ['billingCity'],
        });
      }
      if (fields.billingStreetLine1.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_street_required(),
          path: ['billingStreetLine1'],
        });
      }
      if (fields.billingPhoneNumber.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: m.checkout_billing_phone_required(),
          path: ['billingPhoneNumber'],
        });
      }
    }
  });
