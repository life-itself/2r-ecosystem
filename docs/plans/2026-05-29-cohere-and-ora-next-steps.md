---
created: 2026-05-29
status: draft
---

# Cohere+ and ORA: Next Steps

## Item 1: Cohere+ Landing Page and Map

### Goal

Give Cohere+ a proper landing page at `/cohere/` (parallel to PIP at `/pip/`) with:
- Hero explaining what Cohere+ was (project title, description, partners, dates)
- Embedded interactive map
- CTA to browse the directory at `/cohere/directory/`

### The Map

There was an interactive Cohere+ ecosystem map that previously lived in this repo (likely at `cohere/map` or similar). It was removed/lost at some point during migrations.

**TODO:** Dig through git history to find it:

```bash
git log --all --oneline -- cohere/map
git log --all --oneline -- cohere/
# Then restore with:
git show <commit>:cohere/map/index.html  # or whatever the file was
```

Once found: assess whether it can be embedded as-is or needs porting to a React component (like CircularVis/TernaryPlot).

### Landing Page Content

Source material:
- `cohere/README.md` — objectives and project description
- https://research.lifeitself.org/projects/cohere-plus-ecosystem-mapping — full project summary

Key facts to include:
- Full title: *Cohere+: Cohering the Ecosystem of Paradigmatic Social Change Organisations in Europe*
- Duration: 2022–2025
- Partners: Life Itself, Emerge, Ekskäret Foundation, Institute for Integral Studies (Freiburg), The Hague Center for Global Governance Innovation and Emergence
- Funded by EU Erasmus+
- Publications: *Emergent Power* (2024), *Communities of Coherence* (2024)

### Implementation

Parallel to what was done for PIP:
1. Move current `/cohere/` directory listing to `/cohere/directory/`
2. Create `cohere/index.md` as landing page with frontmatter (title, description, links)
3. Embed map once recovered
4. Create `src/pages/cohere/index.astro` if map needs component injection (like PIP)

---

## Item 2: ORA / Polycrisis Mapping Report Page

### Goal

Create a report page at `/ora/` (or `/ora/report/`) based on the 2023 polycrisis mapping report. This is the ORA mapping effort — a prototype directory of actors responding to the polycrisis, primarily in the global south.

### Source Material

- **Live page:** https://research.lifeitself.org/publications/polycrisis-mapping-report
- **Report:** Available as PDF via Google Drive (linked from that page)
- **Authors:** Catherine Tran and Rufus Pollock (2023)

### Report Summary

*A Boundary Makes a Map: Reflections from building a prototype directory of actors responding to the polycrisis*

The report documents the creation of a prototype directory mapping ~90 organizations (25 with detailed research) addressing polycrisis issues, primarily in the global south. Key challenge: limited consensus on what "polycrisis response" means. Methodology used two criteria: intersystemic analysis + intersystemic action (paradigmatic change affecting multiple systems).

### Full scope (all phases)

This is a significant body of work — not just one page. Full picture:

**Phase 1 — Landing page (quick, do now):**
- Create `ora/index.md` with intro content from research.lifeitself.org, frontmatter (title, description, authors, links to PDF)
- Add `ora/*.{md,mdx}` to pages glob in `src/content.config.ts`
- Renders at `/ora/` via existing catch-all

**Phase 2 — Full report as markdown:**
- Export/copy the Google Doc report into `ora/report.md` (or inline in `ora/index.md`)
- Currently the report is only accessible as a PDF download — making it readable on the page is a significant improvement for discoverability and linking
- Requires: export from Google Doc → clean markdown, review/edit for quality
- Renders at `/ora/report/` (or inlined at `/ora/`)

**Phase 3 — ORA profiles directory:**
- The prototype directory identified ~90 organizations (25 with detailed research)
- Migrate org data into `ora/profiles/` as markdown files (parallel to `pip/profiles/`, `cohere/profiles/`)
- Add `ora` content collection to `src/content.config.ts`
- Build directory page at `/ora/directory/`
- This is the biggest piece — requires the raw org data (currently unclear where it lives; may be in a spreadsheet or Airtable)

**Phase 4 — Visualization:**
- ORA has its own mapping/visualization work (different from PIP CircularVis/TernaryPlot)
- Needs investigation: what viz existed, where source lives, how to restore/embed

### Immediate steps (Phase 1 only)

1. Create `ora/` directory and `ora/index.md`
2. Add `ora/*.{md,mdx}` to pages glob
3. Verify renders at `/ora/`
