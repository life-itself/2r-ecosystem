import { describe, expect, test } from 'vitest';

import {
  getFirst,
  normalizeImagePath,
  normalizeProfile,
  normalizeTags,
} from './profile';

describe('normalizeImagePath', () => {
  test('keeps existing root asset paths', () => {
    expect(normalizeImagePath('/assets/life-itself-logo.png')).toBe(
      '/assets/life-itself-logo.png',
    );
  });

  test('converts Obsidian wiki links with relative asset prefixes', () => {
    expect(normalizeImagePath('[[../../../assets/42-acres-logo.png]]')).toBe(
      '/assets/42-acres-logo.png',
    );
  });

  test('converts bare Obsidian image links to assets paths', () => {
    expect(
      normalizeImagePath('[[1000-landscapes-for-1-billion-people-homepage.png]]'),
    ).toBe('/assets/1000-landscapes-for-1-billion-people-homepage.png');
  });

  test('uses cached_new from nested PIP image objects', () => {
    expect(
      normalizeImagePath({ cached_new: '/img/life-itself-logo_syl7ai.svg' }),
    ).toBe('/img/life-itself-logo_syl7ai.svg');
  });

  test('drops missing local image paths', () => {
    expect(normalizeImagePath('/img/does-not-exist.png')).toBeUndefined();
  });
});

describe('field normalization', () => {
  test('normalizes scalar and array tags while ignoring zero placeholders', () => {
    expect(normalizeTags(['media', 'events'])).toEqual(['media', 'events']);
    expect(normalizeTags('Metacrisis')).toEqual(['Metacrisis']);
    expect(normalizeTags(0)).toEqual([]);
  });

  test('returns first non-empty list value', () => {
    expect(getFirst(['', 'Online', 'Berlin'])).toBe('Online');
    expect(getFirst('Bergerac, FR')).toBe('Bergerac, FR');
  });

  test('normalizes PIP profile fields', () => {
    const profile = normalizeProfile({
      collection: 'pip',
      id: 'life-itself',
      data: {
        title: 'Life Itself',
        url: 'https://lifeitself.org',
        tagline: 'Pragmatic utopians',
        activity: ['spaces', 'research'],
        locations: ['Bergerac, FR'],
        logo: { cached_new: '/img/life-itself-logo_syl7ai.svg' },
        image: { cached_new: '/img/repo-homepage.png' },
      },
    });

    expect(profile).toMatchObject({
      id: 'life-itself',
      title: 'Life Itself',
      url: 'https://lifeitself.org',
      summary: 'Pragmatic utopians',
      tags: ['spaces', 'research'],
      location: 'Bergerac, FR',
      logo: '/img/life-itself-logo_syl7ai.svg',
      image: '/img/repo-homepage.png',
    });
  });

  test('normalizes Cohere profile fields', () => {
    const profile = normalizeProfile({
      collection: 'cohere',
      id: '42_Acres',
      data: {
        title: '42 Acres',
        url: 'https://www.42acres.com/',
        territory: 'Inner Wisdom & Healing',
        sectors: ['Health & Wellbeing'],
        locations: ['Frome, UK'],
        logo: '[[../../../assets/42-acres-logo.png]]',
        image: '[[../../../assets/42-acres-homepage.png]]',
      },
    });

    expect(profile).toMatchObject({
      id: '42_Acres',
      title: '42 Acres',
      eyebrow: 'Inner Wisdom & Healing',
      tags: ['Health & Wellbeing'],
      location: 'Frome, UK',
      logo: '/assets/42-acres-logo.png',
      image: '/assets/42-acres-homepage.png',
    });
  });
});
