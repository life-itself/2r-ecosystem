import type { InteractiveProfile } from './interactive';

const PINNED_PROFILE = { collection: 'pip', id: 'life-itself' };

export function compareDirectoryProfiles(
  a: InteractiveProfile,
  b: InteractiveProfile,
  sort: string,
): number {
  const aPinned = isPinnedProfile(a);
  const bPinned = isPinnedProfile(b);

  if (aPinned || bPinned) {
    return Number(bPinned) - Number(aPinned);
  }

  if (sort === 'topic') {
    return (a.facetPrimary[0] ?? '').localeCompare(b.facetPrimary[0] ?? '') ||
      a.title.localeCompare(b.title);
  }

  if (sort === 'mapping') {
    return a.collection.localeCompare(b.collection) || a.title.localeCompare(b.title);
  }

  return a.title.localeCompare(b.title);
}

function isPinnedProfile(profile: InteractiveProfile): boolean {
  return profile.collection === PINNED_PROFILE.collection && profile.id === PINNED_PROFILE.id;
}
