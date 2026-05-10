import { describe, expect, test } from 'vitest';

import {
  buildFacetOptions,
  buildPackHierarchy,
  getTernaryPoint,
  matchesFacets,
  matchesSearch,
  type InteractiveProfile,
} from './interactive';

const profiles: InteractiveProfile[] = [
  {
    id: 'life-itself',
    title: 'Life Itself',
    href: '/pip/life-itself/',
    collection: 'pip',
    logo: '/img/life-itself-logo_syl7ai.svg',
    location: 'Bergerac, FR',
    facetPrimary: ['development', 'community'],
    facetSecondary: ['spaces', 'research'],
    searchText: 'Life Itself Bergerac development community spaces research',
    socialChange: { inner: 0.4, cultural: 0.4, systems: 0.2 },
  },
  {
    id: 'dark-matter-labs',
    title: 'Dark Matter Labs',
    href: '/pip/dark-matter-labs/',
    collection: 'pip',
    location: 'London, GB',
    facetPrimary: ['governance'],
    facetSecondary: ['research'],
    searchText: 'Dark Matter Labs London governance research',
    socialChange: { inner: 0.1, cultural: 0.2, systems: 0.7 },
  },
];

describe('interactive profile helpers', () => {
  test('matches search text case-insensitively', () => {
    expect(matchesSearch(profiles[0], 'bergerac')).toBe(true);
    expect(matchesSearch(profiles[0], 'missing')).toBe(false);
  });

  test('matches selected facets across primary and secondary groups', () => {
    expect(
      matchesFacets(profiles[0], {
        primary: ['development'],
        secondary: ['spaces'],
      }),
    ).toBe(true);

    expect(
      matchesFacets(profiles[0], {
        primary: ['governance'],
        secondary: [],
      }),
    ).toBe(false);
  });

  test('builds sorted facet options with counts', () => {
    expect(buildFacetOptions(profiles, 'primary')).toEqual([
      { label: 'community', count: 1 },
      { label: 'development', count: 1 },
      { label: 'governance', count: 1 },
    ]);
  });

  test('computes ternary coordinates inside an equilateral chart', () => {
    const point = getTernaryPoint(profiles[0], 600, 460);

    expect(point.x).toBeGreaterThan(0);
    expect(point.x).toBeLessThan(600);
    expect(point.y).toBeGreaterThan(0);
    expect(point.y).toBeLessThan(460);
  });

  test('builds circle-pack hierarchy from primary facets', () => {
    const hierarchy = buildPackHierarchy(profiles);

    expect(hierarchy.name).toBe('Social Change');
    expect(hierarchy.children.map((child) => child.name)).toEqual([
      'community',
      'development',
      'governance',
    ]);
    const firstChild = hierarchy.children[0];
    if (!('children' in firstChild)) {
      throw new Error('Expected first hierarchy child to be a group');
    }

    const firstLeaf = firstChild.children[0];
    if (!('title' in firstLeaf)) {
      throw new Error('Expected first hierarchy grandchild to be a profile leaf');
    }

    expect(firstLeaf.title).toBe('Life Itself');
  });
});
