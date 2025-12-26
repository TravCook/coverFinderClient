import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck } from '../../utils/constants';
import { computeDayStakesForDay } from '../../utils/helpers/bettingDataHelpers/helperFunctions';

const BackTestingComponent = () => {
  const { gamesByDay, sports } = useSelector((state) => state.games);
  const { userKelleyPct, sportsbook } = useSelector((state) => state.user);

  // INITIAL BANKROLL PER SPORT
  const initialBankroll = 10; // can adjust per sport

  const confidenceBins = [
    [0, .1],
    [.1, .2],
    [.2, .3],
    [.3, .4],
    [.4, .5],
    [.5, .6],
    [.6, .7],
    [.7, .8],
    [.8, .9],
    [.9, 1.0],
  ];

  let bettingStrategies = [
    'flat',
    'kelly-.1',
    'kelly-.15',
    'kelly-.2',
    'kelly-.25',
    'kelly-.3',
    'kelly-.35',
    'kelly-.4',
    'kelly-.45',
    'kelly-.5',
    'kelly-.55',
    'kelly-.6',
    'kelly-.65',
    'kelly-.7',
    'kelly-.75',
    'kelly-.8',
    'kelly-.85',
    'kelly-.9',
    'kelly-1.0',
  ]



  const backtestResults = useMemo(() => {
    const results = {};

    sports.forEach((sport) => {
      // per-sport results object
      results[sport.name] = {};

      // prepare bins
      confidenceBins.forEach(([low, high]) => {
        const label = `${low}-${high}`;
        results[sport.name][label] = {};

        bettingStrategies.forEach((strategy) => {
          results[sport.name][label][strategy] = {
            totalProfit: 0,
            avgProfit: 0,
            biggestWin: 0,
            biggestLoss: 0,
            gamesCount: 0,
          };
        });
      });

      // ********************
      // BANKROLL PER STRATEGY (correct)
      // ********************
      const strategyBankrolls = {};
      bettingStrategies.forEach((strategy) => {
        strategyBankrolls[strategy] = initialBankroll;
      });

      // ********************
      // LOOP DAYS IN ORDER
      // ********************
      Object.keys(gamesByDay)
        .sort()
        .forEach((dayKey) => {
          const dayGames = gamesByDay[dayKey];

          // filter for this sport + value bets
          const sportGames = dayGames
            .filter((g) => g.sport_key === sport.name)
            .filter((g) =>
              valueBetConditionCheck(
                sports,
                g,
                sportsbook,
                "h2h",
                g.predictedWinner
              )
            )
            .sort((a, b) => a.predictionConfidence - b.predictionConfidence);

          if (sportGames.length === 0) return;

          // ***************************************
          // FOR EACH STRATEGY — compute stakes ONCE
          // ***************************************
          bettingStrategies.forEach((strategy) => {
            let [stratName, pct] = strategy.split("-");
            pct = parseFloat(pct);

            const bankrollBefore = strategyBankrolls[strategy];

            // compute stakes for ALL games of this day
            const enriched = computeDayStakesForDay(sportGames, bankrollBefore, true, 1,  {
              overrideStrategy: stratName, // "flat" or "kelly"
              overridePct: pct,
              sportsbook,
              mode: "past",
            }, sports);

            // ***********************
            // PROCESS PROFIT PER GAME
            // ***********************
            enriched.forEach((game) => {
              const profit =
                game.predictionCorrect
                  ? (game.profit ?? game.stake)
                  : -game.stake;

              // update bankroll
              strategyBankrolls[strategy] += profit;

              // assign to bin
              const bin = confidenceBins.find(
                ([low, high]) =>
                  game.predictionConfidence >= low &&
                  game.predictionConfidence < high
              );
              if (!bin) return;

              const label = `${bin[0]}-${bin[1]}`;
              const bucket = results[sport.name][label][strategy];

              // update bin metrics
              bucket.totalProfit += profit;
              bucket.gamesCount += 1;
              bucket.biggestWin = Math.max(bucket.biggestWin, profit);
              bucket.biggestLoss = Math.min(bucket.biggestLoss, profit);
              bucket.avgProfit = bucket.totalProfit / bucket.gamesCount;
            });
          });
        });
    });

    return results;
  }, [gamesByDay, sports, sportsbook, userKelleyPct]);


  return (
    <div className="flex flex-col text-white p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Backtesting Results</h2>
      {sports.map((sport) => (
        <div key={sport.name} className="flex flex-col w-full">
          <div>{sport.name}</div>
          <div className="flex flex-row flex-wrap w-full justify-evenly">
            {confidenceBins.map((bin) => {
              const [low, high] = bin;
              const binLabel = `${low}-${high}`;
              const binData = backtestResults[sport.name][binLabel];
              // find best strategy key
              const bestStrategy = Object.keys(binData).reduce((best, current) => {
                return binData[current].totalProfit > binData[best].totalProfit
                  ? current
                  : best;
              }, Object.keys(binData)[0]);

              const best = binData[bestStrategy];
              return (
                <div key={binLabel} className="border p-2 m-1">
                  <div>{`${low}-${high}`}</div>
                  <div className="mt-2 p-2 border rounded bg-black/30">
                    <div className="font-bold text-lg">Optimal Betting Strategy:</div>

                    <div className="flex flex-col mt-1">
                      <div className="font-bold text-yellow-300 text-xl">{bestStrategy}</div>

                      <div>Total Profit: {best.totalProfit.toFixed(2)}</div>
                      <div>Avg/Game: {best.avgProfit.toFixed(2)}</div>
                      <div>Biggest Win: {best.biggestWin.toFixed(2)}</div>
                      <div>Biggest Loss: {best.biggestLoss.toFixed(2)}</div>
                      <div>Games Count: {best.gamesCount}</div>
                    </div>
                  </div>

                  {bettingStrategies.map((strategy) => {
                    const s = binData[strategy];
                    return (
                      <div key={strategy} className="flex flex-row justify-between">
                        <div>{strategy}</div>
                        <div>Total Profit: {s.totalProfit.toFixed(2)}</div>
                        <div>Avg/Game: {s.avgProfit.toFixed(2)}</div>
                        <div>Biggest Win: {s.biggestWin.toFixed(2)}</div>
                        <div>Biggest Loss: {s.biggestLoss.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackTestingComponent;
