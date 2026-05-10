import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

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

  const visibleProfiles = useMemo(
    () => searchedProfiles.filter((profile) => matchesFacets(profile, facets)),
    [facets, searchedProfiles],
  );

  const primaryOptions = useMemo(
    () => buildFacetOptions(profiles, 'primary'),
    [profiles],
  );
  const secondaryOptions = useMemo(
    () => buildFacetOptions(profiles, 'secondary'),
    [profiles],
  );

  return (
    <section className="interactive-directory">
      <div className="directory-controls">
        <label className="muted" htmlFor="profile-search">
          Search profiles
        </label>
        <input
          id="profile-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <span className="directory-count">{visibleProfiles.length} shown</span>
      </div>

      <div className="facet-panel">
        <FacetGroup
          label={primaryLabel}
          options={primaryOptions}
          selected={facets.primary}
          onToggle={(value) =>
            setFacets((current) => ({
              ...current,
              primary: toggleValue(current.primary, value),
            }))
          }
        />
        <FacetGroup
          label={secondaryLabel}
          options={secondaryOptions}
          selected={facets.secondary}
          onToggle={(value) =>
            setFacets((current) => ({
              ...current,
              secondary: toggleValue(current.secondary, value),
            }))
          }
        />
      </div>

      <div className="profile-list">
        {visibleProfiles.map((profile) => (
          <a className="profile-card" href={profile.href} key={profile.id}>
            <div className={`profile-card-media ${profile.logo ? 'logo' : ''}`}>
              {profile.logo ? (
                <img src={profile.logo} alt={`${profile.title} logo`} loading="lazy" />
              ) : (
                <span className="muted">No image</span>
              )}
            </div>
            <div className="profile-card-body">
              {profile.facetPrimary[0] && (
                <p className="eyebrow">{profile.facetPrimary[0]}</p>
              )}
              <h2>{profile.title}</h2>
              {profile.location && <p className="muted">{profile.location}</p>}
              {profile.facetSecondary.length > 0 && (
                <ul className="tag-list">
                  {profile.facetSecondary.slice(0, 3).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FacetGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: Array<{ label: string; count: number }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className="facet-group">
      <legend>{label}</legend>
      <div className="facet-options">
        {options.map((option) => (
          <label key={option.label}>
            <input
              type="checkbox"
              checked={selected.includes(option.label)}
              onChange={() => onToggle(option.label)}
            />
            <span>
              {option.label} ({option.count})
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value];
}
