import { describe, expect, test } from 'vitest';

import { compareDirectoryProfiles } from '../lib/directory-sort';
import type { InteractiveProfile } from '../lib/interactive';

function profile(id: string, title: string): InteractiveProfile {
  return {
    id,
    title,
    href: `/pip/${id}/`,
    collection: 'pip',
    facetPrimary: [],
    facetSecondary: [],
    searchText: title,
  };
}

describe('compareDirectoryProfiles', () => {
  test('pins the Life Itself PIP profile before the normal A-Z order', () => {
    const profiles = [
      profile('advaya-initiative', 'Advaya Initiative'),
      profile('life-itself', 'Life Itself'),
      profile('dark-mountain', 'Dark Mountain'),
    ];

    expect([...profiles].sort((a, b) => compareDirectoryProfiles(a, b, 'az'))).toEqual([
      profile('life-itself', 'Life Itself'),
      profile('advaya-initiative', 'Advaya Initiative'),
      profile('dark-mountain', 'Dark Mountain'),
    ]);
  });
});
