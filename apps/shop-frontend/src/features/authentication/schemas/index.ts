import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.email(),
  password: z.string(),
});

export const verifyPageSearchSchema = z.object({
  token: z.string(),
});

export const verifyCustomerAccountInputSchema = z.object({
  token: z.string(),
});
