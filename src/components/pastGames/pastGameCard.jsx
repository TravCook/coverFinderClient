import { useSelector } from "react-redux";
import { useMemo } from "react";
import { calculateProfitFromUSOdds, valueBetConditionCheck } from "../../utils/constants";

const PastGameCard = ({ game, stake, profit, runningProfit, bankroll }) => {
  const { sports } = useSelector((state) => state.games);
   let gameSport = sports.find((sport) => sport.name === game.sport_key)
  const { sportsbook } = useSelector((state) => state.user);

  const bookmaker = game?.bookmakers?.find(b => b.key === 'fanduel');
  const market = bookmaker?.markets?.find(m => m.key === 'h2h');
  const outcome = market?.outcomes?.find(out =>
    out.name === (
      game.predictedWinner === 'home'
        ? game.homeTeamDetails.espnDisplayName
        : game.awayTeamDetails.espnDisplayName
    )
  );

  const bgColor =
    game.predictionCorrect === true
      ? "bg-green-900/50"
      : game.predictionCorrect === false
        ? "bg-red-900/50"
        : "bg-primary";

  const goldBorder = valueBetConditionCheck(sports, game, sportsbook, 'h2h', game.predictedWinner) ? 'border-yellow-500' : 'border-zinc-700';

  return (
    <div
      className={`flex flex-col items-center p-2 rounded-md border text-white shadow-sm ${bgColor} ${goldBorder}`}
    >
      {/* Team Logos & Scores */}
      <div className="flex items-center justify-center gap-2 mb-1">
        {game.value_score && <span>{game.value_score.toFixed(2)}</span>}
        <img src={game.awayTeamDetails.darkLogo} alt={game.awayTeamDetails.espnDisplayName} className="h-6 w-6 rounded" />
        <span className="flex-1 text-center">{game.awayScore}</span>
        <span className="text-gray-400">@</span>
        <span className="flex-1 text-center">{game.homeScore}</span>
        <img src={game.homeTeamDetails.darkLogo} alt={game.homeTeamDetails.espnDisplayName} className="h-6 w-6 rounded" />
        <span>{(game.predictionConfidence * 100).toFixed(2)}</span>
      </div>

      {/* Betting Info */}
      {
        <div className="flex flex-row justify-between w-full text-gray-400 mt-1 text-sm">
          <div>{`Stake: ${stake.toFixed(2)} (${((stake/bankroll) * 100).toFixed(2)}%)`}</div>
          <div>{profit >= 0 ? 'Profit' : 'Loss'}: {profit.toFixed(2)}</div>
          <div>Day Profit: {runningProfit.toFixed(2)}</div>
        </div>

      }
    </div>
  );
};

export default PastGameCard;
