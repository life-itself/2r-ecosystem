---
title: Ecosystem Mapping Consolidation Proposal
description: A proposal to consolidate five years of ecosystem mapping work — PIP, ORA, Cohere+ — into a single, unified, discoverable site at ecosystem.secondrenaissance.net.
date: 2025-05-14
---

# Ecosystem Mapping Consolidation Proposal

*May 2025*

## Situation

Over the past five to six years, we have conducted a series of ecosystem mappings for several major projects resulting in the development of directories of key actors and initiatives:

- **PIP** (Paradigmatic, integrated, pragmatic changemakers) (2020–2021)
- **ORA Polycrisis stakeholders** (Omega Resilience Awards) — with a focus on the Global South
- **Cohere+** — focused on 2R / PIP actors in the EU (EU funded)
- **Second Renaissance map** — did not have such a formal catalog behind it

Each mapping effort consisted of roughly three things:

- A raw catalog of profiles
- An online directory (browsing/searching functionality)
- A report or analytical material (e.g. visualisations)

These mappings exist in various states of publication and visibility. PIP is available on secondrenaissance.net; ORA is unpublished. There is no single coherent landing page where someone can explore all directories.

|                           | Directory                                                         | Report                                      | Notes                                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------- |
| PIP                       | https://secondrenaissance.net/ecosystem/pip#profiles              | https://secondrenaissance.net/ecosystem/pip | Also a source spreadsheet with more items |
| Cohere+                   | https://secondrenaissance.net/ecosystem/cohere                    | (none)                                      | Also a much bigger source spreadsheet     |
| ORA                       | (not existent)                                                    | Analysis written. Not yet published.        |                                           |
| 2R Map                    | https://secondrenaissance.net/map                                 |                                             |                                           |
| State of Sensemaking 2020 | https://secondrenaissance.net/ecosystem/state-of-sensemaking-2020 |                                             |                                           |

### Technical architecture

We have tried two approaches, often in combination:

- **Spreadsheets** — quick to start, hard to evolve
- **Markdown with metadata in git** — richer profiles, editable in [Obsidian](https://obsidian.md) with Dataview, publishable via [Flowershow](https://flowershow.app)

We have come to prefer the latter for richer profiles. But the current setup has the two largest directories nested inside the larger `second-renaissance` repo, and published via an older self-hosted Flowershow instance rather than Flowershow Cloud.

## Complication

- Raw directories/catalogs are not in one consolidated system
- The ORA directory is unpublished — its content is inaccessible
- PIP and Cohere+ are nested inside the larger second-renaissance repo, making them harder to find and update
- We are not using Flowershow Cloud, but an older self-hosted version

Overall this makes it harder for users or collaborators to access and contribute to our ecosystem mapping work.

### Question

How can we consolidate our ecosystem mapping directories into a unified, discoverable, technically coherent site and backend that makes them accessible, maintainable, and representative of the research and sensemaking work they support?

## Hypothesis / Answer

- Create a **dedicated git(hub) repo** containing only the directories and ancillary materials
- **Publish at `ecosystem.secondrenaissance.net`** using an Astro-based site
- The site contains all directories (ORA, Cohere+, PIP) in a clean modular format with a simple landing page linking to each
- Document the markdown-based approach to allow for contribution and as inspiration to others

Publications and analytical outputs can remain on other relevant sites (Second Renaissance, Sensemaking Studio, Research Hub) but are clearly cross-linked.

This will simplify our technical stack, improve visibility, and allow for future enhancements (e.g. a unified meta-directory or searchable index across all mappings).

### Principles

- **Accessibility**: Easy for users to find and navigate directory content
- **Coherence**: Unified user experience across all mappings; reduced backend complexity
- **Maintainability**: Streamlined updates and deployment
- **Modularity**: Each project retains its identity but is discoverable from a common hub
- **Alignment**: Tied in with the broader web presence of Second Renaissance / Life Itself

## Outcome Vision

- A publicly available subdomain (`ecosystem.secondrenaissance.net`) acts as a central directory hub
- Each project (ORA, Cohere+, PIP) has a dedicated landing page and directory
- All current directory content is migrated, structured, and accessible
- Unpublished materials (e.g. ORA) are reviewed and brought online
- Publications and analysis remain hosted elsewhere but are clearly cross-linked

---

*This proposal was implemented over May–June 2026. See the [June 2026 site update](/site-update-june-2026/) for what was actually shipped.*
