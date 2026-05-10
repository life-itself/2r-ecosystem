import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';

import {
  buildPackHierarchy,
  type InteractiveProfile,
  type PackLeaf,
  type PackNode,
} from '../lib/interactive';

type Props = {
  profiles: InteractiveProfile[];
};

const size = 720;

export default function CircularVis({ profiles }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hierarchy = useMemo(() => buildPackHierarchy(profiles), [profiles]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const root = d3
      .hierarchy(hierarchy)
      .sum((node) => ('value' in node && typeof node.value === 'number' ? node.value : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const packedRoot = d3.pack<typeof hierarchy>().size([size, size]).padding(4)(root);

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${size} ${size}`);

    const color = d3
      .scaleSequential([0, root.height || 1], (t) => {
        const yellows = ['#f5f0e6', '#e8dcc2', '#dcc89a', '#c9b070'];
        const idx = Math.floor(t * (yellows.length - 1));
        return yellows[Math.min(idx, yellows.length - 1)];
      });

    const defs = svg.append('defs');

    const node = svg
      .append('g')
      .selectAll('g')
      .data(packedRoot.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => (d.children ? color(d.depth) : '#ffffff'))
      .attr('stroke', '#8f8678')
      .attr('stroke-width', (d) => (d.children ? 1 : 0.6));

    node.append('title').text((d) => {
      if (!d.parent) {
        return 'Social Change';
      }
      if (d.children) {
        return String(d.data.name);
      }
      return getNodeLabel(d.data);
    });

    const leaves = node.filter((d) => !d.children);

    leaves.each(function (d, i) {
      const g = d3.select(this);
      const clipId = `clip-${i}`;

      defs
        .append('clipPath')
        .attr('id', clipId)
        .append('circle')
        .attr('r', d.r);

      if (isPackLeaf(d.data) && d.data.logo) {
        g.append('image')
          .attr('href', d.data.logo)
          .attr('x', -d.r)
          .attr('y', -d.r)
          .attr('width', d.r * 2)
          .attr('height', d.r * 2)
          .attr('clip-path', `url(#${clipId})`)
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .on('error', function () {
            d3.select(this).remove();
            renderInitialsFallback(g, d);
          });
      } else {
        renderInitialsFallback(g, d);
      }

      g.style('cursor', 'pointer').on('click', (_event) => {
        if (isPackLeaf(d.data)) {
          window.location.href = d.data.href;
        }
      });
    });

    svg
      .selectAll('.topic-label')
      .data(packedRoot.descendants().filter((d) => d.children && d.parent))
      .join('text')
      .attr('class', 'topic-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y - d.r - 8)
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('fill', '#1e1d1a')
      .text((d) => toTitleCase(String(d.data.name)))
      .style('pointer-events', 'none');
  }, [hierarchy]);

  return (
    <section className="viz-panel">
      <div className="viz-stage">
        <svg ref={svgRef} role="img" aria-label="PIP circular topic visualization" />
      </div>
    </section>
  );
}

function renderInitialsFallback(g: d3.Selection<SVGGElement, unknown, null, undefined>, d: any) {
  const leafData = d.data as PackLeaf;
  const initials = leafData.title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  g.append('circle')
    .attr('r', d.r)
    .attr('fill', '#ece7dd')
    .attr('stroke', 'none');

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', (d.r / 2).toString())
    .attr('font-weight', '600')
    .attr('fill', '#1e1d1a')
    .text(initials);
}

function getNodeLabel(node: PackNode | PackLeaf): string {
  return isPackLeaf(node) ? node.title : node.name;
}

function isPackLeaf(node: PackNode | PackLeaf): node is PackLeaf {
  return 'href' in node && typeof node.href === 'string';
}

function toTitleCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
