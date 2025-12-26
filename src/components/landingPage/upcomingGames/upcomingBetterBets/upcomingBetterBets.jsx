import {useState} from 'react';
import { useSelector } from 'react-redux';
import { computeDayStakesForDay } from '../../../../utils/helpers/bettingDataHelpers/helperFunctions';
import MatchupCard from '../../../matchupCard/matchupCard.jsx';
import { valueBetConditionCheck } from '../../../../utils/constants';
import KelleyBetCard from '../../../kelleyBetCard/kelleyBetCard.jsx';
import { getLocalDayKey } from '../../../../utils/helpers/timeHelpers/gameDateHelpers.js';

const UpcomingBetterBets = () => {
  const { gamesByDay, sports } = useSelector(state => state.games);
  const { sportsbook, bankroll } = useSelector(state => state.user);

  const [dayBankroll, setDayBankroll] = useState(10);


  // only get today's games

  const today = new Date();
  const dayKey = getLocalDayKey(today)
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const localDate = `${year}-${month}-${day}`; // YYYY-MM-DD (LOCAL)
  const todaysGames = gamesByDay[localDate] || [];

  let sportsWithCompletedGames = new Set(todaysGames.map((game) => game.sport_key));

  let enrichedGames = computeDayStakesForDay(todaysGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, 'h2h', game.predictedWinner)), dayBankroll, false, sportsWithCompletedGames.length, false, sports)

  return (
    <div className=''>
      <div className='mb-6'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-bold mb-4 w-full flex justify-center'>Today's Better Bets</h2>
          <div>
            {/*text box for today's bankroll  */}
            <label className='text-white mr-2'>Today's Bankroll:</label>
            <input
              type='number'
              value={dayBankroll}
              onChange={(e) => setDayBankroll(parseFloat(e.target.value))}
              className='p-2 rounded bg-zinc-800 text-white border border-zinc-700 w-32'
            />
          </div>
          <div className='flex flex-row flex-wrap gap-4 justify-center'>
            {enrichedGames.filter((game) => !game.complete).map((game) => {
              return (
                <KelleyBetCard key={game.id} game={game} />
              )
            })}
          </div>
          {/* center and bold and green text for summary area */}
          <div className='mt-4 flex flex-row gap-8 font-bold text-green-600 justify-center'>
            <div>
              Total Stake: {enrichedGames.reduce((acc, game) => acc + (game.stake || 0), 0).toFixed(2)}
            </div> {/* Total amount Stakes */}
            <div>
              Expected Profit: {enrichedGames.reduce((acc, game) => acc + (game.expectedProfit || 0), 0).toFixed(2)}
            </div> {/* Total amount Expected Value */}
            <div>
              Total Wagers: {enrichedGames.length}
            </div> {/* Total number of bets */}
            <div>
              Average Wager: {(enrichedGames.reduce((acc, game) => acc + (game.stake || 0), 0) / enrichedGames.length).toFixed(2)}
            </div>
          </div>
        </div>

      </div>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold mb-4 w-full flex justify-center'>Today's Games</h2>
        <div className='flex flex-row flex-wrap gap-4 justify-center overflow-y-scroll max-h-[32rem]' style={{scrollbarWidth: 'thin'}}>
          {[...todaysGames].sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)).filter((game) => !game.complete).map((game, index) => {
            return (
              <MatchupCard key={index} gameData={game} />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default UpcomingBetterBets;
