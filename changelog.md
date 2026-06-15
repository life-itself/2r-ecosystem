---
title: Changelog
---

# 2026-06-15 - ORA Polycrisis Directory

**TL;DR:** The ORA polycrisis mapping is now live with a landing page at [/ora/](https://ecosystem.secondrenaissance.net/ora/) and a browsable directory at [/ora/directory/](https://ecosystem.secondrenaissance.net/ora/directory/), covering 46 organisations (27 with detailed research, 19 stubs) plus a raw data download. ORA is added to the main nav and the homepage collections.

### What's new

- **Landing page at [/ora/](https://ecosystem.secondrenaissance.net/ora/)** — report summary, PDF link, and CTA to the directory (mirrors the PIP pattern)
- **Directory at [/ora/directory/](https://ecosystem.secondrenaissance.net/ora/directory/)** — searchable, filterable by approach and activity, showing all 46 organisations from the 2023 prototype mapping
- **Individual profile pages at `/ora/[id]/`** — each org gets a dedicated page with metadata (country, region, scale, type, activities, tags) and, for the 27 detailed profiles, full Paradigmatic / Integrated / Pragmatic assessment text
- **Raw data download** — original CSV available at `/assets/ora/polycrisis-directory.csv`
- **Nav and homepage** — ORA added to the top nav and the "Browse the collections" section on the landing page

### Source data

Data migrated from an Airtable/Elements CSV export (`Elements-All Elements & All Fields.csv`). A one-time conversion script (`scripts/generate-ora-profiles.py`) generated the 46 markdown files in `ora/profiles/`. The 27 "ready to share" entries are flagged `featured: true` in frontmatter and shown with a "Detailed profile" badge.

# 2026-06-08 - Ecosystem Site Redesign

**TL;DR:** The site has been redesigned around the Second Renaissance Ecosystem handoff: warmer editorial typography, research-instrument UI chrome, a new landing page, redesigned directory browsing, and shared navigation/footer components across the Astro site.

This brings the live Astro implementation much closer to the `sandbox/design_handoff_2r_ecosystem` prototype while keeping the existing PIP and Cohere+ content collections as the source of truth.

### Design system and global chrome

- Added the handoff theme tokens as a dedicated shared stylesheet with the locked paper mood, Newsreader + IBM Plex Mono type system, terracotta accent, hairline rules, and soft corners
- Rebuilt the base layout to set the required root theme attributes and load the production font pair
- Added shared top bar and footer components with the new Second Renaissance / Ecosystem mark, sticky translucent navigation, active section states, mobile menu, and research-site footer columns

### Landing page

- Rebuilt the homepage around the redesign: editorial hero, PIP framing, mapping collection cards, directory preview, and reading list
- Added a deterministic SVG network figure as a quiet reference plate in the hero
- Homepage counts now come from the real PIP and Cohere+ collections rather than prototype sample data

### Directory experience

- Reworked the shared profile search component into a two-column directory interface with sticky facets, search, sort, result counts, and responsive card grids
- Directory cards now preserve profile imagery using image-backed card backgrounds with a paper gradient overlay, plus logo/monogram fallbacks when images are missing
- Added keyboard `/` search focus and mapping/topic/activity filtering across the existing content data

### Profile and prose pages

- Updated PIP and Cohere+ pages to inherit the new chrome and active navigation states
- Existing profile and markdown prose pages now use the redesigned typography, metadata cards, buttons, and reading styles

### Verification

- Updated styling tests to cover the new design-system split and image-backed directory cards
- Full test suite and Astro build pass locally

# 2026-05-29 - Ecosystem Site Update

**TL;DR:** Big step forward on [ecosystem.secondrenaissance.net](https://ecosystem.secondrenaissance.net) — the PIP mapping report is properly restored with interactive visualisations embedded inline, all report-style pages now render correctly, and the site's scope and structure is clarified.

We also resolved a standing question about where publications should live: everything ecosystem-mapping related stays on the ecosystem site (not split to secondrenaissance.net), which keeps reports, profiles, and visualisations together where they belong.

### PIP Mapping — fully restored

- **Essay at [/pip/](https://ecosystem.secondrenaissance.net/pip/)** — the full PIP research report now has its own page with a proper header (title, description, date, CTAs), the essay body, and both interactive visualisations embedded inline at the right points in the text
- **CircularVis** (organisations by topic) and **TernaryPlot** (organisations by social change approach) now appear in context within the essay, not just on a separate maps page
- **Directory at [/pip/directory/](https://ecosystem.secondrenaissance.net/pip/directory/)** — profile search/listing now has a clean dedicated URL
- **Maps at [/pip/map/](https://ecosystem.secondrenaissance.net/pip/map/)** — standalone viz page still available for full-screen exploration

### Markdown pages system

All root-level markdown files now render as proper prose pages on the site:

- [/related-efforts](https://ecosystem.secondrenaissance.net/related-efforts) — related mapping efforts reference list
- [/sensemaking](https://ecosystem.secondrenaissance.net/sensemaking) — mapping methodology note
- [/state-of-sensemaking-2020](https://ecosystem.secondrenaissance.net/state-of-sensemaking-2020) — 2020 Life Itself ecosystem mapping report (cleaned up, PDF linked)
- [/why](https://ecosystem.secondrenaissance.net/why) — rationale for ecosystem mapping
- [/ora](https://ecosystem.secondrenaissance.net/ora) — stub page for the ORA polycrisis mapping report (more to come)

### `why.md` cross-posted to Life Itself blog

- Published at [lifeitself.org/blog/why-this-ecosystem-mapping-project](https://lifeitself.org/blog/why-this-ecosystem-mapping-project)
- Original 2020 post by Rufus explaining the rationale for ecosystem mapping
- Ecosystem site page links back to the blog post

### Scope decision

Resolved the question of what lives where: the ecosystem site is the **home for all ecosystem mapping research** — reports, profiles, directories, and visualisations all stay together here. secondrenaissance.net links out to this site rather than hosting duplicates. See [design doc](docs/second-renaissance-ecosystem-placement-design-2026-04-14.md) for full reasoning.

### What's next

Tracked in [docs/PLAN.md](docs/PLAN.md):

- **UX/design pass** — spacing, typography, nav, 404 page (high priority)
- **Cohere+ landing page** — needs a proper intro page + recovery of the interactive map from git history
- **ORA** — full report as markdown, org profiles directory, visualisation

# 2025-05-14 - Consolidation Proposal

The original consolidation proposal — situational analysis, complication, hypothesis, and outcome vision — has been moved to its own document: [consolidation-proposal.md](consolidation-proposal.md).
