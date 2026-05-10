import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getTernaryPoint, type InteractiveProfile } from '../lib/interactive';

type Props = {
  profiles: InteractiveProfile[];
  topics?: Array<{ id: string; title: string; description: string }>;
};

const width = 680;
const height = 520;

export default function TernaryPlot({ profiles, topics: topicDescriptions }: Props) {
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
      { label: '100% Systems Change Focus', x: left, y: top + triangleHeight },
      { label: '100% Inner Change Focus', x: left + triangleWidth / 2, y: top },
      { label: '100% Cultural Change Focus', x: left + triangleWidth, y: top + triangleHeight },
    ];
    const color = d3.scaleOrdinal<string, string>(topics, d3.schemeTableau10);
    const points = plottableProfiles.map((profile) => {
      const point = getTernaryPoint(profile, width, height);
      const nearby = plottableProfiles.filter(
        (p) =>
          Math.hypot(
            getTernaryPoint(p, width, height).x - point.x,
            getTernaryPoint(p, width, height).y - point.y,
          ) < 2,
      );

      if (nearby.length > 1) {
        const hash = hashCode(profile.id);
        const angle = ((hash % 360) * Math.PI) / 180;
        const distance = 2.5 + ((hash >> 8) % 15) * 0.3;
        const jitterX = Math.cos(angle) * distance;
        const jitterY = Math.sin(angle) * distance;

        point.x += jitterX;
        point.y += jitterY;
      }

      return point;
    });

    const legendX = width - 140;
    const legendY = 16;

    svg
      .append('path')
      .attr('d', `M${vertices[0].x},${vertices[0].y}L${vertices[1].x},${vertices[1].y}L${vertices[2].x},${vertices[2].y}Z`)
      .attr('fill', 'none')
      .attr('stroke', '#666058')
      .attr('stroke-width', 1.4)
      .attr('opacity', 0.3);

    svg
      .append('g')
      .selectAll('text')
      .data(vertices)
      .join('text')
      .attr('x', (vertex) => vertex.x)
      .attr('y', (vertex, i) => vertex.y + (i === 1 ? -28 : 28))
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .attr('font-family', "'Cormorant Garamond', serif")
      .attr('fill', '#1e1d1a')
      .text((vertex) => vertex.label);

    const dotsGroup = svg.append('g').attr('class', 'dots-group');
    const labelsGroup = svg.append('g').attr('class', 'labels-group');

    const dots = dotsGroup
      .selectAll('g')
      .data(points)
      .join('g')
      .attr('transform', (point) => `translate(${point.x},${point.y})`);

    dots
      .append('circle')
      .attr('r', 3.5)
      .attr('fill', (point) => color(point.colorKey))
      .attr('stroke', '#1e1d1a')
      .attr('stroke-width', 0.6)
      .on('mouseenter focus', function (_, point) {
        labelsGroup
          .selectAll(`.label-${point.id.replace(/[^a-z0-9]/gi, '-')}`)
          .style('opacity', 1);
      })
      .on('mouseleave blur', function (_, point) {
        labelsGroup
          .selectAll(`.label-${point.id.replace(/[^a-z0-9]/gi, '-')}`)
          .style('opacity', showLabels ? 1 : 0);
      });

    points.forEach((point) => {
      const nearby = points.filter((p) => Math.hypot(p.x - point.x, p.y - point.y) < 1.5);
      const indexInNearby = nearby.findIndex((p) => p.id === point.id);
      const offsetY = (indexInNearby - (nearby.length - 1) / 2) * 8;
      const safeId = point.id.replace(/[^a-z0-9]/gi, '-');

      labelsGroup
        .append('text')
        .attr('class', `ternary-label label-${safeId}`)
        .attr('transform', `translate(${point.x},${point.y})`)
        .attr('x', 7)
        .attr('y', offsetY)
        .attr('font-size', 6)
        .attr('font-family', "'Cormorant Garamond', serif")
        .attr('fill', '#1e1d1a')
        .attr('opacity', showLabels ? 1 : 0)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .text(point.title);
    });

    const legendGroup = svg.append('g').attr('class', 'legend-group');

    topics.forEach((topic, index) => {
      const topicData = topicDescriptions?.find((t) => t.id === topic || t.title === topic);
      const y = legendY + index * 15;

      legendGroup
        .append('circle')
        .attr('cx', legendX)
        .attr('cy', y)
        .attr('r', 2.5)
        .attr('fill', d3.schemeTableau10[index % 10]);

      legendGroup
        .append('text')
        .attr('x', legendX + 10)
        .attr('y', y + 2.5)
        .attr('font-size', '10px')
        .attr('font-family', "'Cormorant Garamond', serif")
        .attr('fill', '#1e1d1a')
        .text(topicData?.title || topic);
    });
  }, [plottableProfiles, showLabels, topics, topicDescriptions]);

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
    </section>
  );
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
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
