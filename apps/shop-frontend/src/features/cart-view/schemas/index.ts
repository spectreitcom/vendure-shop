import { z } from 'zod';

export const removeCartLineInputSchema = z.object({
  orderLineId: z.string(),
});

export const adjustCartLineInputSchema = z.object({
  orderLineId: z.string(),
  quantity: z.int().nonnegative(),
});

export const applyOrRemoveCouponCodeInputSchema = z.object({
  couponCode: z.string(),
});
