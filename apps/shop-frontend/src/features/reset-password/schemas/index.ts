import { z } from 'zod';
import { m } from '#/paraglide/messages';

export const requestResetPasswordInputSchema = z.object({
  emailAddress: z.email({ error: () => m.common_invalid_email() }),
});

export const resetPasswordInputSchema = z.object({
  token: z.string(),
  password: z.string().min(6, { error: () => m.common_password_min_length() }),
});
