import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds, valueBetConditionCheck } from '../../../utils/constants';
import MatchupCard from '../../matchupCard/matchupCard';
import { getGameDate, isSameDay } from '../../../utils/helpers/timeHelpers/gameDateHelpers';


const LiveGameCard = ({ gameData }) => {
  const games = useSelector((state) => state.games.games)
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipRoot, setTooltipRoot] = useState(null);
  // const [gameStake, setgameStake] = useState(null);
  const cardRef = useRef(null);
  const bankroll = useSelector((state) => state.user.bankroll)
  const sportsbook = useSelector((state) => state.user.sportsbook);
  const sports = useSelector((state) => state.games.sports);

  if (!gameData) return null;

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


  const isValueBet = valueBetConditionCheck(
    sports,
    gameData,
    sportsbook,
    'h2h',
    gameData.predictedWinner
  );

  const outcome = gameData.bookmakers
    ?.find((b) => b.key === sportsbook)
    ?.markets?.find((m) => m.key === 'h2h')
    ?.outcomes.find(
      (o) =>
        o.name ===
        (gameData.predictedWinner === 'home'
          ? gameData.homeTeamDetails.espnDisplayName
          : gameData.awayTeamDetails.espnDisplayName)
    );

  const predictedWinner = gameData.predictedWinner;



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

  // Group games by day
  const todayGames = games.filter((game) => isSameDay(new Date(), new Date(game.commence_time)))
  let gameStake
  todayGames.map((game) => {

    const bookmaker = game.bookmakers?.find((b) => b.key === "fanduel");
    const market = bookmaker?.markets?.find((m) => m.key === "h2h");
    const outcome = market?.outcomes?.find((o) =>
      o.name ===
      (game.predictedWinner === "home"
        ? game.homeTeamDetails.espnDisplayName
        : game.awayTeamDetails.espnDisplayName)
    );
    if (!outcome) return;

    // let valueBetStakeList = valueBetStakeFinder(todayGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, 'h2h', game.predictedWinner)), bankroll, .25)
    // // console.log(valueBetStakeList)

    // if (valueBetConditionCheck(sports, game, sportsbook, 'h2h', game.predictedWinner)) {
    //   gameStake = valueBetStakeList.find((g) => game.id === g.id).stake
    //   // setgameStake(gameStake)
    // }
  })
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* Live Game Card */}
      <div
        className={`flex flex-col w-64 bg-primary border border-solid rounded-md shadow-sm
          ${isValueBet ? 'border-yellow-400 shadow-yellow-300/20' : 'border-neutral-700'}`}
      >
        {/* Header */}
        <div
          className={`flex justify-center items-center py-1 text-xs uppercase tracking-wide 
            border-b border-solid 
            ${isValueBet ? 'border-yellow-400 text-yellow-300' : 'border-neutral-600 text-gray-300'}`}
        >
          {gameData.timeRemaining || 'In Progress'}
        </div>

        {/* Teams Row */}
        <div className="flex flex-row items-center justify-between px-3 py-2">
          {/* Away Team */}
          <div
            className={`flex flex-col items-center flex-1 
              ${predictedWinner === 'away' ? 'text-yellow-400 font-semibold' : 'text-gray-300'}`}
          >
            <img
              src={gameData.awayTeamDetails?.lightLogo}
              alt={gameData.awayTeam?.name}
              className={`h-10 w-10 object-contain mb-1
                ${predictedWinner === 'away' ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : ''}`}
            />
            <span className="text-xs truncate">{gameData.awayTeam?.abbreviation}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center mx-2">
            <span className="text-xl font-bold text-white">
              {gameData.awayScore} - {gameData.homeScore}
            </span>
            <span className="text-[10px] text-gray-400">
              {gameData.league?.toUpperCase() || ''}
            </span>
          </div>

          {/* Home Team */}
          <div
            className={`flex flex-col items-center flex-1 
              ${predictedWinner === 'home' ? 'text-yellow-400 font-semibold' : 'text-gray-300'}`}
          >
            <img
              src={gameData.homeTeamDetails?.lightLogo}
              alt={gameData.homeTeam?.name}
              className={`h-10 w-10 object-contain mb-1
                ${predictedWinner === 'home' ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : ''}`}
            />
            <span className="text-xs truncate">{gameData.homeTeam?.abbreviation}</span>
          </div>
        </div>

        {/* Value / Prediction Info */}
        {gameStake && <div className="flex flex-col px-3 py-2 border-t border-neutral-700 text-xs">
          {isValueBet ? (
            <div className="flex items-center justify-between text-yellow-300">
              <span className="text-[10px] opacity-75">
                {`Stake: ${outcome ? (gameStake).toFixed(2) : 'N/A'}u`}
              </span>
              <span className="text-[10px] opacity-75">
                {`Expected Profit: ${outcome ? calculateProfitFromUSOdds(outcome.price, gameStake).toFixed(2) : 'N/A'}u`}
              </span>
            </div>
          ) : (
            <div className="text-gray-400 text-center opacity-70">
              No current edge
            </div>
          )}
        </div>}
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

export default LiveGameCard;
