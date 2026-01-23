# Plan

## TODO

### Re-add interactive visualizations to pip/index.html

The following components were removed during migration from Next.js to Flowershow Cloud:

- **CircularVis** - D3 visualization mapping organizations by topic
- **TernaryPlot** - D3 visualization mapping organizations by approach to social change
- **ProfileSearch** - Interactive searchable directory of organizations

These need to be re-implemented, likely as standalone JavaScript or via Flowershow Cloud's component system.

Original component source was in `components/custom/`.
