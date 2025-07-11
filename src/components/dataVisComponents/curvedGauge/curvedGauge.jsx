import React from 'react';
import * as d3 from 'd3';

const CurvedGauge = ({ value, dimensions }) => {
  const { width, height } = dimensions;
  const radius = Math.min(width, height * 2) / 2;
  const centerX = width / 2;
  const centerY = height;

  // Clamp the value between 0 and 1
  const clamped = Math.max(0, Math.min(1, value));
  const angle = -Math.PI + clamped * Math.PI;

  // Calculate marker position
  const markerX = centerX + Math.cos(angle) * (radius - 7.5);
  const markerY = centerY + Math.sin(angle) * (radius - 7.5);

  // Create the arc path using d3.arc() but generate the path string here
  const arcGenerator = d3.arc()
    .innerRadius(radius - 15)
    .outerRadius(radius)
    .startAngle(-Math.PI)
    .endAngle(Math.PI);

  const arcPath = arcGenerator();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    // style={{padding: 0}}
    >
      <defs>
        <linearGradient
          id="gauge-gradient"
          gradientUnits="userSpaceOnUse"
          x1={-radius}
          y1={0}
          x2={radius}
          y2={0}
        >
          <stop offset="0%" stopColor="rgba(224, 18, 18, 1)" />
          <stop offset="50%" stopColor="rgba(235, 228, 23, 1)" />
          <stop offset="100%" stopColor="rgba(53, 232, 37, 1)" />
        </linearGradient>
      </defs>

      {/* Background arc */}
      <path
        d={arcPath}
        fill="url(#gauge-gradient)"
        transform={`translate(${centerX}, ${centerY})`}
      />

      {/* Marker */}
      {/* Needle */}
      <g transform={`translate(${centerX}, ${centerY}) rotate(${(angle * 180) / Math.PI})`}>
        <polygon
          points={`0,-4 0,4  ${(radius)},0`}
          fill="#c69f42"
          stroke='#121212'
        />
      </g>

    </svg>
  );
};

export default CurvedGauge;
