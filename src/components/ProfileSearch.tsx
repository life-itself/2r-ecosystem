import Fuse from 'fuse.js';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  buildFacetOptions,
  matchesFacets,
  type FacetState,
  type InteractiveProfile,
} from '../lib/interactive';

type Props = {
  profiles: InteractiveProfile[];
  primaryLabel: string;
  secondaryLabel: string;
};

export default function ProfileSearch({
  profiles,
  primaryLabel,
  secondaryLabel,
}: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('az');
  const [collection, setCollection] = useState<string[]>([]);
  const [facets, setFacets] = useState<FacetState>({
    primary: [],
    secondary: [],
  });

  const fuse = useMemo(
    () =>
      new Fuse(profiles, {
        includeScore: true,
        keys: ['title', 'searchText'],
        threshold: 0.35,
      }),
    [profiles],
  );

  const searchedProfiles = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) {
      return profiles;
    }

    return fuse.search(normalized).map((result) => result.item);
  }, [fuse, profiles, query]);

  const visibleProfiles = useMemo(() => {
    const filtered = searchedProfiles.filter((profile) => (
      matchesFacets(profile, facets) &&
      (collection.length === 0 || collection.includes(profile.collection))
    ));
    return [...filtered].sort((a, b) => {
      if (sort === 'topic') {
        return (a.facetPrimary[0] ?? '').localeCompare(b.facetPrimary[0] ?? '') ||
          a.title.localeCompare(b.title);
      }

      if (sort === 'mapping') {
        return a.collection.localeCompare(b.collection) || a.title.localeCompare(b.title);
      }

      return a.title.localeCompare(b.title);
    });
  }, [collection, facets, searchedProfiles, sort]);

  const primaryOptions = useMemo(
    () => buildFacetOptions(profiles, 'primary'),
    [profiles],
  );
  const secondaryOptions = useMemo(
    () => buildFacetOptions(profiles, 'secondary'),
    [profiles],
  );

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      event.preventDefault();
      document.querySelector<HTMLInputElement>('#profile-search')?.focus();
    }

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <section className="dir-layout">
      <aside className="dir-side" aria-label="Directory filters">
        <FacetGroup
          label={primaryLabel}
          groupLabel="primary"
          options={primaryOptions}
          selected={facets.primary}
          onToggle={(value) =>
            setFacets((current) => ({
              ...current,
              primary: toggleSingle(current.primary, value),
            }))
          }
        />
        <FacetGroup
          label={secondaryLabel}
          groupLabel="secondary"
          options={secondaryOptions}
          selected={facets.secondary}
          onToggle={(value) =>
            setFacets((current) => ({
              ...current,
              secondary: toggleSingle(current.secondary, value),
            }))
          }
        />
        <FacetGroup
          label="Mapping"
          groupLabel="mapping"
          options={buildFacetOptionsFromValues(profiles.map((profile) => profile.collection))}
          selected={collection}
          onToggle={(value) => setCollection((current) => toggleSingle(current, value))}
        />
      </aside>

      <div className="dir-main">
        <label className="searchbar" htmlFor="profile-search">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path d="m21 21-4.35-4.35" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="11" cy="11" r="6.5" strokeWidth="1.7" />
          </svg>
          <input
            id="profile-search"
            type="search"
            autoComplete="off"
            placeholder="Search name, place, topic, or activity"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <span className="kbd">/</span>
        </label>

        <div className="dir-bar">
          <span className="ct">{visibleProfiles.length} of {profiles.length} profiles</span>
          <label className="sort">
            Sort
            <select value={sort} onChange={(event) => setSort(event.currentTarget.value)}>
              <option value="az">A-Z</option>
              <option value="topic">By topic</option>
              <option value="mapping">By mapping</option>
            </select>
          </label>
        </div>

        <div className="profile-list dir-page-grid">
          {visibleProfiles.map((profile) => (
            <a
              className={`profile-card org ${profile.image ? 'has-image' : ''}`}
              style={profile.image ? { '--card-image': `url("${profile.image}")` } as CSSProperties : undefined}
              href={profile.href}
              key={profile.id}
            >
              <div className="profile-card-visual" aria-hidden="true">
                {profile.image ? (
                  <img className="profile-card-image" src={profile.image} alt="" loading="lazy" />
                ) : profile.logo ? (
                  <img className="profile-card-fallback-logo" src={profile.logo} alt="" loading="lazy" />
                ) : (
                  <span className="profile-card-monogram">{monogram(profile.title)}</span>
                )}
                {profile.image && (
                  <span className="profile-card-badge">
                    {profile.logo ? (
                      <img src={profile.logo} alt="" loading="lazy" />
                    ) : (
                      monogram(profile.title)
                    )}
                  </span>
                )}
              </div>
              <div className="profile-card-body">
                <p className="eyebrow topic">{profile.facetPrimary[0] ?? ' '}</p>
                <h2>{profile.title}</h2>
                {profile.facetSecondary.length > 0 && (
                  <ul className="tag-list acts">
                    {profile.facetSecondary.slice(0, 3).map((tag) => (
                      <li className="act" key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                {profile.location && <p className="muted loc">{profile.location}</p>}
              </div>
            </a>
          ))}
        </div>

        <p className="directory-empty empty" data-visible={visibleProfiles.length === 0}>
          No profiles match these filters.
        </p>
      </div>
    </section>
  );
}

function FacetGroup({
  label,
  groupLabel,
  options,
  selected,
  onToggle,
}: {
  label: string;
  groupLabel: string;
  options: Array<{ label: string; count: number }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="grp">
      <h5>{label}</h5>
      <div className="facet" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            key={`${groupLabel}-${option.label}`}
            aria-pressed={selected.includes(option.label)}
            onClick={() => onToggle(option.label)}
          >
            <span>{option.label}</span>
            <span className="c">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function toggleSingle(values: string[], value: string): string[] {
  return values.includes(value) ? [] : [value];
}

function buildFacetOptionsFromValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
}

function monogram(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}
