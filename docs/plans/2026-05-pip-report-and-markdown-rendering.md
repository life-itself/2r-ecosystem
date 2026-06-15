---
created: 2026-05-28
status: done
---

# Plan: PIP Report Page, Markdown Rendering, and Directory URL

## Goal

Make `pip/index.md` the canonical PIP report/essay page on the site, with visualizations embedded inline. Move the profile directory to a clean `/pip/directory/` URL. Establish a systematic, reusable way to render markdown content files as Astro pages.

## Background

After the Astro migration, `pip/index.md` is orphaned — Astro serves `src/pages/pip/index.astro` (the profile directory) at `/pip/` and ignores the markdown file. The visualizations live at `/pip/map/` as a standalone page. The original PIP page was a rich essay with embedded viz, a hero section, and a link to the directory — we want to restore that structure.

See also: `docs/second-renaissance-ecosystem-placement-design-2026-04-14.md` — the decision to keep reports on the ecosystem site, not move them to secondrenaissance.net.

---

## Task 1: Systematic markdown rendering

**Problem:** No mechanism exists to render root-level markdown files (reports, context pages) as Astro pages. Currently only profile collections (`pip/profiles/`, `cohere/profiles/`) are wired into the content layer. Pages like `pip/index.md`, `sensemaking.md`, `related-efforts.md`, `state-of-sensemaking-2020.md` are invisible to the site.

**Approach:**

Add a `pages` content collection in `src/content.config.ts` using a `glob` loader targeting root-level markdown. Then create a dynamic Astro route `src/pages/[...slug].astro` that renders these as prose pages using a dedicated `Prose` layout.

```ts
// src/content.config.ts addition
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '.', ignore: ['pip/profiles/**', 'cohere/profiles/**', 'node_modules/**', 'docs/**'] }),
});
```

The `Prose` layout wraps `Base.astro` and adds:
- Constrained reading width (~720px)
- Article typography (larger body, good heading rhythm)
- Optional frontmatter fields: `title`, `description`, `published`, `collection` (for breadcrumb)

This gives a single, maintainable path for any markdown file to become a page. No per-file Astro pages needed.

**Files to create/edit:**
- `src/content.config.ts` — add `pages` collection
- `src/layouts/Prose.astro` — new prose layout extending `Base.astro`
- `src/pages/[...slug].astro` — dynamic catch-all route rendering `pages` collection entries

**Caveats:**
- The glob must exclude `pip/profiles/` and `cohere/profiles/` to avoid collision with existing collections
- `pip/index.md` needs special handling (see Task 3) — it should render at `/pip/` but that route is currently taken by `src/pages/pip/index.astro`. Resolution: move the directory to `/pip/directory/` (Task 2), then free `/pip/` for the essay.

---

## Task 2: Move PIP directory to `/pip/directory/`

**Problem:** `/pip/` currently serves the profile directory (from `src/pages/pip/index.astro`). We want `/pip/` for the essay. The directory needs a new home.

**Decision on URL:** `/pip/directory/` — clear, descriptive, parallel to future `/cohere/directory/`.

**Changes:**
- Rename `src/pages/pip/index.astro` → `src/pages/pip/directory.astro`
- Update internal links: nav in `Base.astro`, the back-link on `src/pages/pip/[id].astro`, and the home page `src/pages/index.astro`
- Update the "Browse PIP" CTA on the homepage to point to `/pip/directory/`
- `src/pages/pip/map.astro` gains a back-link to `/pip/directory/` (currently points to `/pip/`)

No content changes — just route rename and link updates.

---

## Task 3: PIP essay page at `/pip/`

**Problem:** `pip/index.md` has the full PIP report narrative but is never rendered. It also contains Flowershow-era artifacts (a `base` query block for the directory, viz placeholder callouts) that need replacing.

### 3a: Clean up `pip/index.md`

Remove/replace Flowershow artifacts:
- The `base` query block at the bottom (directory embed) → replace with a prose link to `/pip/directory/`
- The `> [!note] CircularVis Visualization` callout → replace with the actual `<CircularVis>` component embed (see 3b)
- The `> [!note] TernaryPlot Visualization` callout → replace with the actual `<TernaryPlot>` component embed (see 3b)
- The `syntaxMode: mdx` frontmatter flag → remove (was Flowershow-specific)

### 3b: Embed visualizations inline in the essay

The two visualizations currently only exist on `/pip/map/`. They should also appear inline in the essay at the relevant points:

- **TernaryPlot** — appears after the "Visual Map of Approaches to Social Change" section heading (currently line ~76 in `pip/index.md`)
- **CircularVis** — appears after the "Visual Map of Topics in the Ecosystem" section heading (currently line ~28)

Because `pip/index.md` will be rendered via the dynamic `[...slug].astro` route, and the viz components require React (`client:load`), the essay page needs to be an `.mdx` file or the route needs to inject the components around the markdown body.

**Recommended approach:** Keep `pip/index.md` as plain markdown (easier to edit in Obsidian). In `src/pages/[...slug].astro` (or a dedicated `src/pages/pip/index.astro`), detect that this is the PIP report and inject the viz components at the right points — or, simpler: create a dedicated `src/pages/pip/index.astro` that:
1. Renders the markdown body from `pip/index.md` via `getEntry('pages', 'pip/index')`
2. Splits the rendered HTML at known section headings and inserts the React viz components between sections

Actually the cleanest approach: **convert `pip/index.md` to `pip/index.mdx`** and import the components directly. This is the standard Astro pattern. Obsidian ignores the `.mdx` extension gracefully (renders as markdown). The dynamic catch-all route handles `.mdx` naturally if the glob includes it.

**Changes:**
- Rename `pip/index.md` → `pip/index.mdx`
- Add imports at top of file: `CircularVis`, `TernaryPlot`, `ProfileLoader` (a thin wrapper that fetches profiles and passes to the viz)
- Replace placeholder callouts with component invocations
- Replace the `base` query block with: `<a href="/pip/directory/">Browse the full directory →</a>`

### 3c: Hero section

The essay page at `/pip/` should have a strong hero before the essay body begins:

```
[Hero area]
  Title: Mapping an Emerging Ecosystem
  Subtitle: Paradigmatic, Integrative, Pragmatic
  Short standfirst (1–2 sentences from the intro)
  
  [Action links]
    Browse Directory →    /pip/directory/
    View Visual Maps →    /pip/map/
  
  [Published/updated date from frontmatter]

[Essay body begins]
  Introduction...
  [CircularVis embedded inline]
  ...
  [TernaryPlot embedded inline]
  ...
  [Directory CTA at bottom]
```

This mirrors what the original Flowershow site had. The `/pip/map/` standalone page remains for users who want full-screen viz without the essay context.

---

## Task 4: Nav update

Add "PIP" nav link to point to `/pip/` (essay), and add a secondary "Directory" or "Profiles" link pointing to `/pip/directory/`. Or: keep nav pointing to `/pip/` (essay) and let the hero CTAs do the navigation work. Decide during implementation.

---

## Sequence

1. **Task 2** first — frees `/pip/` route without breaking anything
2. **Task 1** — establish markdown rendering infrastructure
3. **Task 3** — pip essay page (depends on 1 and 2)
4. **Task 4** — nav cleanup (can be done alongside 3)

Tasks 2 and 1 are independent of each other and can be done in parallel.

---

## Out of Scope (for this plan)

- `sensemaking.md`, `related-efforts.md`, `state-of-sensemaking-2020.md` — will render as prose pages via Task 1 infrastructure once it's in place, but no special treatment needed
- `why.md` migration to lifeitself.org blog — separate task, no code changes here
- Cohere+ equivalent restructure — follow-on work once PIP pattern is established
