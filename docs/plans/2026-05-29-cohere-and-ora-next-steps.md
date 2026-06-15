---
created: 2026-05-29
status: done
---

# Cohere+ and ORA: Next Steps

## Item 1: Cohere+ Landing Page and Map

**Status: DONE** (2026-06)

- ✅ Cohere+ landing page live at `/cohere/`
- ✅ Profiles directory at `/cohere/directory/`

Remaining: Cohere+ interactive map not yet recovered/embedded (see git history notes below if revisiting).

<details>
<summary>Map recovery notes</summary>

There was an interactive Cohere+ ecosystem map that previously lived in this repo (likely at `cohere/map` or similar). It was removed/lost at some point during migrations.

```bash
git log --all --oneline -- cohere/map
git log --all --oneline -- cohere/
# Then restore with:
git show <commit>:cohere/map/index.html  # or whatever the file was
```

Once found: assess whether it can be embedded as-is or needs porting to a React component (like CircularVis/TernaryPlot).
</details>

---

## Item 2: ORA / Polycrisis Mapping Report Page

### Source Material

- **Live page:** https://research.lifeitself.org/publications/polycrisis-mapping-report
- **Report:** Available as PDF via Google Drive (linked from that page)
- **Authors:** Catherine Tran and Rufus Pollock (2023)

### Report Summary

*A Boundary Makes a Map: Reflections from building a prototype directory of actors responding to the polycrisis*

The report documents the creation of a prototype directory mapping ~90 organizations (25 with detailed research) addressing polycrisis issues, primarily in the global south. Key challenge: limited consensus on what "polycrisis response" means. Methodology used two criteria: intersystemic analysis + intersystemic action (paradigmatic change affecting multiple systems).

### Phases

**Phase 1 — Landing page: DONE (2026-06)**
- ✅ `ora/index.md` live at `/ora/`

**Phase 2 — Full report as markdown: tracked as issue**
- → [#9](https://github.com/life-itself/2r-ecosystem/issues/9) — low priority
- Export Google Doc → `ora/report.md`, renders at `/ora/report/`

**Phase 3 — ORA profiles directory: DONE (2026-06)**
- ✅ `ora/profiles/` populated, live at `/ora/directory/`

**Phase 4 — Visualization: WONTFIX**
- Not planned.
