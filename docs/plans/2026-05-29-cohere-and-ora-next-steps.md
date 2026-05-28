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

### Implementation Plan

**Phase 1 (quick):** Copy the page content from research.lifeitself.org into `ora/index.md`, add proper frontmatter, link to the PDF. The page renders via the existing catch-all route — no new infrastructure needed.

**Phase 2 (later):** Inline the full report content from the Google Doc/PDF so it's readable on the page without downloading. This requires either:
- Copying the text manually from the Google Doc
- Or exporting the Doc to markdown

**Steps:**
1. Create `ora/` directory
2. Create `ora/index.md` with frontmatter and content from the research.lifeitself.org page
3. Add frontmatter: `title`, `description`, `created: 2023`, `authors: [Catherine Tran, Rufus Pollock]`, `links` pointing to the PDF
4. Add `ora/*.{md,mdx}` to the pages glob in `src/content.config.ts`
5. Verify renders at `/ora/`

**Future:** ORA profiles directory — migrate ORA org data into `ora/profiles/` (tracked in design doc as future work).
