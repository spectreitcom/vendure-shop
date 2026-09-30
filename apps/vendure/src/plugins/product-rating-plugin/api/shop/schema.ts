import { z, ZodError } from "zod";

export const rateProductVariantInputSchema = z.object({
  rating: z.int().positive().min(1).max(5),
});

export type RateProductVariantInput = z.infer<
  typeof rateProductVariantInputSchema
>;

export const isZodError = (error: unknown) => {
  return error instanceof ZodError;
};
