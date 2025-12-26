import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds } from '../../utils/helpers/bettingDataHelpers/helperFunctions';

const EvTestingDisplay = () => {
  const { gamesByDay, sports } = useSelector((state) => state.games);

  const sportEVMax = {
    americanfootball_nfl: 1.6,
    americanfootball_ncaaf: 10.5,
    basketball_wncaab: 20.7,
    basketball_ncaab: 5.7,
    basketball_nba: 6.9,
    icehockey_nhl: 0.4,
    baseball_mlb: 50,
  };

  const resultsByConfidence = useMemo(() => {
    const results = {};

    sports.forEach((sport) => {
      // const maxEV = sportEVMax[sport.name] ?? 5; // fallback maxEV
      // const steps = 50; // number of floors
      const evFloors = [];

      // Create EV floors from -1 to maxEV (numbers, not strings)
      for (let j = -1; j <= 1; j += .1) {
        evFloors.push([j, j + .1]);
      }

      // Initialize results for each floor
      results[sport.name] = {};

      evFloors.forEach((floor) => {
        let [low, high] = floor
        let label = `${low}-${high}`
        results[sport.name][label] = {
          floor: low,
          ceiling: high,
          bets: 0,
          wins: 0,
          totalReturn: 0,
          avgReturn: 0,
          winRate: 0,
        };
      });

      // Flatten all games for this sport
      Object.values(gamesByDay)
        .flat()
        .filter((g) => g.sport_key === sport.name)
        .forEach((game) => {
          const bookmaker = game.bookmakers?.[0];
          const market = bookmaker?.markets?.find((m) => m.key === 'h2h');
          const outcome = market?.outcomes?.find(
            (out) =>
              out.name ===
              (game.predictedWinner === 'home'
                ? game.homeTeamDetails.espnDisplayName
                : game.awayTeamDetails.espnDisplayName)
          );
          if (!outcome) return;

          const odds = outcome.price;

          // Calculate EV
          const edge =
            game.predictionConfidence - outcome.impliedProbability

          const profit = game.predictionCorrect
            ? calculateProfitFromUSOdds(odds, 1)
            : -1;

          // Update all floors where EV >= floor
          evFloors.forEach((floor) => {
            let [low, high] = floor
            let label = `${low}-${high}`
            if (edge >= low && edge <= high) {
              const b = results[sport.name][label];
              b.bets += 1;
              b.totalReturn += profit;
              if (game.predictionCorrect) b.wins += 1;
            }
          });
        });

      // Finalize averages and win rates
      Object.values(results[sport.name]).forEach((b) => {
        if (b.bets > 0) {
          b.avgReturn = b.totalReturn / b.bets;
          b.winRate = b.wins / b.bets;
        }
      });
    });

    return results;
  }, [gamesByDay, sports]);
  console.log(resultsByConfidence)
  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">EV Floor Testing (Flat 1u)</h2>
      {Object.entries(resultsByConfidence).map(([sport, floors]) => {
        // console.log(floors)
        return (
          <div key={sport} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{sport}</h3>
            <div className="flex flex-row flex-wrap">
              {Object.entries(floors).map(([floor, b]) => {
                return (
                  <div key={floor} className="border p-2 mb-1 bg-black/30">
                    <div>Edge Range: {`${b.floor.toFixed(2)} - ${b.ceiling.toFixed(2)}`}</div>
                    <div>Bets: {b.bets}</div>
                    <div>Total Return: {b.totalReturn.toFixed(2)}</div>
                    <div>Avg Return / Bet: {b.avgReturn.toFixed(3)}</div>
                    <div>Win Rate: {(b.winRate * 100).toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default EvTestingDisplay;
