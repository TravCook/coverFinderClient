import React from 'react';
import './numberLine.css';

const NumberLine = ({
    min,
    max,
    rangeStart,
    rangeEnd,
    point,
    tickCount = 5,
    pointLabel,
  }) => {
    const clamp = (val) => Math.min(Math.max(val, min), max);
    const totalRange = max - min;
  
    const getPercent = (value) => ((clamp(value) - min) / totalRange) * 100;
  
    const rangeLeft = getPercent(rangeStart);
    const rangeWidth = getPercent(rangeEnd) - rangeLeft;
    const pointPosition = getPercent(point);
  
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const value = min + (i * totalRange) / tickCount;
      return {
        value: Math.round(value * 100) / 100,
        position: getPercent(value),
      };
    });
    return (
      <div className="number-line-container">
        <div className="number-line">
          <div
            className="range-highlight"
            style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%`, backgroundColor: ((point > rangeStart) && (point < rangeEnd ))?  'hsl(121 100% 18.8%)':  'hsl(360 100% 18.8%)'  }}
          />
          <div
            className="point-highlight"
            style={{ left: `${pointPosition}%` }}
          >
            {pointLabel && (
              <div className="point-label">
                {pointLabel}
              </div>
            )}
          </div>
          {ticks.map((tick, index) => (
            <div
              key={index}
              className="tick"
              style={{ left: `${tick.position}%` }}
            >
              <div className="tick-mark" />
              <div className="tick-label">{tick.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default NumberLine;
