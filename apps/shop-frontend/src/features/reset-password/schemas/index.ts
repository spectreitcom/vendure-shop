import { z } from 'zod';

export const requestResetPasswordInputSchema = z.object({
  emailAddress: z.email(),
});

export const resetPasswordInputSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});
