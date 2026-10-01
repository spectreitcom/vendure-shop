import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import { api } from "@vendure/dashboard";
import { z } from "zod";

const productVariantRatingQuery = graphql(`
  query ProductVariantRating($productVariantId: ID!) {
    productVariantRating(productVariantId: $productVariantId) {
      votes
      average
    }
  }
`);

const productVariantRatingSchema = z.object({
  productVariantRating: z
    .object({
      votes: z.int(),
      average: z.number(),
    })
    .nullable(),
});

type Props = Readonly<{
  productVariantId: string;
}>;

export function ProductVariantRating({ productVariantId }: Props) {
  const { data, error, isPending } = useQuery({
    queryKey: ["productVariantRating", productVariantId],
    queryFn: () => api.query(productVariantRatingQuery, { productVariantId }),
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const { productVariantRating } = productVariantRatingSchema.parse(data);

  return (
    <div>
      <div className={"text-lg"}>Rating</div>
      <ul className={"mt-4"}>
        <li>Total votes: {productVariantRating?.votes ?? 0}</li>
        <li>Rating: {productVariantRating?.average ?? 0}</li>
      </ul>
    </div>
  );
}
