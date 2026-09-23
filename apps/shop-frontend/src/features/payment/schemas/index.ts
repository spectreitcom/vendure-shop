import { z } from 'zod';

export const addPaymentToOrderInputSchema = z.object({
  method: z.string().min(1),
  metadata: z.json(),
});
