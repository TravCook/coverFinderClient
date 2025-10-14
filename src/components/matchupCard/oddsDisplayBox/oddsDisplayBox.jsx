import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck, getColorForIndex } from '../../../utils/constants';

const OddsDisplayBox = ({ gameData, market, total, bestSportsbook, homeAway, value }) => {

  const { sportsbook } = useSelector((state) => state.user);
  const { sports, pastGames } = useSelector((state) => state.games)
  const [outcome, setOutcome] = useState()


  const [indexColor, setIndexColor] = useState(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex);
  useEffect(() => {
    setIndexColor(getColorForIndex(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex)); // Update color when teamIndex changes
    const bookmaker = gameData?.bookmakers?.find(b => bestSportsbook ? b.key === bestSportsbook : b.key === sportsbook);

    const marketData = bookmaker?.markets?.find(m => m.key === market);

    const outcome = marketData?.outcomes?.find(out => {
      if (market !== 'totals') {
        return out.name === (homeAway === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName) || out.name === total;
      } else {
        return homeAway === 'away' ? out.name === 'Over' : out.name === 'Under'
      }

    });
    setOutcome(outcome)
  }, [gameData, homeAway]);

  return (
    <div
      className={`border-[2px] p-0 ${((gameData.predictedWinner === homeAway && market === 'h2h') || market !== 'h2h') &&
       valueBetConditionCheck(sports, gameData, sportsbook, market, homeAway) &&
        value !== false
        ? 'shadow-[0_0_8px_2px_rgba(230,196,27,0.75)]'
        : ''
        } text-text`}
      style={{ backgroundColor: market === 'h2h' ? indexColor : null, padding: '.05rem', height: '100%' }} // Tailwind doesn’t support dynamic colors yet
    >
      <div className="m-0 flex flex-col justify-center h-full text-center">
        {outcome?.point && <div className="p-0 text-center ">
          {`${outcome?.name === 'Over' ? 'O' : outcome?.name === 'Under' ? 'U' : ''} ${outcome?.point > 0 && market === 'spreads'? `+${outcome?.point}` : outcome?.point}`}
        </div>}
        {outcome?.price && <div className="p-0 text-center font-bold">
          {outcome?.price > 0 ? `+${outcome.price}` : outcome?.price}
        </div>}
      </div>
    </div>

  );
};

export default OddsDisplayBox;
