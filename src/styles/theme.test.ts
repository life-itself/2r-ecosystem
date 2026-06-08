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
    const css = read('src/styles/theme.css');

    expect(css).toContain('--paper:    oklch(0.977 0.008 82);');
    expect(css).toContain('--accent:   oklch(0.575 0.122 46);');
    expect(css).toContain('--display:"Newsreader"');
    expect(css).toContain('--mono:"IBM Plex Mono"');
  });

  test('styles the core catalog surfaces', () => {
    const css = `${read('src/styles/theme.css')}\n${read('src/styles/global.css')}`;

    expect(css).toContain('.hero-grid');
    expect(css).toContain('.profile-card');
    expect(css).toContain('.dir-layout');
    expect(css).toContain('.profile-body');
  });

  test('uses profile images as directory card backgrounds', () => {
    const component = read('src/components/ProfileSearch.tsx');
    const css = read('src/styles/global.css');

    expect(component).toContain('--card-image');
    expect(css).toContain('var(--card-image)');
    expect(css).toContain('.profile-card.org.has-image');
  });
});
