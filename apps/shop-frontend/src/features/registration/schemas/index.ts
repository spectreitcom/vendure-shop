import { z } from 'zod';

export const registerCustomerAccountInputSchema = z.object({
  emailAddress: z.email(),
  password: z.string().min(6),
});
