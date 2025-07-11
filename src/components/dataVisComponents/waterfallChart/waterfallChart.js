import React from 'react';
import { normalizeStat, baseballStatMap, getNumericStat, allStatLabels } from '../../../utils/constants';
import * as d3 from 'd3';

const WaterfallChart = ({ importance, teamStats, dimensions }) => {
  if (!dimensions.width || !dimensions.height) return null;

  // Calculate contributions
  const contributions = baseballStatMap.map((key, i) => {
    let rawValue = getNumericStat(teamStats, key);
    let statValue = normalizeStat(key, rawValue);
    return importance[i].importance * statValue;
  });

  const totalAbs = contributions.reduce((sum, val) => sum + Math.abs(val), 0);
  const percentInfluence = totalAbs === 0 ? contributions.map(() => 0) : contributions.map(c => (c / totalAbs) * 100);

  // Prepare waterfall data with start and end positions
  let cumulative = 0;
  const waterfallData = percentInfluence.map((value, index) => {
    const start = cumulative;
    cumulative += value;
    return {
      index,
      value,
      start,
      end: cumulative,
      positive: value >= 0,
    };
  });

  // Margins
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Scales
  const x = d3.scaleBand()
    .domain(waterfallData.map(d => d.index))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([
      d3.min(waterfallData, d => Math.min(d.start, d.end)),
      d3.max(waterfallData, d => Math.max(d.start, d.end))
    ])
    .nice()
    .range([height, 0]);

  // Axis ticks (optional, can be made React components too)
  const yTicks = y.ticks(5);

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Y axis lines and labels */}
        {yTicks.map((tick, i) => (
          <g key={i} transform={`translate(0,${y(tick)})`}>
            <line x2={width} stroke="#ddd" strokeDasharray="2,2" />
            <text x={-10} dy="0.32em" textAnchor="end" fontSize={10} fill="#666">{tick.toFixed(0)}%</text>
          </g>
        ))}

        {/* X axis labels */}
        {waterfallData.map(d => (
          <text
            key={`x-label-${d.index}`}
            x={x(d.index) + x.bandwidth() / 2}
            y={height + 15}
            textAnchor="middle"
            fontSize={10}
            fill="#666"
          >
            {allStatLabels[baseballStatMap[d.index]]}
          </text>
        ))}

        {/* Bars */}
        {waterfallData.map(d => {
          const barHeight = Math.abs(y(d.start) - y(d.end));
          const barY = y(Math.max(d.start, d.end));
          return (
            <rect
              key={`bar-${d.index}`}
              x={x(d.index)}
              y={barY}
              width={x.bandwidth()}
              height={barHeight}
              fill={d.positive ? "#4CAF50" : "#F44336"}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default WaterfallChart;
