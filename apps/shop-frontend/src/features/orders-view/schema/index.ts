import { z } from 'zod';

export const getOrdersInputSchema = z.object({
  take: z.int().positive(),
  page: z.int().positive().default(1),
});

export const ordersViewSearchParamsSchema = z.object({
  page: z.int().positive().default(1),
});
