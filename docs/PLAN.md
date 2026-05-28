# Ecosystem Site Roadmap

Last updated: 2026-05-29

## Current State

Astro site at `ecosystem.secondrenaissance.net`. Three mapping efforts live here:

| Section | URL | Status |
|---|---|---|
| PIP | `/pip/` | ✅ Essay + inline viz + directory + map |
| Cohere+ | `/cohere/` | ⚠️ Directory only — needs landing page + map |
| ORA | `/ora/` | ⚠️ Stub landing page only — needs report + profiles + viz |

Supporting pages: `/related-efforts`, `/sensemaking`, `/state-of-sensemaking-2020`, `/why` (why.md still needs moving to lifeitself.org blog)

---

## Active Work

### UX / Design Pass

**Priority: High.** The site works but looks poor. Needs a dedicated pass.

Key issues (from TODO):
- **Prose pages**: spacing broken, headings have no margin rhythm, blockquotes barely visible, title repeats (H1 in Prose header + H1 in markdown body on some pages)
- **Homepage hero**: eyebrow ("Ecosystem mapping research") — do we need it? Text is wordy; "paradigmatic" needs a more accessible word (suggestion: "civilizational renewal"); can drop the "pragmatic" line
- **Navigation**: no way to find report/context pages (related-efforts, sensemaking, ORA, etc.) — needs either nav links or a site index
- **404**: navigating to non-existent page silently serves homepage — need a proper 404 page

See plan: `docs/plans/2026-05-28-markdown-pages-and-pip-essay.md` (Follow-on: UX/Design Pass section)

---

### Cohere+ Landing Page + Map Recovery

**Priority: Medium.**

1. Recover the Cohere+ interactive map from git history (`git log --all -- cohere/map`) — assess whether it embeds as-is or needs porting
2. Create `cohere/index.md` landing page (parallel to PIP) with hero, project description, partners, embedded map, CTA to directory
3. Move directory to `/cohere/directory/`

Source material: `docs/plans/2026-05-29-cohere-and-ora-next-steps.md`

---

### ORA: Full Report + Profiles Directory

**Priority: Medium.**

Phased work — see `docs/plans/2026-05-29-cohere-and-ora-next-steps.md`:

- **Phase 2**: Export Google Doc report to markdown → `ora/report.md`
- **Phase 3**: Migrate ~90 org profiles into `ora/profiles/`, build directory at `/ora/directory/`
- **Phase 4**: Restore/rebuild ORA visualization

---

### `why.md` → Life Itself Blog

**Priority: Low.** Move `why.md` to lifeitself.org blog (requires access to that repo). Pre-dates 2R, written from Life Itself perspective.

---

## Future / Deferred

- **Consolidated directory** — unified PIP + Cohere+ + ORA search across all profiles
- **Full text search** — across all profiles and content
- **ORA visualization** — needs investigation (what existed, where source lives)

See: `docs/second-renaissance-ecosystem-placement-design-2026-04-14.md`

---

## Plan Files

| File | Covers |
|---|---|
| `docs/second-renaissance-ecosystem-placement-design-2026-04-14.md` | Overall site architecture and scope decisions |
| `docs/plans/2026-05-28-markdown-pages-and-pip-essay.md` | Markdown rendering system, PIP essay, inline viz — **complete** |
| `docs/plans/2026-05-29-cohere-and-ora-next-steps.md` | Cohere+ landing page + map, ORA report + profiles |

---

## Issues

| # | Title | Status |
|---|---|---|
| [#2](https://github.com/life-itself/2r-ecosystem/issues/2) | Phase 2: content tidy | Nearly done — only `why.md` migration remains |
| [#5](https://github.com/life-itself/2r-ecosystem/issues/5) | Epic: Astro migration | In progress |
| [#6](https://github.com/life-itself/2r-ecosystem/issues/6) | Visual design and styling pass | Not started — matches UX pass above |
