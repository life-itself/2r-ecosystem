import {
  type CollectionName,
  type InteractiveProfile,
  type SocialChangeScores,
} from './interactive';
import { getFirst, normalizeProfile, normalizeTags } from './profile';

export type InteractiveProfileInput = {
  collection: CollectionName;
  id: string;
  data: Record<string, unknown>;
};

export function toInteractiveProfile(input: InteractiveProfileInput): InteractiveProfile {
  const normalized = normalizeProfile(input);
  const primary =
    input.collection === 'pip'
      ? normalizeTags(input.data.topic)
      : normalizeTags(input.data.sectors);
  const secondary =
    input.collection === 'pip'
      ? normalizeTags(input.data.activity)
      : normalizeTags(input.data.activities);
  const location = normalized.location ?? getFirst(input.data.regions);

  return {
    id: input.id,
    title: normalized.title,
    href: `/${input.collection}/${input.id}/`,
    collection: input.collection,
    logo: normalized.logo,
    image: normalized.image,
    location,
    facetPrimary: primary,
    facetSecondary: secondary,
    searchText: [
      normalized.title,
      normalized.summary,
      normalized.eyebrow,
      location,
      ...primary,
      ...secondary,
    ]
      .filter(Boolean)
      .join(' '),
    socialChange: normalizeSocialChange(input.data.social_change),
  };
}

function normalizeSocialChange(value: unknown): SocialChangeScores | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const scores = value as Record<string, unknown>;
  const inner = Number(scores.inner);
  const cultural = Number(scores.cultural);
  const systems = Number(scores.systems);

  if (![inner, cultural, systems].every(Number.isFinite)) {
    return undefined;
  }

  return { inner, cultural, systems };
}
