// SpiderChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SpiderChart = ({ datasets, dimensions, colors = [] }) => {
    const svgRef = useRef();
    const { width, height } = dimensions || { width: 0, height: 0 };
    const levels = 5;
    const labelData = datasets[0];

    useEffect(() => {
        if (!width || !height) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const radius = Math.min(width / 2, height / 2) - 40;
        const angleSlice = (2 * Math.PI) / labelData.length;
        const maxValue = d3.max(datasets.flat(), d => d.value);
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue || 100]);


        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Draw grid
        for (let level = 0; level < levels; level++) {
            const levelFactor = radius * ((level + 1) / levels);
            g.selectAll(`.levels-${level}`)
                .data(labelData)
                .join('line')
                .attr('x1', (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
                .attr('y1', (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
                .attr('x2', (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
                .attr('y2', (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
                .attr('stroke', '#CDCDCD')
                .attr('stroke-width', '1px');
        }

        const axis = g.selectAll('.axis')
            .data(labelData)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axis.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr('stroke', 'black')
            .attr('stroke-width', '2px');

        axis.append('text')
            .attr('x', (d, i) => rScale(maxValue + 6) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => rScale(maxValue+ 2) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr('dy', '0.35em')
            .style('font-size', '12px')
            .style('text-anchor', 'middle')
            .text(d => d.axis);

        const radarLine = d3.lineRadial()
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveLinearClosed);

        datasets.forEach((dataSet, i) => {
            g.append('path')
                .datum(dataSet)
                .attr('d', radarLine)
                .attr('fill', colors[i] || `rgba(0, 128, 255, ${0.3 + 0.2 * i})`)
                .attr('stroke', colors[i] || 'blue')
                .attr('stroke-width', 2)
                .attr('fill-opacity', 0.5);
        });


    }, [labelData, width, height]);

    return <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />;
};

export default SpiderChart;
