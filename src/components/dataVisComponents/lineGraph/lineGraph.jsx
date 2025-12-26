import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, winrates, secondData, secondLabel }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

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

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Format and parse data
  const formattedData = data.map(d => ({
    date: new Date(d.date),
    value: winrates ? d.winrate : d.profit,
  }));

  const formattedSecondData = secondData
    ? secondData.map(d => ({
      date: new Date(d.date),
      value: winrates ? d.winrate : d.profit,
    }))
    : [];

  // Merge dates for x domain
  const allDates = [
    ...formattedData.map(d => d.date),
    ...formattedSecondData.map(d => d.date),
  ];
  const xDomain = d3.extent(allDates);

  // Scales
  const xScale = d3
    .scaleUtc()
    .domain(xDomain)
    .range([0, width]);

  // Y domain: combine both datasets
  const allValues = [
    ...formattedData.map(d => d.value),
    ...formattedSecondData.map(d => d.value),
  ];
  const yDomain = winrates
    ? [0, 100]
    : [
      d3.min(allValues) * 0.95,
      d3.max(allValues) * 1.05,
    ];

  const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

  // Line generator
  const lineGenerator = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  // Segments for first line
  const segments = [];
  for (let i = 1; i < formattedData.length; i++) {
    const segment = [formattedData[i - 1], formattedData[i]];
    const isAbove = 10 <= segment[1].value;
    segments.push({ points: segment, color: isAbove ? 'green' : 'red' });
  }

  // Segments for second line (single color)
  const secondSegments = [];
  for (let i = 1; i < formattedSecondData.length; i++) {
    const segment = [formattedSecondData[i - 1], formattedSecondData[i]];
    const isAbove = (10 || segment[0].value) <= segment[1].value;
    secondSegments.push({ points: segment, color: 'gold' });
  }

  // Tooltip handlers
  const handleMouseOver = (event, d, label) => {
    const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: event.clientX - svgRect.left + 10,
      y: event.clientY - svgRect.top - 30,
      content: `<strong>${d.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</strong><br/>${label}: ${d.value.toFixed(2)}${winrates ? '%' : ''}`,
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
            {xScale.ticks().map((tickValue, idx) => {
              if (idx % 2 !== 0)
                return (
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
                );
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

          {/* Line Segments for first line */}
          {segments.map(({ points, color }, i) => (
            <path
              key={`main-${i}`}
              d={lineGenerator(points)}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          ))}

          {/* Line Segments for second line */}
          {secondSegments.map(({ points, color }, i) => (
            <path
              key={`second-${i}`}
              d={lineGenerator(points)}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          ))}

          {/* Data points for first line */}
          {formattedData.map((d, i) => {
            const segment = [formattedData[i - 1], formattedData[i]];
            const isAbove = 10 <= segment[1].value;
            return (
              <circle
                key={`main-point-${i}`}
                cx={xScale(d.date)}
                cy={yScale(d.value)}
                r={4}
                fill={isAbove ? 'green' : 'red'}
                style={{ cursor: 'pointer' }}
                onMouseOver={(e) => handleMouseOver(e, d, winrates ? 'Winrate' : 'Profit')}
                onMouseOut={handleMouseOut}
              />
            )
          })}

          {/* Data points for second line */}
          {formattedSecondData.map((d, i) => {
            const segment = [formattedData[i - 1], formattedData[i]];
            const isAbove = (segment[0] ? segment[0].value : 0) <= segment[1].value;
            return (
              <circle
                key={`second-point-${i}`}
                cx={xScale(d.date)}
                cy={yScale(d.value)}
                r={4}
                fill={'gold'}
                style={{ cursor: 'pointer' }}
                onMouseOver={(e) => handleMouseOver(e, d, secondLabel || 'Second')}
                onMouseOut={handleMouseOut}
              />
            )
          })}
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
