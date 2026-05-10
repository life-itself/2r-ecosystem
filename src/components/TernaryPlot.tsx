import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getTernaryPoint, type InteractiveProfile } from '../lib/interactive';

type Props = {
  profiles: InteractiveProfile[];
};

const width = 680;
const height = 520;

export default function TernaryPlot({ profiles }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const plottableProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        if (!profile.socialChange) return false;
        const { systems, inner, cultural } = profile.socialChange;
        return systems > 0 || inner > 0 || cultural > 0;
      }),
    [profiles],
  );
  const topics = useMemo(
    () => [...new Set(plottableProfiles.map((profile) => profile.facetPrimary[0] ?? 'other'))],
    [plottableProfiles],
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = Math.min(width, height) * 0.1;
    const triangleHeight = height - margin * 2;
    const triangleWidth = (triangleHeight * 2) / Math.sqrt(3);
    const left = (width - triangleWidth) / 2;
    const top = margin;
    const vertices = [
      { label: 'Systems Change', x: left, y: top + triangleHeight },
      { label: 'Inner Change', x: left + triangleWidth / 2, y: top },
      { label: 'Cultural Change', x: left + triangleWidth, y: top + triangleHeight },
    ];
    const color = d3.scaleOrdinal<string, string>(topics, d3.schemeTableau10);
    const points = plottableProfiles.map((profile) =>
      getTernaryPoint(profile, width, height),
    );

    svg
      .append('path')
      .attr('d', `M${vertices[0].x},${vertices[0].y}L${vertices[1].x},${vertices[1].y}L${vertices[2].x},${vertices[2].y}Z`)
      .attr('fill', 'none')
      .attr('stroke', '#666058')
      .attr('stroke-width', 1.4);

    svg
      .append('g')
      .selectAll('text')
      .data(vertices)
      .join('text')
      .attr('x', (vertex) => vertex.x)
      .attr('y', (vertex) => vertex.y + (vertex.label === 'Inner Change' ? -18 : 28))
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .attr('fill', '#1e1d1a')
      .text((vertex) => vertex.label);

    const tooltip = d3.select('#ternary-tooltip');

    const groups = svg
      .append('g')
      .selectAll('g')
      .data(points)
      .join('g')
      .attr('transform', (point) => `translate(${point.x},${point.y})`);

    groups
      .append('circle')
      .attr('r', 5)
      .attr('fill', (point) => color(point.colorKey))
      .attr('stroke', '#1e1d1a')
      .attr('stroke-width', 0.8)
      .on('mouseenter focus', (_event, point) => {
        tooltip.style('opacity', '1').html(
          `<strong>${escapeHtml(point.title)}</strong><span>${escapeHtml(point.location ?? point.colorKey)}</span>`,
        );
      })
      .on('mousemove', (event) => {
        const bounds = svgElement.getBoundingClientRect();
        tooltip
          .style('left', `${event.clientX - bounds.left + 14}px`)
          .style('top', `${event.clientY - bounds.top + 14}px`);
      })
      .on('mouseleave blur', () => {
        tooltip.style('opacity', '0');
      });

    groups
      .append('text')
      .attr('class', 'ternary-label')
      .attr('x', 8)
      .attr('y', 4)
      .attr('font-size', 10)
      .attr('fill', '#1e1d1a')
      .attr('opacity', showLabels ? 1 : 0)
      .text((point) => point.title);
  }, [plottableProfiles, showLabels, topics]);

  return (
    <section className="viz-panel">
      <div className="viz-toolbar">
        <label>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(event) => setShowLabels(event.currentTarget.checked)}
          />
          <span>Show labels</span>
        </label>
      </div>
      <div className="viz-stage">
        <svg ref={svgRef} role="img" aria-label="PIP ternary plot" />
        <div id="ternary-tooltip" className="viz-tooltip" />
      </div>
      <ul className="viz-legend">
        {topics.map((topic, index) => (
          <li key={topic}>
            <span style={{ backgroundColor: d3.schemeTableau10[index % 10] }} />
            {topic}
          </li>
        ))}
      </ul>
    </section>
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return entities[character];
  });
}
