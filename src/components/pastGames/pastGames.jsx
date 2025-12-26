import { useState, useEffect } from "react";
import PastGameCard from "./pastGameCard.jsx";
import { valueBetConditionCheck } from "../../utils/constants.js";
import { useSelector } from "react-redux";
import { computeDayStakesForDay, calculateKellyFraction, calculateReliability, calculateProfitFromUSOdds } from "../../utils/helpers/bettingDataHelpers/helperFunctions.js";
import { getLocalDayKey } from "../../utils/helpers/timeHelpers/gameDateHelpers.js";
import LineGraph from "../dataVisComponents/lineGraph/lineGraph.jsx";


const PastGamesDisplay = () => {
  const { sports, gamesByDay } = useSelector((state) => state.games);
  const { sportsbook, bankroll } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [valueFilter, setValueFilter] = useState(false);
  const [profit, setProfit] = useState(0);
  const [bankrollInvestment, setBankrollInvestment] = useState(0);
  const [wins, setWins] = useState([]);
  const [losses, setLosses] = useState([]);
  const [underDogs, setUnderDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [averageBetSize, setAverageBetSize] = useState(0);
  const [averageStakedPerDay, setAverageStakedPerDay] = useState(0);
  const [averageProfitPerDay, setAverageProfitPerDay] = useState(0);
  const [dayBankrollMap, setDayBankrollMap] = useState({});
  const [enhancedGames, setEnhancedGames] = useState([]);
  const [highestBankroll, setHighestBankroll] = useState(0);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [graphDataFinalBankroll, setGraphDataFinalBankroll] = useState()
  const [graphDataFinalKeptProfit, setGraphDataFinalKeptProfit] = useState()
  const [calibrationBuckets, setCalibrationBuckets] = useState([]);


  const [leagueFilter, setLeagueFilter] = useState({
    baseball_mlb: false,
    americanfootball_nfl: false,
    americanfootball_ncaaf: false,
    basketball_nba: false,
    basketball_ncaab: false,
    basketball_wncaab: false,
    icehockey_nhl: false,
  });

  const passesLeagueFilter = (game, leagueFilter) => {
    const leagueFilterActive = Object.values(leagueFilter).some(Boolean);
    if (!leagueFilterActive) return true;
    return leagueFilter[game.sport_key];
  };

  const passesValueFilter = (game, sports, sportsbook, valueFilter) => {
    if (!valueFilter) return true;
    return valueBetConditionCheck(sports, game, sportsbook, "h2h", game.predictedWinner);
  };

  const passesDateFilter = (game, startDateFilter) => {
    if (!startDateFilter) return true;
    const gameDateKey = getLocalDayKey(game.commence_time);
    return gameDateKey >= startDateFilter;
  };

  const passesAllFilters = (game, filters) => {
    const { leagueFilter, valueFilter, sports, sportsbook, startDateFilter } = filters;
    return (
      passesLeagueFilter(game, leagueFilter) &&
      passesValueFilter(game, sports, sportsbook, valueFilter) &&
      passesDateFilter(game, startDateFilter)
    );
  };


  // --------------------------------------------------------------------------
  // MAIN CALCULATION EFFECT for summary
  // --------------------------------------------------------------------------
  useEffect(() => {
    const BANKROLL_BASE_NUMBER = 10
    let allEnhancedGames = [];
    let evolvingBankroll = BANKROLL_BASE_NUMBER;
    let bankrollInvesement = BANKROLL_BASE_NUMBER
    let keptProfit = 0
    let bankrollByDay = {};
    let tempGraphDataBankroll = []
    let tempGraphDataKeptProfit = []
    let smoothedROI = 0;
    let peakBankroll = BANKROLL_BASE_NUMBER;

    Object.entries(gamesByDay).sort(([dayA], [dayB]) => new Date(dayA) - new Date(dayB)).forEach(([dayKey, dayGames]) => {
      // if (evolvingBankroll < BANKROLL_BASE_NUMBER) {
      //   bankrollInvesement += (BANKROLL_BASE_NUMBER - evolvingBankroll);
      //   evolvingBankroll = BANKROLL_BASE_NUMBER
      // }; // reset to min bankroll

      // save the starting bankroll for this day
      bankrollByDay[dayKey] = {
        starting: evolvingBankroll,
        ending: evolvingBankroll // temp, will update after profit
      };


      const completedGames = dayGames
        .filter((game) => game.complete && (game.predictedWinner === "home" || game.predictedWinner === "away"))
        .filter((game) =>
          passesAllFilters(game, {
            leagueFilter,
            valueFilter,
            sports,
            sportsbook,
            startDateFilter,
          })
        )
      const sportsWithCompletedGames = [
        ...new Set(completedGames.map(game => game.sport_key))
      ];


      // console.log(completedGames)
      const enhancedDayGames = computeDayStakesForDay(completedGames, evolvingBankroll, true, sportsWithCompletedGames.length, false, sports);
      allEnhancedGames = allEnhancedGames.concat(enhancedDayGames);
      // console.log(`Enhanced Games for Day ${dayKey}:`, enhancedDayGames);
      let dayProfit = enhancedDayGames.reduce((acc, game) => acc + (game.profit || 0), 0);




      // ─────────────────────────────
      // Step 1: ROI (% of starting bankroll)
      // ─────────────────────────────
      const startingBankroll = bankrollByDay[dayKey].starting;
      const roi = startingBankroll > 0 ? dayProfit / startingBankroll : 0;
      // ─────────────────────────────
      // Step 2: Smooth ROI
      // ─────────────────────────────
      const SMOOTHING_ALPHA = 0.3;
      smoothedROI = smoothedROI * (1 - SMOOTHING_ALPHA) + roi * SMOOTHING_ALPHA;

      // ─────────────────────────────
      // Step 3: Base reinvest fraction
      // ─────────────────────────────
      let reinvestFraction;

      if (smoothedROI <= 0) reinvestFraction = 0;
      else if (smoothedROI < 0.05) reinvestFraction = 1;
      else if (smoothedROI < 0.15) reinvestFraction = 0.85;
      else if (smoothedROI < 0.30) reinvestFraction = 0.70;
      else if (smoothedROI < 0.60) reinvestFraction = 0.60;
      else reinvestFraction = 0.50;

      // ─────────────────────────────
      // Step 4: Drawdown adjustment
      // ─────────────────────────────
      peakBankroll = Math.max(peakBankroll, evolvingBankroll);
      const drawdown =
        peakBankroll > 0
          ? (peakBankroll - evolvingBankroll) / peakBankroll
          : 0;

      if (drawdown > 0.20) {
        reinvestFraction = Math.min(1, reinvestFraction + 0.15);
      }

      // Safety clamp
      reinvestFraction = Math.max(0, Math.min(1, reinvestFraction));

      // ─────────────────────────────
      // Step 5: Apply profit split
      // ─────────────────────────────
      if (dayProfit > 0) {
        const reinvestAmount = dayProfit * reinvestFraction
        evolvingBankroll += reinvestAmount;
        keptProfit += dayProfit - reinvestAmount;
      } else {
        evolvingBankroll += dayProfit;
      }




      if (completedGames.length > 0) {
        let dayGraphDataBankroll = {
          date: dayKey,
          profit: evolvingBankroll
        }
        tempGraphDataBankroll.push(dayGraphDataBankroll)
        let dayGraphDataKeptProfit = {
          date: dayKey,
          profit: keptProfit
        }
        tempGraphDataKeptProfit.push(dayGraphDataKeptProfit)
      }

      // update ending bankroll
      bankrollByDay[dayKey].ending = evolvingBankroll;


    });
    let highest = 0;
    Object.values(bankrollByDay).forEach(({ ending }) => {
      if (ending > highest) highest = ending;
    });
    setHighestBankroll(highest);
    setGraphDataFinalBankroll(tempGraphDataBankroll)
    setGraphDataFinalKeptProfit(tempGraphDataKeptProfit)
    let filteredGames = allEnhancedGames
    setDayBankrollMap(bankrollByDay);
    setEnhancedGames(filteredGames);

    // summary calculations
    setProfit(keptProfit - bankrollInvesement); // initial bankroll of 10
    setBankrollInvestment(bankrollInvesement);
    setWins(enhancedGames.filter((game) => game.predictionCorrect));
    setLosses(enhancedGames.filter((game) => game.predictionCorrect === false));
    setFavorites(enhancedGames.filter((game) => {
      const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
      const market = bookmaker?.markets.find((m) => m.key === 'h2h');
      const outcome = market?.outcomes.find((o) => o.name === game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName);
      if (!outcome) return false;
      if (outcome.price < 0) return true
    }));
    setUnderDogs(enhancedGames.filter((game) => {
      const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
      const market = bookmaker?.markets.find((m) => m.key === 'h2h');
      const outcome = market?.outcomes.find((o) => o.name === game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName);
      if (!outcome) return false;
      if (outcome.price > 0) return true
    }));

    setAverageBetSize(enhancedGames.length > 0 ? enhancedGames.reduce((acc, game) => acc + (game.stake || 0), 0) / enhancedGames.length : 0);

    setAverageStakedPerDay(() => {
      const daysWithBets = new Set(enhancedGames.map((game) => new Date(game.commence_time).toDateString()));
      return daysWithBets.size > 0 ? enhancedGames.reduce((acc, game) => acc + (game.stake || 0), 0) / daysWithBets.size : 0;
    });

    setAverageProfitPerDay(() => {
      const daysWithBets = new Set(enhancedGames.map((game) => new Date(game.commence_time).toDateString()));
      return daysWithBets.size > 0 ? enhancedGames.reduce((acc, game) => acc + (game.profit || 0), 0) / daysWithBets.size : 0;
    });
    // -------------------------------------------------
    // CALIBRATION BREAKDOWN (0.10 buckets)
    // -------------------------------------------------
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      min: i / 10,
      max: (i + 1) / 10,
      total: 0,
      wins: 0
    }));

    enhancedGames.forEach(game => {
      const p = game.predictionConfidence;
      if (p == null) return;

      const idx = Math.min(Math.floor(p * 10), 9);
      buckets[idx].total += 1;
      if (game.predictionCorrect) {
        buckets[idx].wins += 1;
      }
    });

    const finalizedBuckets = buckets.map(b => ({
      range: `${b.min.toFixed(2)}–${b.max.toFixed(2)}`,
      total: b.total,
      winRate: b.total > 0 ? (b.wins / b.total) * 100 : null
    }));

    setCalibrationBuckets(finalizedBuckets);


  }, [gamesByDay, valueFilter, leagueFilter, sportsbook, sports]);
  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="bg-secondary text-white rounded-md p-4 border border-zinc-600 relative">
      {/* profit graph */}
      <div>
        <LineGraph data={graphDataFinalBankroll} secondData={graphDataFinalKeptProfit} />
      </div>
      {/* Summary Bar */}
      <div className="flex flex-wrap justify-between items-center border-b border-zinc-600 pb-2 mb-3 gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-lg font-semibold">Past Game Results</span>
          <span className="text-sm text-gray-300">
            {`Accuracy: ${wins.length + losses.length > 0
              ? ((wins.length / (wins.length + losses.length)) * 100).toFixed(2)
              : 0
              }%`}
          </span>
          <span className="text-sm text-gray-300">{`Profit: $${profit.toFixed(2)}`}</span>
          <span className="text-sm text-gray-300">{`Bankroll Investment: $${bankrollInvestment.toFixed(2)}`}</span>
          <span className="text-sm text-gray-300">{`Favorite Win Rate: ${favorites.length > 0 ? ((favorites.filter((game) => game.predictionCorrect).length / favorites.length) * 100).toFixed(2) : '0.00'}% (${favorites.filter((game) => game.predictionCorrect).length} / ${favorites.length})`}</span>
          <span className="text-sm text-gray-300">{`Dog Win Rate: ${underDogs.length > 0 ? ((underDogs.filter((game) => game.predictionCorrect).length / underDogs.length) * 100).toFixed(2) : '0.00'}% (${underDogs.filter((game) => game.predictionCorrect).length} / ${underDogs.length})`}</span>
          <span className="text-sm text-gray-300">{`Avg Bet Size: $${averageBetSize.toFixed(2)}`}</span>
          <span className="text-sm text-gray-300">{`Avg Staked / Day: $${averageStakedPerDay.toFixed(2)}`}</span>
          <span className="text-sm text-gray-300">{`Avg Profit / Day: $${averageProfitPerDay.toFixed(2)}`}</span>
          <span className="text-sm text-gray-300">{`Highest Bankroll: ${highestBankroll.toFixed(2)}`}</span>
          <div className="w-full mt-3 border-t border-zinc-700 pt-3">
            <div className="text-sm font-semibold mb-2 text-gray-300">
              Calibration (Predicted vs Actual)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {calibrationBuckets.map(bucket => (
                <div
                  key={bucket.range}
                  className="bg-zinc-800 border border-zinc-700 rounded p-2"
                >
                  <div className="text-gray-400">{bucket.range}</div>
                  <div className="font-semibold">
                    {bucket.total} games
                  </div>
                  <div
                    className={`font-semibold ${bucket.winRate === null
                      ? 'text-gray-400'
                      : bucket.winRate >= ((Number(bucket.range.split('–')[0]) + Number(bucket.range.split('–')[1])) / 2) * 100
                        ? 'text-green-400'
                        : 'text-red-400'
                      }`}
                  >
                    {bucket.winRate === null ? '—' : `${bucket.winRate.toFixed(1)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        <button
          onClick={() => setOpen(!open)}
          className="bg-commonButton text-commonButtonText px-4 py-1.5 rounded shadow border border-commonButton hover:bg-primary"
        >
          Filters
        </button>
      </div>

      {/* Filters Popover */}
      {open && (
        <div className="absolute  right-4 w-72 bg-secondary border border-gray-600 rounded shadow-lg z-20 p-4">
          <label className="flex items-center justify-between mb-3">
            <span>Show Value Games Only</span>
            <input
              type="checkbox"
              checked={valueFilter}
              onChange={() => setValueFilter(!valueFilter)}
              className="accent-yellow-600"
            />
          </label>

          {/* date selector filter */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Start Date Filter:</label>
            <input
              type="date"
              value={startDateFilter || ''}
              onChange={(e) => setStartDateFilter(e.target.value || null)}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
            />
          </div>

          <div className="border-t border-b border-zinc-700 my-3"></div>
          <div className="mb-2 font-semibold">Filter by League</div>
          <div className="max-h-48 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {sports.map((sport) => {
              const leagueName = sport.name.split("_").pop().toUpperCase();
              return (
                <label key={sport.name} className="flex items-center justify-between mb-2">
                  <span>{leagueName}</span>
                  <input
                    type="checkbox"
                    checked={leagueFilter[sport.name]}
                    onChange={() =>
                      setLeagueFilter((prev) => ({
                        ...prev,
                        [sport.name]: !prev[sport.name],
                      }))
                    }
                    className="accent-yellow-600"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Day Boxes */}
      <div className="flex flex-wrap gap-4 mt-4">
        {Object.keys(gamesByDay)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((day) => {

            const startingBankroll =
              dayBankrollMap[day]?.starting ?? 0;



            const enhancedDayGames = enhancedGames.filter(
              g => getLocalDayKey(g.commence_time) === day
            );


            // day metrics
            const dayProfit = enhancedDayGames.reduce((acc, game) => acc + (game.profit || 0), 0);
            const dayWins = enhancedDayGames.filter((game) => game.predictionCorrect).length;
            const dayLosses = enhancedDayGames.filter((game) => game.predictionCorrect === false).length;
            const dayTotalStakes = enhancedDayGames.reduce((acc, game) => acc + (game.stake || 0), 0);
            // const dayBankrollLoss = startingBankroll /

            const endingBankroll =
              dayBankrollMap[day]?.ending ?? startingBankroll + dayProfit;

            return (enhancedDayGames.length > 0 && (
              <div key={day} className="w-full sm:w-[48%] md:w-[32%] lg:w-[24%] xl:w-[19%] mb-3 bg-zinc-800 rounded p-3 border border-zinc-700">
                <div className="mb-2 border-b border-zinc-700 pb-2">
                  <div className="text-lg font-semibold mb-1">
                    {day}
                  </div>

                  <div className="text-sm text-gray-300 grid grid-cols-1 gap-1">

                    <div>
                      <span className="text-gray-400">Starting Bankroll:</span>
                      <span className="font-semibold ml-1">
                        ${(startingBankroll).toFixed(2)}
                      </span>
                      <span className="text-gray-400">Profit:</span>
                      <span className={`font-semibold ml-1 text-${dayProfit >= 0 ? 'green-400' : 'red-400'}`}>
                        ${dayProfit.toFixed(2)} {dayProfit < 0 ? `(${((Math.abs(dayProfit) / startingBankroll) * 100).toFixed(2)}%)` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400">Staked:</span>
                      <span className={`font-semibold ml-1 text-${dayTotalStakes > startingBankroll ? 'red-400' : ''}`}>
                        ${dayTotalStakes.toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-2">Avg Stake:</span>
                      <span className="font-semibold ml-1">
                        ${(dayTotalStakes / enhancedDayGames.length).toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400">Return:</span>
                      <span className="font-semibold ml-1">
                        ${(dayTotalStakes + dayProfit).toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-2">ROI:</span>
                      <span className="font-semibold ml-1 text-blue-400">
                        {dayTotalStakes > 0
                          ? ((dayProfit / dayTotalStakes) * 100).toFixed(2)
                          : "0.00"}%
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400">Winrate:</span>
                      <span className="font-semibold ml-1">
                        {((dayWins / (dayWins + dayLosses)) * 100).toFixed(2)}%
                      </span>
                      <span className="text-gray-400 ml-2">{`(${dayWins}:${dayLosses})`}</span>
                      <span className="text-gray-400 ml-2">Bets:</span>
                      <span className="font-semibold ml-1">{enhancedDayGames.length}</span>
                    </div>

                    <div>
                      <span className="text-gray-400">Ending Bankroll:</span>
                      <span className="font-semibold ml-1">
                        ${(endingBankroll).toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-1">Kept Profit:</span>
                      <span className="font-semibold ml-1">${(dayProfit - (endingBankroll - startingBankroll)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mt-2 pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {enhancedDayGames.map((game) => {
                    return <PastGameCard key={game.id} game={game} sportsbook={sportsbook} stake={game.stake} profit={game.profit} runningProfit={game.runningProfit} bankroll={startingBankroll} />;
                  })}
                </div>
              </div>
            ));


          })}
      </div>
    </div>
  );

};

export default PastGamesDisplay;
