import { describe, expect, it } from 'vitest';
import { env } from '#/env.ts';

describe('shop-frontend environment test', () => {
  it('basic test passes and imports env', () => {
    expect(env).toBeDefined();
  });
});
