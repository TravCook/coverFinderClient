import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CurvedGauge = ({ value, dimensions }) => {
    const svgRef = useRef();
    const markerRef = useRef();

    const { width, height } = dimensions;
    const radius = Math.min(width, height * 2) / 2 - 10;
    const centerX = width / 2;
    const centerY = height;
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear existing content
        const defs = svg.append('defs');

        const gradient = defs.append('linearGradient')
            .attr('id', 'gauge-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', -radius)
            .attr('y1', 0)
            .attr('x2', radius)
            .attr('y2', 0);

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(224, 18, 18, 1)');

        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', 'rgba(235, 228, 23, 1)');

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(53, 232, 37, 1)');


        // Create the arc generator for a semicircle
        const arc = d3.arc()
            .innerRadius(radius - 15)
            .outerRadius(radius)
            .startAngle(-Math.PI)
            .endAngle(Math.PI);

        // Set up the SVG container
        svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Draw the background arc
        svg.append('path')
            .attr('d', arc())
            .attr('fill', 'url(#gauge-gradient)')
            .attr('transform', `translate(${centerX}, ${centerY})`);


        // Calculate marker position (no transition)
        const clamped = Math.max(0, Math.min(1, value));
        const angle = -Math.PI + clamped * Math.PI;
        const x = centerX + Math.cos(angle) * (radius - 7.5);
        const y = centerY + Math.sin(angle) * (radius - 7.5);

        svg.selectAll('circle.marker')
        .data([value])
        .join('circle')
        .attr('class', 'marker')
        .attr('r', 8)
        .attr('fill', 'none')                // Transparent fill
        .attr('stroke', '#121212')           // Black border
        .attr('stroke-width', 3)             // Border thickness
        .attr('cx', x)
        .attr('cy', y);
      
    }, [value, dimensions, width, height]);

    return <svg ref={svgRef} />;
};

export default CurvedGauge;
