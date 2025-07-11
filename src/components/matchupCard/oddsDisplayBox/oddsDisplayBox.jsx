import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck, getColorForIndex } from '../../../utils/constants';

const OddsDisplayBox = ({ gameData, market, total, bestSportsbook, homeAway, value }) => {

  const { sportsbook } = useSelector((state) => state.user);
  const { sports, pastGames } = useSelector((state) => state.games)


  const [indexColor, setIndexColor] = useState(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex);

  useEffect(() => {
    setIndexColor(getColorForIndex(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex)); // Update color when teamIndex changes
  }, [gameData, homeAway]);

  const getOdds = () => {
    const bookmaker = gameData?.bookmakers?.find(b => bestSportsbook ? b.key === bestSportsbook : b.key === sportsbook);
    if (!bookmaker) return <></>;

    const marketData = bookmaker?.markets?.find(m => m.key === market);
    if (!marketData) return <></>;

    const outcome = marketData?.outcomes?.find(out => {
      if (homeAway) {
        return out.name === (homeAway === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName) || out.name === total;
      } else {
        return out.name === (gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName) || out.name === total;
      }

    });
    return outcome ? (outcome.price <= 0 ? outcome.price : `+${outcome.price}`) : 'N/A';
  };
  return (
    <div
      className={`border-[2px] p-0 ${gameData.predictedWinner === homeAway &&
        valueBetConditionCheck(sports, gameData, sportsbook, pastGames) &&
        value !== false
        ? 'shadow-[0_0_8px_2px_rgba(230,196,27,0.75)]'
        : ''
        } text-text`}
      style={{ backgroundColor: indexColor, padding: '.05rem', width: '3.5rem' }} // Tailwind doesn’t support dynamic colors yet
    >
      <div className="m-0 flex flex-col">
        <div className="p-0 text-center font-bold">
          {getOdds()}
        </div>
      </div>
    </div>

  );
};

export default OddsDisplayBox;
