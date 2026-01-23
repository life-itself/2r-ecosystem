# Flowershow Cloud Migration Design

## Goal

Convert this repo from a Next.js site to a simple markdown-based site for Flowershow Cloud. Keep only ecosystem content, remove all build infrastructure.

## What to Delete

### Next.js/Build files
- `package.json`, `package-lock.json`
- `next.config.mjs`, `tsconfig.json`
- `tailwind.config.cjs`, `postcss.config.js`
- `next-env.d.ts`, `types.d.ts`

### Config/lint files
- `.eslintrc.json`, `.eslintignore`
- `.prettierrc.json`, `.prettierignore`

### Directories
- `pages/`
- `components/`
- `layouts/`
- `lib/`
- `scripts/`
- `styles/`
- `public/`
- `config/`

### Other content to remove
- `content/about.md`, `content/intro.md`, `content/contact.md`
- `content/course.md`, `content/paper.md`, `content/config.mjs`
- `content/wiki/`
- `content/publications/`
- `content/art/`

## What to Keep and Move

| From | To |
|------|-----|
| `content/ecosystem/*` | repo root |
| `content/assets/` | `assets/` |

## Final Structure

```
/
├── .git/
├── .gitignore
├── LICENSE.md
├── README.md
├── docs/
│   └── PLAN.md
├── assets/                    # moved from content/assets/
├── activitys/
├── activitys.md
├── cohere/
│   ├── index.md               # renamed from Index.md
│   └── profiles/
├── design.md
├── outline.md
├── pip/
│   ├── about.md
│   ├── index.html             # new static HTML page
│   └── profiles/
├── related-efforts.md
├── sensemaking.md
├── state-of-sensemaking-2020.md
├── stubs/
├── templates/
├── topics/
├── topics.md
└── why.md
```

## pip/index.html

Static HTML page with Tailwind styling containing:

1. Hero section - title and intro
2. Introduction text about ecosystem mapping
3. Placeholder for CircularVis visualization
4. Overview text explaining PIP (paradigmatic, integrative, pragmatic)
5. Placeholder for TernaryPlot visualization
6. Placeholder for ProfileSearch directory

## Migration Steps

1. Move `content/ecosystem/*` to repo root
2. Move `content/assets/` to `assets/` at root
3. Rename `cohere/Index.md` to `cohere/index.md`
4. Create `pip/index.html` with text content and placeholders
5. Delete all Next.js files and directories
6. Update `README.md` to reflect new purpose
7. Create `docs/PLAN.md` with TODO for re-adding visualizations
