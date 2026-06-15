---
created: 2026-05-28
status: done
---

# Markdown Pages System and PIP Essay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render root-level markdown files as prose pages, move the PIP profile listing to `/pip/directory/`, and restore `pip/index.md` as the PIP essay at `/pip/` — with inline visualizations in a follow-on phase.

**Architecture:** Add a `pages` glob collection in Astro's content layer covering all root-level `.md`/`.mdx` files (excluding profiles, docs, node_modules). A `[...slug].astro` catch-all route renders these via a new `Prose.astro` layout. The layout is frontmatter-driven: title, optional description (lede), optional date/authors, optional CTA links. For `/pip/`, the catch-all handles Phase 1 (plain prose). Phase 2 adds a dedicated `src/pages/pip/index.astro` that overrides the catch-all and injects viz components with pre-loaded profile data.

**Tech Stack:** Astro 5 content layer, `glob` loader, MDX via `@astrojs/mdx` (Phase 2 only), React for viz components, Vitest for unit tests.

---

## Phase 1: Basic system

### Task 1: Add `pages` content collection

**Files:**
- Modify: `src/content.config.ts`

**Step 1: Update content config**

Replace the full file with:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pip = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './pip/profiles' }),
});

const cohere = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './cohere/profiles' }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: '.',
    ignore: [
      'pip/profiles/**',
      'cohere/profiles/**',
      'node_modules/**',
      'docs/**',
      'src/**',
      'public/**',
      'dist/**',
      'scripts/**',
      'templates/**',
      'assets/**',
      'index.md',
    ],
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    created: z.string().optional(),
    authors: z.array(z.string()).optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          primary: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { pip, cohere, pages };
```

Note: `index.md` (root homepage) is excluded — that stays as a static Astro page. `pip/index.md` is NOT excluded — it should appear as slug `pip/index` which we'll strip to `pip` in the route.

**Step 2: Verify types pass**

```bash
npm run check
```

Expected: no type errors related to the new collection (unknown frontmatter fields are fine — Zod ignores extras by default).

**Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add pages glob collection for root markdown files"
```

---

### Task 2: Create `Prose.astro` layout

**Files:**
- Create: `src/layouts/Prose.astro`
- Modify: `src/layouts/Base.astro` (add prose styles)

**Step 1: Create the layout**

```astro
---
// src/layouts/Prose.astro
import Base from './Base.astro';

interface Props {
  title?: string;
  description?: string;
  created?: string;
  authors?: string[];
  links?: Array<{ label: string; href: string; primary?: boolean }>;
}

const { title = 'Untitled', description, created, authors, links } = Astro.props;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
---

<Base title={title} description={description}>
  <article class="prose-article">
    <header class="prose-header">
      <h1 class="prose-title">{title}</h1>
      {description && <p class="prose-lede">{description}</p>}
      {
        (created || (authors && authors.length > 0)) && (
          <p class="prose-meta">
            {authors && authors.length > 0 && <span>{authors.join(', ')}</span>}
            {created && authors && authors.length > 0 && <span class="prose-meta-sep">·</span>}
            {created && <time datetime={created}>{formatDate(created)}</time>}
          </p>
        )
      }
      {
        links && links.length > 0 && (
          <div class="prose-actions">
            {links.map((link) => (
              <a class={`button ${link.primary ? 'primary' : ''}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        )
      }
    </header>
    <div class="prose-body">
      <slot />
    </div>
  </article>
</Base>
```

**Step 2: Add prose styles to `Base.astro`**

Find the closing `</style>` tag in `src/layouts/Base.astro` and add these styles just before it:

```css
      /* Prose layout */
      .prose-article {
        max-width: 780px;
      }

      .prose-header {
        margin-bottom: 48px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--border);
      }

      .prose-title {
        font-size: clamp(2rem, 6vw, 3.5rem);
      }

      .prose-lede {
        margin: 16px 0 0;
        color: var(--muted);
        font-size: 1.2rem;
        max-width: 640px;
      }

      .prose-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .prose-meta-sep {
        color: var(--border);
      }

      .prose-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 24px 0 0;
      }

      .button {
        display: inline-block;
        padding: 10px 20px;
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text);
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        background: var(--surface);
      }

      .button:hover {
        border-color: var(--accent);
        color: var(--accent);
      }

      .button.primary {
        background: var(--text);
        border-color: var(--text);
        color: var(--background);
      }

      .button.primary:hover {
        background: var(--accent-strong);
        border-color: var(--accent-strong);
      }

      .prose-body h2 {
        margin-top: 40px;
        font-size: 1.5rem;
      }

      .prose-body h3 {
        margin-top: 28px;
        font-size: 1.15rem;
      }

      .prose-body p {
        line-height: 1.7;
      }

      .prose-body ul,
      .prose-body ol {
        max-width: 720px;
        line-height: 1.7;
      }

      .prose-body blockquote {
        margin-left: 0;
        padding-left: 18px;
        border-left: 3px solid var(--border);
        color: var(--muted);
      }

      .prose-body pre {
        overflow-x: auto;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--surface);
        font-size: 0.88rem;
      }
```

**Step 3: Verify types**

```bash
npm run check
```

**Step 4: Commit**

```bash
git add src/layouts/Prose.astro src/layouts/Base.astro
git commit -m "feat: add Prose layout for report and content pages"
```

---

### Task 3: Create catch-all route

**Files:**
- Create: `src/pages/[...slug].astro`

**Step 1: Create the route**

```astro
---
import { getCollection, render } from 'astro:content';
import Prose from '../layouts/Prose.astro';

export async function getStaticPaths() {
  const pages = await getCollection('pages');
  return pages.map((page) => {
    // "pip/index" → "pip", "foo/index" → "foo", "about" → "about"
    const slug = page.id.replace(/\/index$/, '') || undefined;
    return {
      params: { slug },
      props: { page },
    };
  });
}

const { page } = Astro.props;
const { Content } = await render(page);
---

<Prose
  title={page.data.title}
  description={page.data.description}
  created={page.data.created}
  authors={page.data.authors}
  links={page.data.links}
>
  <Content />
</Prose>
```

**Step 2: Run dev server and spot-check**

```bash
npm run dev
```

Check these URLs in browser (or curl):

```bash
curl -s http://localhost:4321/related-efforts | grep -c "<h1"
# expected: 1

curl -s http://localhost:4321/sensemaking | grep -c "<h1"
# expected: 1

curl -s http://localhost:4321/pip | grep -c "<h1"
# expected: 1 (pip/index.md renders here temporarily — /pip/ route is still taken by pip/index.astro so this may 404 until Task 4)
```

Note: `/pip/` may still serve the old directory page until Task 4. That's expected.

**Step 3: Check for build errors**

```bash
npm run check
```

**Step 4: Commit**

```bash
git add src/pages/\[...slug\].astro
git commit -m "feat: add catch-all route rendering pages content collection as prose"
```

---

### Task 4: Move PIP directory to `/pip/directory/`

**Files:**
- Rename: `src/pages/pip/index.astro` → `src/pages/pip/directory.astro`
- Modify: `src/layouts/Base.astro` (nav link)
- Modify: `src/pages/index.astro` (homepage CTAs)
- Modify: `src/pages/pip/[id].astro` (back link)
- Modify: `src/pages/pip/map.astro` (back link)

**Step 1: Rename the file**

```bash
mv src/pages/pip/index.astro src/pages/pip/directory.astro
```

**Step 2: Update the page title in `directory.astro`**

Change the `<Base title=` prop from `"PIP Profiles | ..."` to `"PIP Directory | Second Renaissance Ecosystem"`.
Change the `<h1>` from `PIP Profiles` to `PIP Directory`.

**Step 3: Update nav in `Base.astro`**

Find:
```html
<a href="/pip/">PIP</a>
```
Replace with:
```html
<a href="/pip/">PIP</a>
<a href="/pip/directory/">Directory</a>
```

(Or leave nav pointing to `/pip/` as the essay and add directory link only in the hero CTAs — decide on visual check.)

**Step 4: Update homepage `src/pages/index.astro`**

Change:
```html
<a class="button primary" href="/pip/">Browse PIP</a>
```
To:
```html
<a class="button primary" href="/pip/">PIP Mapping</a>
<a class="button" href="/pip/directory/">Browse Directory</a>
```

Also update the card `href` from `/pip/` — leave it pointing to `/pip/` (essay landing).

**Step 5: Update back links**

In `src/pages/pip/[id].astro`, find `href="/pip/"` back links — update to `/pip/directory/`.

In `src/pages/pip/map.astro`, find `href="/pip/"` back link — update to `/pip/directory/`.

Also update the `section-link` in `src/pages/pip/directory.astro` pointing to `/pip/map/` — that stays.

**Step 6: Spot-check**

```bash
npm run dev
```

```bash
curl -o /dev/null -s -w "%{http_code}" http://localhost:4321/pip/directory/
# expected: 200

curl -o /dev/null -s -w "%{http_code}" http://localhost:4321/pip/
# expected: 200 (now serves pip/index.md via catch-all)
```

**Step 7: Commit**

```bash
git add src/pages/pip/
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: move PIP profile listing to /pip/directory/, free /pip/ for essay"
```

---

### Task 5: Clean up `pip/index.md` frontmatter and Flowershow artifacts

**Files:**
- Modify: `pip/index.md`

The file currently has:
- `syntaxMode: mdx` frontmatter (Flowershow-specific) — remove
- A `base` code block at the bottom (Flowershow directory query) — replace with prose link
- Viz placeholder callouts — replace with prose links to `/pip/map/`

**Step 1: Update frontmatter**

Replace the existing frontmatter:
```yaml
---
title: Mapping an Emerging Ecosystem of Paradigmatic, Integrative, Pragmatic Changemakers
syntaxMode: mdx
---
```

With:
```yaml
---
title: Mapping an Emerging Ecosystem
description: Paradigmatic, Integrative, and Pragmatic approaches to social change — a research report mapping over 200 organizations in an emerging field.
created: 2022-01-01
links:
  - label: Browse the Directory
    href: /pip/directory/
    primary: true
  - label: View Visual Maps
    href: /pip/map/
---
```

(Adjust `created` date to match the actual publication date once confirmed.)

**Step 2: Replace viz placeholder callouts**

Find:
```markdown
> [!note] CircularVis Visualization
> Interactive D3 visualization to be re-added
```
Replace with:
```markdown
*[View the interactive topic map →](/pip/map/)*
```

Find:
```markdown
> [!note] TernaryPlot Visualization
> Interactive D3 visualization to be re-added
```
Replace with:
```markdown
*[View the interactive social change map →](/pip/map/)*
```

**Step 3: Replace the `base` query block at the bottom**

Find the entire code block:
````markdown
```base
filters:
  and:
    - file.inFolder("pip/profiles")
...
```
````
Replace with:
```markdown
[Browse the full directory of organizations →](/pip/directory/)
```

**Step 4: Spot-check**

```bash
npm run dev
```

Check `http://localhost:4321/pip/` in browser:
- Essay renders with title "Mapping an Emerging Ecosystem"
- Hero shows description lede and two CTA buttons
- No broken callouts or raw code blocks
- Links to `/pip/directory/` and `/pip/map/` work

**Step 5: Commit**

```bash
git add pip/index.md
git commit -m "fix: restore pip essay at /pip/, clean up Flowershow artifacts"
```

---

## Phase 2: Inline visualizations (deferred)

### Task 6: Embed CircularVis and TernaryPlot inline in the PIP essay

This task can be done separately once Phase 1 is stable.

**Approach:** Create a dedicated `src/pages/pip/index.astro` that overrides the catch-all for `/pip/`. It loads PIP profiles server-side and injects `CircularVis` and `TernaryPlot` as MDX components with profiles pre-bound. Convert `pip/index.md` to `pip/index.mdx`.

**Files:**
- Install: `@astrojs/mdx`
- Modify: `astro.config.mjs`
- Rename: `pip/index.md` → `pip/index.mdx`
- Create: `src/pages/pip/index.astro` (dedicated page overriding catch-all)
- Create: `src/components/pip/PipCircularVis.astro`
- Create: `src/components/pip/PipTernaryPlot.astro`

**Step 1: Install MDX integration**

```bash
npm install @astrojs/mdx
```

Update `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ecosystem.secondrenaissance.net',
  integrations: [react(), mdx()],
});
```

**Step 2: Create self-loading viz wrapper components**

`src/components/pip/PipCircularVis.astro`:
```astro
---
import { getCollection } from 'astro:content';
import CircularVis from '../CircularVis';
import { toInteractiveProfile } from '../../lib/interactive-server';
import { isCuratedPipProfile } from '../../lib/profile';

const profiles = (await getCollection('pip'))
  .filter((p) => isCuratedPipProfile(p.data))
  .map((p) => toInteractiveProfile({ collection: 'pip', id: p.id, data: p.data }));
---

<CircularVis profiles={profiles} client:load />
```

`src/components/pip/PipTernaryPlot.astro`:
```astro
---
import { getCollection } from 'astro:content';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import TernaryPlot from '../TernaryPlot';
import { toInteractiveProfile } from '../../lib/interactive-server';
import { isCuratedPipProfile } from '../../lib/profile';

const profiles = (await getCollection('pip'))
  .filter((p) => isCuratedPipProfile(p.data))
  .map((p) => toInteractiveProfile({ collection: 'pip', id: p.id, data: p.data }));

const topicIds = ['arts', 'community', 'development', 'ecology', 'governance', 'politics', 'spirituality', 'tech', 'wellbeing', 'work'];
const topics = topicIds.map((id) => {
  const content = readFileSync(`pip/topics/${id}.md`, 'utf-8');
  const [, frontmatter, body] = content.split('---');
  const data = parse(frontmatter);
  return { id, title: data.title, description: body.trim() };
}).sort((a, b) => a.title.localeCompare(b.title));
---

<TernaryPlot profiles={profiles} topics={topics} client:load />
```

**Step 3: Create dedicated pip essay page**

`src/pages/pip/index.astro`:
```astro
---
import { getEntry, render } from 'astro:content';
import PipCircularVis from '../../components/pip/PipCircularVis.astro';
import PipTernaryPlot from '../../components/pip/PipTernaryPlot.astro';
import Prose from '../../layouts/Prose.astro';

const entry = await getEntry('pages', 'pip/index');
if (!entry) throw new Error('pip/index not found in pages collection');

const { Content } = await render(entry);
---

<Prose
  title={entry.data.title}
  description={entry.data.description}
  created={entry.data.created}
  links={entry.data.links}
>
  <Content components={{ CircularVis: PipCircularVis, TernaryPlot: PipTernaryPlot }} />
</Prose>
```

**Step 4: Convert `pip/index.md` → `pip/index.mdx`**

```bash
mv pip/index.md pip/index.mdx
```

Replace the prose links added in Task 5 with component tags:

```mdx
<CircularVis />
```
and
```mdx
<TernaryPlot />
```

No import statements needed — the components are injected by the Astro page.

**Step 5: Spot-check**

```bash
npm run dev
```

Check `http://localhost:4321/pip/`:
- CircularVis renders inline after the topics section
- TernaryPlot renders inline after the social change section
- Hero CTAs still present
- `/pip/map/` still works as standalone page

**Step 6: Build check**

```bash
npm run build
```

Expected: no errors.

**Step 7: Commit**

```bash
git add pip/index.mdx src/pages/pip/index.astro src/components/pip/ astro.config.mjs package.json package-lock.json
git commit -m "feat: embed CircularVis and TernaryPlot inline in PIP essay"
```

---

## Verification checklist (end of Phase 1)

Run after completing Tasks 1–5:

```bash
npm run build
```

Expected: builds without errors.

Manual spot-checks:

| URL | Expected |
|---|---|
| `/related-efforts` | Renders with title "Related Efforts" |
| `/sensemaking` | Renders with title "Mapping as Sensemaking" |
| `/pip/` | PIP essay with hero, CTA buttons, full report text |
| `/pip/directory/` | Profile search/directory listing |
| `/pip/map/` | CircularVis + TernaryPlot standalone |
| `/pip/[id]/` | Individual profile page with back link to `/pip/directory/` |
| `/cohere/` | Unaffected |

---

## Follow-on: UX/Design Pass (deferred)

**Status:** Needed — functionality is working but visual quality is poor. Spacing, typography, font sizing, and layout need a proper pass across: Prose layout (report pages), PIP essay hero, directory pages, profile cards, nav.

Do as one dedicated pass rather than incremental tweaks. Areas to cover:
- Prose header: title size, lede sizing, date/meta line, button styles
- Prose body: line height, paragraph spacing, heading rhythm, max-width
- Embedded viz: sizing, spacing around CircularVis and TernaryPlot within essay flow
- Nav: link spacing, active state, mobile
- Overall: colour, spacing tokens, font choices

Track as a separate plan/issue when ready to start.
