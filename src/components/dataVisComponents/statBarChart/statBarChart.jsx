import React from 'react';
import * as d3 from 'd3';
import { getNumericStat, allStatLabelsShort, allStatLabels, normalizeStat } from '../../../utils/constants';

const StatBarChart = ({ homeStats, awayStats, dimensions, statMap, homeColor, awayColor, handleStatSectionClick }) => {
    const margin = { top: 10, right: 10, bottom: 40, left: 10 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const minBarWidth = 60;
    const formattedData = statMap.map((key) => ({
        key,
        homeValue: statMap.includes('seasonWinLoss') ? normalizeStat(key,getNumericStat(homeStats, key)) : normalizeStat(key, homeStats[key]),
        awayValue: statMap.includes('seasonWinLoss') ? normalizeStat(key,getNumericStat(awayStats, key)) : normalizeStat(key, awayStats[key]),
    }));

    const numBars = formattedData.length;
    const svgWidth = Math.max(dimensions.width, numBars * minBarWidth);
    const xScale = d3
        .scaleBand()
        .domain(formattedData.map((d) => d.key))
        .range([0, svgWidth - margin.left - margin.right])
        .padding(0.15);

    const allValues = formattedData.flatMap((d) => [d.homeValue, d.awayValue]);
    const yMax = d3.max(allValues);
    const yMin = d3.min(allValues)

    const yScale = d3
        .scaleLinear()
        .domain([yMin < 0 ? yMin * 1.15 : 0, yMax * 1.15])
        .range([height, 0]);

    return (
        <div style={{ overflowX: 'scroll', maxWidth: '100%', scrollbarWidth: 'thin' }}>
            <svg width={svgWidth} height={dimensions.height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Bars */}
                {formattedData.map((d) => (
                    <React.Fragment key={d.key}>
                        <rect
                            className="away-bar"
                            id={d.key}
                            x={xScale(d.key)}
                            y={d.awayValue >= 0 ? yScale(d.awayValue) : yScale(0)}
                            width={xScale.bandwidth() / 2}
                            height={Math.abs(yScale(d.awayValue) - yScale(0))}
                            fill={`#${awayColor}`}
                            onClick={handleStatSectionClick}
                        />
                        <rect
                            className="home-bar"
                            id={d.key}
                            x={xScale(d.key) + xScale.bandwidth() / 2}
                            y={d.homeValue >= 0 ? yScale(d.homeValue) : yScale(0)}
                            width={xScale.bandwidth() / 2}
                            height={Math.abs(yScale(d.homeValue) - yScale(0))}
                            fill={`#${homeColor}`}
                            onClick={handleStatSectionClick}
                        />

                    </React.Fragment>
                ))}

                {/* X Axis line */}
                {/* <line x1={0} x2={width} y1={height} y2={height} stroke="black" /> */}

                {/* 0 Axis line */}
                <line x1={0} x2={width} y1={yScale(0)} y2={yScale(0)} stroke="black" />


                {/* X Axis ticks */}
                {formattedData.map((d) => (
                    <g
                        key={d.key}
                        transform={`translate(${xScale(d.key) + xScale.bandwidth() / 2}, ${height})`}
                    >
                        <line y2={6} stroke="black" />
                        <text
                            y={20}
                            textAnchor="middle"
                            fill="black"
                            style={{ fontSize: 12 }}
                        >
                            {allStatLabelsShort[d.key]}
                        </text>
                    </g>
                ))}
            </g>
        </svg>
        </div>
        
    );
};

export default StatBarChart;

