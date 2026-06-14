import { existsSync } from 'node:fs';

export type CollectionName = 'pip' | 'cohere' | 'ora';

type ProfileInput = {
  collection: CollectionName;
  id: string;
  data: Record<string, unknown>;
};

export type NormalizedProfile = {
  collection: CollectionName;
  id: string;
  title: string;
  url?: string;
  summary?: string;
  eyebrow?: string;
  tags: string[];
  secondaryTags: string[];
  location?: string;
  logo?: string;
  image?: string;
};

const invalidLinkValues = new Set(['', 'not-found', 'broken link']);

export function normalizeImagePath(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const imageObject = value as Record<string, unknown>;
    return normalizeImagePath(
      imageObject.cached_new ?? imageObject.cached ?? imageObject.url,
    );
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  let path = value.trim();
  if (!path || invalidLinkValues.has(path.toLowerCase())) {
    return undefined;
  }

  const wikiMatch = path.match(/^!?\[\[(.+?)\]\]$/);
  if (wikiMatch) {
    path = wikiMatch[1];
  }

  path = path.split('|')[0]?.trim() ?? '';
  path = path.replace(/^(\.\.\/)+/, '');

  if (path.startsWith('assets/')) {
    return localImagePath(`/${path}`);
  }

  if (path.startsWith('/assets/')) {
    return localImagePath(path);
  }

  if (path.startsWith('/img/')) {
    return localImagePath(`/assets${path}`);
  }

  if (path.startsWith('img/')) {
    return localImagePath(`/assets/${path}`);
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return localImagePath(`/assets/${path}`);
}

export function normalizeTags(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];

  return values
    .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item).trim() : ''))
    .filter((item) => item !== '' && item !== '0');
}

export function getFirst(value: unknown): string | undefined {
  return normalizeTags(value)[0];
}

export function normalizeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const url = value.trim();
  return invalidLinkValues.has(url.toLowerCase()) ? undefined : url;
}

export function normalizeProfile(input: ProfileInput): NormalizedProfile {
  const { collection, data, id } = input;
  const title = getString(data.title) ?? id;

  if (collection === 'pip') {
    return {
      collection,
      id,
      title,
      url: normalizeUrl(data.url),
      summary: getString(data.tagline),
      eyebrow: getString(data.active),
      tags: normalizeTags(data.activity),
      secondaryTags: normalizeTags(data.topic),
      location: getFirst(data.locations ?? data.regions),
      logo: normalizeImagePath(data.logo),
      image: normalizeImagePath(data.image),
    };
  }

  if (collection === 'ora') {
    return {
      collection,
      id,
      title,
      url: normalizeUrl(data.website),
      summary: getString(data.description),
      eyebrow: getString(data.region),
      tags: normalizeTags(data.tags_approach),
      secondaryTags: normalizeTags(data.activities),
      location: getString(data.country) ?? getString(data.city),
    };
  }

  return {
    collection,
    id,
    title,
    url: normalizeUrl(data.url),
    summary: getString(data.description),
    eyebrow: getString(data.territory),
    tags: normalizeTags(data.sectors),
    secondaryTags: normalizeTags(data.activities),
    location: getFirst(data.locations),
    logo: normalizeImagePath(data.logo),
    image: normalizeImagePath(data.image),
  };
}

export function isCuratedPipProfile(data: Record<string, unknown>): boolean {
  return ['Y', 'YY'].includes(String(data.curation_status ?? '').trim());
}

function getString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function localImagePath(path: string): string | undefined {
  const decodedPath = decodeURIComponent(path);

  if (decodedPath.startsWith('/assets/')) {
    return existsSync(decodedPath.replace(/^\//, '')) ? decodedPath : undefined;
  }

  return decodedPath;
}
