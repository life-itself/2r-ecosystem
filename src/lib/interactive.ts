export type CollectionName = 'pip' | 'cohere';

export type SocialChangeScores = {
  inner: number;
  cultural: number;
  systems: number;
};

export type InteractiveProfile = {
  id: string;
  title: string;
  href: string;
  collection: CollectionName;
  logo?: string;
  image?: string;
  location?: string;
  facetPrimary: string[];
  facetSecondary: string[];
  searchText: string;
  socialChange?: SocialChangeScores;
};

export type FacetState = {
  primary: string[];
  secondary: string[];
};

export type FacetOption = {
  label: string;
  count: number;
};

export type TernaryPoint = {
  id: string;
  title: string;
  href: string;
  x: number;
  y: number;
  colorKey: string;
  location?: string;
};

export type PackNode = {
  name: string;
  children: Array<PackNode | PackLeaf>;
};

export type PackLeaf = {
  name: string;
  title: string;
  href: string;
  logo?: string;
  value: number;
};

export function matchesSearch(profile: InteractiveProfile, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return profile.searchText.toLowerCase().includes(normalized);
}

export function matchesFacets(profile: InteractiveProfile, facets: FacetState): boolean {
  return (
    selectedFacetMatches(profile.facetPrimary, facets.primary) &&
    selectedFacetMatches(profile.facetSecondary, facets.secondary)
  );
}

export function buildFacetOptions(
  profiles: InteractiveProfile[],
  facet: keyof FacetState,
): FacetOption[] {
  const key = facet === 'primary' ? 'facetPrimary' : 'facetSecondary';
  const counts = new Map<string, number>();

  for (const profile of profiles) {
    for (const value of profile[key]) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
}

export function getTernaryPoint(
  profile: InteractiveProfile,
  width: number,
  height: number,
): TernaryPoint {
  if (!profile.socialChange) {
    throw new Error(`Profile ${profile.id} is missing social_change scores`);
  }

  const margin = Math.min(width, height) * 0.1;
  const triangleHeight = height - margin * 2;
  const triangleWidth = (triangleHeight * 2) / Math.sqrt(3);
  const left = (width - triangleWidth) / 2;
  const top = margin;

  const systems = numericScore(profile.socialChange.systems);
  const inner = numericScore(profile.socialChange.inner);
  const cultural = numericScore(profile.socialChange.cultural);
  const total = systems + inner + cultural || 1;

  const vertices = {
    systems: { x: left, y: top + triangleHeight },
    inner: { x: left + triangleWidth / 2, y: top },
    cultural: { x: left + triangleWidth, y: top + triangleHeight },
  };

  return {
    id: profile.id,
    title: profile.title,
    href: profile.href,
    x:
      (systems * vertices.systems.x +
        inner * vertices.inner.x +
        cultural * vertices.cultural.x) /
      total,
    y:
      (systems * vertices.systems.y +
        inner * vertices.inner.y +
        cultural * vertices.cultural.y) /
      total,
    colorKey: profile.facetPrimary[0] ?? 'uncategorized',
    location: profile.location,
  };
}

export function buildPackHierarchy(profiles: InteractiveProfile[]): PackNode {
  const byTopic = new Map<string, PackLeaf[]>();

  for (const profile of profiles) {
    const topics = profile.facetPrimary.length ? profile.facetPrimary : ['uncategorized'];
    for (const topic of topics) {
      const leaves = byTopic.get(topic) ?? [];
      leaves.push({
        name: profile.id,
        title: profile.title,
        href: profile.href,
        logo: profile.logo,
        value: 1,
      });
      byTopic.set(topic, leaves);
    }
  }

  return {
    name: 'Social Change',
    children: [...byTopic.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, children]) => ({
        name,
        children: children.sort((a, b) => a.title.localeCompare(b.title)),
      })),
  };
}

function selectedFacetMatches(values: string[], selected: string[]): boolean {
  if (selected.length === 0) {
    return true;
  }

  return selected.every((value) => values.includes(value));
}

function numericScore(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
