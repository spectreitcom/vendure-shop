import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.SHOP_API_URL ?? 'http://localhost:3000/shop-api',
  documents: ['src/**/*.{ts,tsx,graphql}', '!src/graphql/**'],
  generates: {
    'src/graphql/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: true,
        maybeValue: 'T | null',
        inputMaybeValue: 'T | null | undefined',
        scalars: {
          ID: 'string',
          Money: 'number',
          DateTime: 'string',
          JSON: 'unknown',
          Upload: 'unknown',
        },
        nonOptionalTypename: true,
        skipTypename: false,
        enumsAsTypes: true,
      },
    },
    'src/graphql/generated.ts': {
      plugins: [
        { add: { content: "import * as Types from './schema-types';" } },
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        avoidOptionals: true,
        maybeValue: 'T | null',
        inputMaybeValue: 'T | null | undefined',
        scalars: {
          ID: 'string',
          Money: 'number',
          DateTime: 'string',
          JSON: 'unknown',
          Upload: 'unknown',
        },
        nonOptionalTypename: true,
        skipTypename: false,
        enumsAsTypes: true,
        namespacedImportName: 'Types',
        useTypeImports: true,
      },
    },
  },
};

export default config;
