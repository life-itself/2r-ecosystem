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

## Situation

Over the past five to six years, we have conducted a series of ecosystem mappings for several major projects resulting in the development of directories of key actors and initiatives, e.g.:

- **PIP** (Paradigmatic, integrated, pragmatic changemakers) (2020-2021) 
- **ORA Polycrisis stakeholders** (Omega Resilience Awards) with a focus on global south
- **Cohere+** focused on 2R / PIP (paradigmatic, actors in EU (EU Funded)   
- Second Renaissance map (did not have such a formal catalog behind it)

Each mapping effort consisted of roughly three things:

- A raw-ish catalog of profiles
- Some presentation of profiles in an online directory (i.e. some kind of browsing/searching functionality) 
- A report or other analytical material e.g. visualizations

These mappings exist in various states of publication and visibility. Some, such as PIP, are available on https://secondrenaissance.net/ecosystem/pip (in profiles) others, like ORA, are unpublished.

There is no single, coherent landing page where someone can explore all directories in a unified and easily navigable way.

|                           | Directory                                                         | Report                                      | Directory Source                                                                     | Notes                                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| PIP                       | https://secondrenaissance.net/ecosystem/pip#profiles              | https://secondrenaissance.net/ecosystem/pip | https://github.com/life-itself/second-renaissance/tree/main/content/ecosystem/pip    | Also a source spreadsheet with more items |
| Cohere+                   | https://secondrenaissance.net/ecosystem/cohere                    | ?                                           | https://github.com/life-itself/second-renaissance/tree/main/content/ecosystem/cohere | Also a much bigger source spreadsheet     |
| ORA                       | ? (not existent)                                                  | Wrote an analysis. Not yet published.       | ? maybe spreadsheet                                                                  |                                           |
| 2R Map                    | https://secondrenaissance.net/map                                 |                                             |                                                                                      |                                           |
| State of Sensemaking 2020 | https://secondrenaissance.net/ecosystem/state-of-sensemaking-2020 |                                             |                                                                                      |                                           |

### Technical architecture

We have tried two approaches, often in combination starting out with spreadsheets and then moving to markdown:

- Spreadsheets
- Markdown with metadata (in a git repository)

Overall we have come to prefer the latter, at least where richer profiles are needed. Editing can be done using https://obsidian.md with powerful features like dataviews. And for online publishing we can use https://flowershow.app to quickly create a published wiki/knowledgebase combing the directory of profiles with additional content.

## Complication

- These raw directories/catalogs are not in one consolidated system (even separated within that system)
- The ORA directory is unpublished meaning its content is not available 
- The two largest directories *are* stored in markdown in git(hub) but are nested within the larger second renaissance repo https://github.com/life-itself/second-renaissance making them harder to find and update
    - This repo used to power the secondrenaissance.net website but is now only very partially used, mainly to publish these ecosystem directories
- We are not using Flowershow Cloud to publish the directories but an older self-hosted version of Flowershow.

Overall this makes it harder for users or collaborators to access and contribute to our ecosystem mapping directory work.

### **Question**

How can we consolidate our ecosystem mapping directories into a unified, discoverable, technically coherent site and backend that makes them accessible, maintainable, and representative of the research and sensemaking work they support?

## **Hypothesis / Answer**

- Create a dedicated git(hub) repo which just has the directories and ancillary materials (this makes it easier to manage and contribute to)
- Publish using Flowershow Cloud at e.g. `ecosystem.secondrenaissance.net` 
- This site would contain all of the directories (ORA, Cohere+, PIP) in a clean, modular format, with a simple landing page linking to each.
- Document the markdown based approach to allow for contribution and as inspiration to others (often people start out with a spreadsheet ...)

Publications and analytical outputs associated with the mappings could remain on other relevant sites e.g. Second Renaissance or Sensemaking Studio or Research hub but could be clearly linked to/from this new directory hub.

This will simplify our technical stack, improve visibility, and allow for future enhancements or integration (e.g. a unified meta-directory or searchable index).

### **Principles**

- **Accessibility**: Easy for users to find and navigate directory content.
- **Coherence**: Unify the user experience across all mappings and reduce backend complexity.
- **Maintainability**: Use FlowerShow Cloud for streamlined updates and deployment.
- **Modularity**: Each project retains its identity but is discoverable from a common hub.
- **Alignment**: Tie in with the broader web presence of Second Renaissance or Life Itself.

## **Outcome Vision**

- A publicly available subdomain (e.g. `ecosystem.secondrenaissance.net`) acts as a central directory hub.
- Each project (ORA, Cohere+, PIP) has a dedicated page or section.
- All current directory content is migrated, structured, and accessible.
- Unpublished materials (e.g. ORA) are reviewed and brought online.
- Publications and analysis remain hosted elsewhere (e.g. Sensemaking Studio), but are clearly cross-linked.
