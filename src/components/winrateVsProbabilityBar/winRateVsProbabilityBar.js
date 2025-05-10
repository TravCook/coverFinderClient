import React from 'react';
import './winrateVsProbabilityBar.css';

const clamp = (val) => Math.max(0, Math.min(val, 100));

const WinrateVsProbabilityBar = ({ internalWinrate, impliedProbability }) => {
  const winrate = clamp(internalWinrate);
  const probability = clamp(impliedProbability);

  const isWinrateHigher = winrate > probability;

  return (
    <div className="winrate-container">
      <div className="winrate-bar" style={isWinrateHigher ? { backgroundColor: 'hsl(121 100% 18.8%)' } : { backgroundColor: 'hsl(360 100% 18.8%)' }}      >
        {/* Top half: Internal Winrate */}
        <div
          className="winrate-half top"
          style={{ width: `${winrate}%` }}
        >
          <div className="winrate-label">{winrate.toFixed(2)}%</div>
        </div>

        {/* Bottom half: Implied Probability */}
        <div
          className="winrate-half bottom"
          style={{ width: `${probability}%` }}
        >
          <div className="winrate-label">{probability.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default WinrateVsProbabilityBar;
