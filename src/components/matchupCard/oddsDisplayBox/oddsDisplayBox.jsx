import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck, getColorForIndex, calculateProfitFromUSOdds } from '../../../utils/constants';

function OddsDisplayBox({
  gameData,
  market,
  total,
  bestSportsbook,
  homeAway,
  value,
}) {
  const { sportsbook } = useSelector((state) => state.user);
  const { sports } = useSelector((state) => state.games);

  const teamIndex =
    homeAway === 'home'
      ? gameData.homeTeamScaledIndex
      : gameData.awayTeamScaledIndex;
  const indexColor = getColorForIndex(teamIndex);

  // 🧠 Compute the correct outcome once
  const outcome = useMemo(() => {
    const bookmaker = gameData?.bookmakers?.find((b) =>
      bestSportsbook ? b.key === bestSportsbook : b.key === sportsbook
    );
    const marketData = bookmaker?.markets?.find((m) => m.key === market);

    return marketData?.outcomes?.find((out) => {
      if (market !== 'totals') {
        return (
          out.name ===
          (homeAway === 'home'
            ? gameData.homeTeamDetails.espnDisplayName
            : gameData.awayTeamDetails.espnDisplayName) ||
          out.name === total
        );
      } else {
        return homeAway === 'away' ? out.name === 'Over' : out.name === 'Under';
      }
    });
  }, [gameData, sportsbook, bestSportsbook, market, homeAway, total]);

  // 🎯 Compute golden border condition
  const showGoldenBorder = useMemo(() => {
    return (
      ((gameData.predictedWinner === homeAway && market === 'h2h') ||
        market !== 'h2h') &&
      valueBetConditionCheck(sports, gameData, sportsbook, market, homeAway) &&
      value !== false
    );
  }, [sports, gameData, sportsbook, market, homeAway, value]);

  return (
    <div
      className={`border-[2px] p-0 text-text ${showGoldenBorder ? 'border-[#e6c41b]' : 'border-white'
        }`}
      style={{
        // backgroundColor: market === 'h2h' ? indexColor : undefined,
        padding: '.05rem',
        height: '100%',
        // boxShadow: showGoldenBorder
        //   ? 'inset 0 0 8px 2px rgba(230,196,27,0.75)'
        //   : undefined,
      }}
    >
      <div className="m-0 flex flex-col justify-center h-full text-center">
        {outcome?.point && (
          <div className="p-0 text-center">
            {`${outcome?.name === 'Over' ? 'O' : outcome?.name === 'Under' ? 'U' : ''} ${outcome?.point > 0 && market === 'spreads'
              ? `+${outcome?.point}`
              : outcome?.point
              }`}
          </div>
        )}
        {outcome?.price && (
          <div className="p-0 text-center font-bold">
            {outcome?.price > 0 ? `+${outcome.price} ${gameData.predictedWinner === homeAway &&valueBetConditionCheck(sports, gameData, sportsbook, market, homeAway) ? `(${gameData.value_score.toFixed(2)})` : ''}` : `${outcome?.price} ${gameData.predictedWinner === homeAway &&valueBetConditionCheck(sports, gameData, sportsbook, market, homeAway) ? `(${gameData.value_score.toFixed(2)})` : ''}`}
          </div>
        )}

      </div>
    </div>
  );
}

export default memo(OddsDisplayBox);
