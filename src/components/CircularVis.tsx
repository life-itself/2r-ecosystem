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
      .scaleSequential([0, root.height || 1], d3.interpolateYlOrBr)
      .interpolator(d3.interpolateYlOrBr);

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

    const leaves = node.filter((d) => !d.children && d.r > 10);

    leaves
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => Math.max(8, Math.min(12, d.r / 4)))
      .attr('fill', '#1e1d1a')
      .selectAll('tspan')
      .data((d) => splitLabel(getNodeLabel(d.data), d.r))
      .join('tspan')
      .attr('x', 0)
      .attr('dy', (_d, i) => (i === 0 ? 0 : '1.1em'))
      .text((line) => line);

    leaves
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        if (isPackLeaf(d.data)) {
          window.location.href = d.data.href;
        }
      });
  }, [hierarchy]);

  return (
    <section className="viz-panel">
      <div className="viz-stage">
        <svg ref={svgRef} role="img" aria-label="PIP circular topic visualization" />
      </div>
    </section>
  );
}

function getNodeLabel(node: PackNode | PackLeaf): string {
  return isPackLeaf(node) ? node.title : node.name;
}

function isPackLeaf(node: PackNode | PackLeaf): node is PackLeaf {
  return 'href' in node && typeof node.href === 'string';
}

function splitLabel(label: string, radius: number): string[] {
  const maxChars = Math.max(8, Math.floor(radius / 3));
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 3);
}
