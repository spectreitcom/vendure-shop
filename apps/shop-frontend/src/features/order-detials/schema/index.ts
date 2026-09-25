import { z } from 'zod';

export const getOrderInputSchema = z.object({
  id: z.string().min(1),
});
