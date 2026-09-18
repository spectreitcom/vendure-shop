import type { GetActiveCartQuery } from '#/graphql/generated.ts';

export type ActiveCartLine = NonNullable<
  GetActiveCartQuery['activeOrder']
>['lines'][number];
