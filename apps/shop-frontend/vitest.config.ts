import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'test/**/*.{test,spec}.{ts,tsx}',
    ],
    env: {
      SHOP_API_URL: 'http://localhost:3000/shop-api',
      VITE_SHOP_API_URL: 'http://localhost:3000/shop-api',
    },
  },
});
