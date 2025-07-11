import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, winrates }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  // Resize observer to track container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  if (!dimensions.width || !dimensions.height) {
    return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
  }

  // Margins and inner chart dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Format and parse data
  const formattedData = data.map(d => ({
    date: new Date(d.date),
    value: d.value,
  }));

  // Scales
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(formattedData, d => d.date))
    .range([0, width]);

  const yScale = winrates
    ? d3.scaleLinear().domain([0, 100]).range([height, 0])
    : d3
        .scaleLinear()
        .domain([
          d3.min(formattedData, d => d.value) * 0.95,
          d3.max(formattedData, d => d.value) * 1.05,
        ])
        .range([height, 0]);

  // Line generator
  const lineGenerator = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  // Build line segments with colors based on rise/fall
  const segments = [];
  for (let i = 1; i < formattedData.length; i++) {
    const segment = [formattedData[i - 1], formattedData[i]];
    const isAbove = (winrates ? 50 : segment[0].value) <= segment[1].value;
    segments.push({ points: segment, color: isAbove ? '#00c853' : '#d50000' });
  }

  // Tooltip handlers
  const handleMouseOver = (event, d) => {
    const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: event.clientX - svgRect.left + 10,
      y: event.clientY - svgRect.top - 30,
      content: winrates
        ? `<strong>${d.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</strong><br/>Winrate: ${d.value.toFixed(2)}%`
        : `<strong>${d.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</strong><br/>Profit (units): ${d.value.toFixed(2)}`,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '300px', position: 'relative' }}
    >
      <svg width={dimensions.width} height={dimensions.height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* X Axis */}
          <g transform={`translate(0,${height})`}>
            {xScale.ticks().map((tickValue, idx) => 
            {
              if(idx%2 !==0)return (
                  <g key={tickValue.toString()} transform={`translate(${xScale(tickValue)},0)`}>
                    <line y2={6} stroke="white" />
                    <text
                      y={20}
                      textAnchor="middle"
                      fill="white"
                      style={{ fontSize: 12 }}
                    >
                      {d3.timeFormat('%m/%d')(tickValue)}
                    </text>
                  </g>
                )
            })}
            <line x1={0} x2={width} y1={0} y2={0} stroke="white" />
          </g>

          {/* Y Axis */}
          <g>
            {yScale.ticks().map((tickValue) => (
              <g key={tickValue} transform={`translate(0,${yScale(tickValue)})`}>
                <line x2={-6} stroke="white" />
                <text
                  x={-10}
                  dy="0.32em"
                  textAnchor="end"
                  fill="white"
                  style={{ fontSize: 12 }}
                >
                  {winrates ? `${tickValue}%` : tickValue.toFixed(2)}
                </text>
              </g>
            ))}
            <line x1={0} x2={0} y1={0} y2={height} stroke="white" />
          </g>

          {/* Line Segments */}
          {segments.map(({ points, color }, i) => (
            <path
              key={i}
              d={lineGenerator(points)}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          ))}

          {/* Data points */}
          {formattedData.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.date)}
              cy={yScale(d.value)}
              r={4}
              fill="#007aff"
              style={{ cursor: 'pointer' }}
              onMouseOver={(e) => handleMouseOver(e, d)}
              onMouseOut={handleMouseOut}
            />
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            padding: '6px 10px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 10,
            color: 'black'
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
        
      )}
    </div>
  );
};

export default LineGraph;
