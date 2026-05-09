---
created: 2026-04-14
---

# Second Renaissance Ecosystem Placement Design

## Executive Summary

**Situation:** Over several years, 2R produced multiple ecosystem mapping efforts — PIP, Cohere+, ORA, the 2R map, State of Sensemaking 2020 — each with raw profiles, a browsable directory, and interactive visualizations or reports.

**Complication:** These are spread across different systems, published unevenly, with no single coherent home. Interactive features (PIP map) were lost during a partial migration to a Flowershow repo. Reports and directories are mixed together without a clear editorial boundary.

**Question:** Where should this live, how should it be built, and what belongs here versus elsewhere?

**Resolution:** Build a dedicated catalog hub at `ecosystem.secondrenaissance.net` using Astro. Content (profiles, directories, viz) lives here. Reports and publications live on the main secondrenaissance.net site, linking out to live interactive viz on this site.

## Decisions

| Question | Decision | Why |
|---|---|---|
| Domain | `ecosystem.secondrenaissance.net` | Own subdomain gives clean separation and independent deploy cadence. |
| Brand | Second Renaissance | Leading brand for this work; nature of project is 2R not Life Itself. |
| Subdomain name | `ecosystem` not `map` | "Map" implies a single artifact. Site covers profiles, directories, multiple mapping efforts — "ecosystem" names the subject matter, not a format. |
| Tech stack | Astro | Searchable directory and interactive viz are first-class in Astro. Flowershow would require hacks for both. Markdown profiles work cleanly in Astro. Astro v4 content layer (`glob` loader) lets content dirs sit at repo root — `pip/`, `cohere/` etc. appear as plain markdown to Obsidian while Astro reads them directly. No forced repo restructure. |
| Scope | Catalog hub | Profiles, searchable directory, interactive viz. Reports and publications live on main secondrenaissance.net and link out to live viz on this site. Keeps each site focused with a clean editorial boundary. |
| Consolidated directory | Deferred | One unified directory (PIP + Cohere+ + ORA searchable together) is the long-term goal. Start with separate sections per mapping effort; consolidate once Astro structure is established. |

## Plan of Work

### Phase 1: Astro setup

- Initialise Astro project in this repo (or replace Flowershow config)
- Configure content collections pointing at existing root dirs (`pip/`, `cohere/`)
- Basic layout, nav, deploy pipeline to `ecosystem.secondrenaissance.net`

### Phase 2: Move reports to 2R main site

- Identify reports currently in this repo (State of Sensemaking, PIP report, etc.)
- Move to secondrenaissance.net with clean URLs
- Add static preview image + link to live viz on ecosystem site
- Remove duplicates from this repo; add cross-links

### Phase 3: Directory browsing

- Build browsable directory pages for PIP and Cohere+ profiles
- Filtering, tagging, basic search within each directory
- Consistent profile template across both

### Phase 4: Restore visualizations

- Re-implement interactive PIP map (was removed during Flowershow migration)
- Embed in ecosystem site as first-class pages
- Ensure reports on 2R site link to these

---

### Future Work (tracked in original GitHub issue)

These are out of scope for the initial build but are the intended long-term direction:

- **ORA migration** — migrate ORA data and content into this repo
- **Consolidated directory** — unify PIP + Cohere+ + ORA into a single searchable directory
- **Full text search** — across all profiles and content in the site

## Appendix: Context

### Sources Examined

- GitHub issue: `life-itself/community#1210`
- Partial Flowershow repo: this repo pre-Astro migration

### What Exists Now (pre-Astro)

The current repo is a partial realization of the original consolidation proposal:

- Dedicated repo for ecosystem content, structured as a Flowershow markdown site
- Has `pip/`, `cohere/`, `state-of-sensemaking-2020.md`, shared assets, some docs
- Not yet fully working: interactive PIP features removed, `cohere/README.md` has broken dataview queries, no ORA section, incomplete inventory

### Constraints And Tensions

- Markdown-plus-git preferred for maintainability and richer profiles
- Ecosystem mappings are related but differ in purpose, status, audience, maturity
- Consolidation helps discoverability but too much blurs project identity

### Flowershow Alternative

Flowershow was the original choice and this repo was partially set up for it. It remains viable if the priority is shipping fast. Flowershow supports custom HTML/JS (iframes for viz, custom components for search). The tradeoff: these work against the grain of the tool and create maintenance friction as interactive features evolve. Astro is recommended unless timeline pressure is decisive.
