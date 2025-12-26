import { useState, useLayoutEffect, useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import { getColorForIndex } from "../../../../utils/constants";
import MatchupCard from "../../../matchupCard/matchupCard";

const UpcomingGameMini = ({ gameData, timeUntilStart, isValueBet }) => {
  const awayColor = getColorForIndex(gameData.awayTeamScaledIndex);
  const homeColor = getColorForIndex(gameData.homeTeamScaledIndex);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipRoot, setTooltipRoot] = useState(null);
    const cardRef = useRef(null);

  // Grab portal root after mount
  useLayoutEffect(() => {
    let el = document.getElementById('tooltip-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tooltip-root';
      document.body.appendChild(el);
    }
    setTooltipRoot(el);
  }, []);

  // Calculate tooltip position
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // Approximate width of MatchupCard
      const tooltipHeight = 200; // Approximate height of MatchupCard

      let left = rect.right + 10; // Default to right
      let top = rect.top + window.scrollY;

      // Flip left if going off screen
      if (left + tooltipWidth > window.innerWidth) {
        left = rect.left - tooltipWidth - 10;
      }

      // Adjust top if going off bottom
      if (top + tooltipHeight > window.innerHeight + window.scrollY) {
        top = window.innerHeight + window.scrollY - tooltipHeight - 10;
      }

      setTooltipPos({ top, left });
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col min-w-[8rem] bg-primary border border-neutral-700 rounded-md shadow-sm p-2 ${isValueBet ? "border-yellow-400 shadow-yellow-300/20" : ""
        }`}
    >
      {/* Time until start */}
      <div className="flex justify-center mb-1">
        <span className="text-[12px] text-text">
          Starts in {timeUntilStart}
        </span>
      </div>

      {/* Teams Row */}
      <div className="flex items-center justify-center gap-2">
        <img
          src={gameData.awayTeamDetails.lightLogo}
          alt={gameData.awayTeamDetails.espnDisplayName}
          className="h-10 w-10 object-contain border-b-2"
          style={{
            borderBottomColor:
              gameData.predictedWinner === "away" ? awayColor : "transparent",
          }}
        />
        <span className="text-sm text-gray-400">@</span>
        <img
          src={gameData.homeTeamDetails.lightLogo}
          alt={gameData.homeTeamDetails.espnDisplayName}
          className="h-10 w-10 object-contain border-b-2"
          style={{
            borderBottomColor:
              gameData.predictedWinner === "home" ? homeColor : "transparent",
          }}
        />
      </div>

      {/* Predicted Score */}
      <div className="flex justify-around text-sm font-medium border-t border-dashed border-neutral-600 pt-1 text-gray-200">
        <span>{gameData.predictedAwayScore}</span>
        <span>{gameData.predictedHomeScore}</span>
      </div>

      {/* Only render portal if tooltipRoot exists */}
      {isHovered && tooltipRoot &&
        ReactDOM.createPortal(
          <div
            className="absolute z-50 shadow-lg"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
            <MatchupCard gameData={gameData} hover={true} />
          </div>,
          tooltipRoot
        )}
    </div>
  );
};

export default UpcomingGameMini;
