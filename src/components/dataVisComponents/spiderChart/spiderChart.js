import React, { useMemo } from 'react';
import * as d3 from 'd3';

const SpiderChart = ({ datasets, dimensions, colors = [] }) => {
  const { width, height } = dimensions || { width: 0, height: 0 };
  const levels = 5;
  const labelData = datasets[0] || [];
  const radius = Math.min(width / 2, height / 2) - 40;
  const angleSlice = (2 * Math.PI) / (labelData.length || 1);
  const maxValue = d3.max(datasets.flat(), d => d.value) || 100;
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  // Precompute grid lines (levels)
  const gridLines = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const levelFactor = radius * ((level + 1) / levels);
      return labelData.map((d, i) => ({
        x1: levelFactor * Math.cos(angleSlice * i - Math.PI / 2),
        y1: levelFactor * Math.sin(angleSlice * i - Math.PI / 2),
        x2: levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2),
        y2: levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2),
      }));
    });
  }, [levels, labelData, radius, angleSlice]);

  // Axis lines and labels
  const axes = useMemo(() => {
    return labelData.map((d, i) => {
      const x2 = rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
      const y2 = rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
      const labelX = rScale(maxValue + 6) * Math.cos(angleSlice * i - Math.PI / 2);
      const labelY = rScale(maxValue + 2) * Math.sin(angleSlice * i - Math.PI / 2);
      return { axis: d.axis, x2, y2, labelX, labelY };
    });
  }, [labelData, rScale, maxValue, angleSlice]);

  // Radar paths for datasets
  const radarPaths = useMemo(() => {
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    return datasets.map((dataSet, i) => ({
      path: radarLine(dataSet),
      color: colors[i] || `rgba(0, 128, 255, ${0.3 + 0.2 * i})`,
      stroke: colors[i] || 'blue',
    }));
  }, [datasets, colors, rScale, angleSlice]);

  if (!width || !height) return null;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {/* Draw grid lines */}
        {gridLines.map((levelLines, idx) => (
          <g key={idx}>
            {levelLines.map(({ x1, y1, x2, y2 }, i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#CDCDCD"
                strokeWidth={1}
              />
            ))}
          </g>
        ))}

        {/* Draw axis lines and labels */}
        {axes.map(({ axis, x2, y2, labelX, labelY }, i) => (
          <g key={i} className="axis">
            <line
              x1={0}
              y1={0}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth={2}
            />
            <text
              x={labelX}
              y={labelY}
              dy="0.35em"
              fontSize={12}
              textAnchor="middle"
            >
              {axis}
            </text>
          </g>
        ))}

        {/* Draw radar dataset polygons */}
        {radarPaths.map(({ path, color, stroke }, i) => (
          <path
            key={i}
            d={path}
            fill={color}
            stroke={stroke}
            strokeWidth={2}
            fillOpacity={0.5}
          />
        ))}
      </g>
    </svg>
  );
};

export default SpiderChart;
