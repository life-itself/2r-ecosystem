---
created: 2026-04-14
---

# Second Renaissance Ecosystem Placement Design

## Status

Decisions made. See Decisions section below.

## Decisions

| Question | Decision | Why |
|---|---|---|
| Domain | `ecosystem.secondrenaissance.net` | Own subdomain gives clean separation and independent deploy cadence. |
| Brand | Second Renaissance | Leading brand for this work; nature of project is 2R not Life Itself. |
| Subdomain name | `ecosystem` not `map` | "Map" implies a single artifact. Site covers profiles, directories, multiple mapping efforts — "ecosystem" names the subject matter, not a format. |
| Tech stack | Astro | Searchable directory and interactive viz are first-class in Astro. Flowershow would require hacks for both. Markdown profiles work cleanly in Astro. Astro v4 content layer (`glob` loader) lets content dirs sit at repo root — `pip/`, `cohere/` etc. appear as plain markdown to Obsidian while Astro reads them directly. No forced repo restructure. |
| Scope | Catalog hub | Profiles, searchable directory, interactive viz. Reports and publications (PIP report, State of Sensemaking, etc.) live on main secondrenaissance.net and link out to live viz on ecosystem site. Keeps each site focused with a clean editorial boundary. |
| Consolidated directory | Deferred | One unified directory (PIP + Cohere+ + ORA searchable together) is the long-term goal. Start with separate sections per mapping effort; consolidate once Astro structure is established. |

## Sources Examined

- GitHub issue: `life-itself/community#1210`
- Current sibling repo: `../ecosystem`

## Situation Summary

Over several years, Second Renaissance and related work produced multiple ecosystem mapping efforts such as PIP, Cohere+, ORA, the 2R map, and State of Sensemaking 2020. Each effort tends to involve three layers:

- a raw catalog of profiles
- a browsable public directory
- reports, visualizations, or analytical outputs around that directory

Issue [#1210](https://github.com/life-itself/community/issues/1210) frames the core problem clearly: these materials are spread across different systems, are published unevenly, and do not have a single coherent home where people can discover, maintain, and extend them.

The issue's proposed direction was to consolidate the directory-style work into a dedicated markdown-first repo and publish it at `ecosystem.secondrenaissance.net` using Flowershow Cloud, while leaving reports and publications on the most relevant sites and cross-linking between them.

## What Exists Now

The current `../ecosystem` repo appears to be the partial realization of that proposal:

- It is a dedicated repo for ecosystem content.
- It is structured as a Flowershow-style markdown site.
- It has a landing page in `index.md`.
- It includes `pip/`, `cohere/`, `state-of-sensemaking-2020.md`, shared assets, and some documentation.
- It has FlowerShow-oriented configuration in `config.json`.

At the same time, it is not yet a clean or fully working finished home for the ecosystem work:

- The repo README is minimal and does not explain the broader placement decision.
- `docs/PLAN.md` explicitly notes that major interactive PIP functionality was removed during migration and still needs to be re-added.
- `cohere/README.md` still contains an old dataview query referencing `content/ecosystem/...`, which suggests incomplete migration and Flowershow incompatibility.
- There is no visible ORA section in the repo.
- The issue itself notes that the inventory and site layout work were still incomplete.

## Core Decision We Need To Make

The real question is not whether this work deserves a home. It already has a partial home in `../ecosystem`. The question is where that home should sit in the overall web and repo landscape, and what exactly belongs there.

In particular, we need to decide:

- whether `../ecosystem` should remain the canonical home for directory-style ecosystem work
- whether some or all of this should instead live inside another repo or site
- whether the site should contain only catalogs/directories, or also sensemaking, methodology, reports, and related material
- how strongly this should be branded as a Second Renaissance property versus a broader Life Itself or ecosystem-research asset

## Constraints And Tensions

- The markdown-plus-git approach is preferred for maintainability and richer profiles.
- Flowershow Cloud gives a lightweight publishing path, but the migrated repo is still not fully functioning.
- The ecosystem mappings are related, but not identical in purpose, status, audience, or maturity.
- Some associated outputs fit better as publications than as directory content.
- Consolidation helps discoverability, but too much consolidation may blur project identity.

## Working Interpretation

Right now the system looks like this:

- `../ecosystem` is trying to be the directory hub.
- The original issue argues for a dedicated ecosystem hub.
- The implementation is partial.
- The conceptual boundary of the hub is still unresolved.

So before choosing technical next steps, we need to decide the intended scope of this ecosystem home: is it primarily a catalog hub, a broader research-and-sensemaking hub, or something in between?

## Questions To Resolve

These were the open questions; all now answered in Decisions above.

1. ~~What is the canonical scope of the ecosystem site: directories only, or directories plus analytical/contextual material?~~ → Catalog hub (profiles, viz, search). Reports elsewhere.
2. ~~What should be the canonical repository and site identity for this work?~~ → New Astro repo, published at `ecosystem.secondrenaissance.net`.
3. ~~What content should stay elsewhere and only be linked in?~~ → Reports and publications on secondrenaissance.net; link to live viz on ecosystem site.
4. ~~How much do we optimize for contributor workflow versus public-facing coherence?~~ → Astro with markdown profiles balances both.

## Appendix: Flowershow Alternative

Flowershow was the original choice and the `../ecosystem` repo is partially set up for it. It remains viable if the priority is shipping fast on existing infrastructure. Flowershow supports custom HTML/JS (including iframes for viz embeds) and could handle a searchable directory via custom components. The tradeoff: these features work against the grain of the tool, creating maintenance friction as interactive features evolve. Astro is recommended unless timeline pressure makes completing the Flowershow migration more practical.
