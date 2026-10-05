import { initialize } from 'unleash-client';
import { env } from '#/env.ts';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const unleash = initialize({
  url: env.UNLEASH_URL,
  appName: env.UNLEASH_APP_NAME,
  customHeaders: {
    Authorization: env.UNLEASH_API_TOKEN,
  },
});

const checkFeatureFlagInputSchema = z.object({
  flagName: z.string().min(1),
  context: z.object({}).optional(),
});

export const checkFeatureFlag = createServerFn({ method: 'GET' })
  .validator(checkFeatureFlagInputSchema)
  .handler(async ({ data: inputData }) => {
    const isEnabled = unleash.isEnabled(inputData.flagName, inputData.context);
    return { isEnabled };
  });
