import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('theme styling architecture', () => {
  test('uses a shared global stylesheet from the base layout', () => {
    const layout = read('src/layouts/Base.astro');

    expect(layout).toContain("import '../styles/global.css';");
    expect(layout).not.toContain('<style>');
  });

  test('defines shared Second Renaissance design tokens', () => {
    const css = read('src/styles/global.css');

    expect(css).toContain('--color-background: #f8f4ee;');
    expect(css).toContain('--color-accent: #ad2831;');
    expect(css).toContain('--font-heading:');
    expect(css).toContain('--font-body:');
  });

  test('styles the core catalog surfaces', () => {
    const css = read('src/styles/global.css');

    expect(css).toContain('.landing-hero');
    expect(css).toContain('.profile-card');
    expect(css).toContain('.directory-controls');
    expect(css).toContain('.profile-body');
  });
});
