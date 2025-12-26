import { kelleyBetSizeCalc } from "./helperFunctions";

const MIN_STAKE = 0.09;
const SPORT_BANKROLL = 10;

export function generateStakesForSport(sportGames, strat, settings) {
  const { bettingMode, topX } = settings;

  // Sort by confidence for stake ordering
  const sorted = [...sportGames].sort(
    (a, b) => b.predictionConfidence - a.predictionConfidence
  );

  let bankroll = SPORT_BANKROLL;
  const stakes = {};

  // limit bets if TopX mode is enabled
  const gamesToStake =
    bettingMode === "topX" ? sorted.slice(0, topX) : sorted;

  for (let g of gamesToStake) {
    // STOP on bankroll depletion
    if (bettingMode === "stopOnZero" && bankroll < MIN_STAKE) break;

    const bookmaker = g.bookmakers?.find(b => b.key === "fanduel");
    const market = bookmaker?.markets?.find(m => m.key === "h2h");
    const outcome = market?.outcomes?.find(o =>
      o.name === (g.predictedWinner === "home"
        ? g.homeTeamDetails.espnDisplayName
        : g.awayTeamDetails.espnDisplayName)
    );

    if (!outcome) {
      stakes[g.id] = 0;
      continue;
    }

    let stake;

    if (strat.strategy === "flat") {
      stake = 1;
    } else {
      // TRUE KELLY: uses odds + model win probability
      const kellyFrac = kelleyBetSizeCalc(g, outcome); // raw Kelly fraction

      // multiply by pctKelly (⅛ Kelly, ½ Kelly, etc.)
      const adjustedFrac = kellyFrac * (strat.pct ?? 1);

      stake = bankroll * adjustedFrac;
    }

    // Apply min stake
    if (stake < MIN_STAKE) stake = MIN_STAKE;

    // Stop if we can't cover min stake (when stopOnZero is active)
    if (bankroll < MIN_STAKE && bettingMode === "stopOnZero") {
      break;
    }

    // Reduce bankroll
    bankroll -= stake;
    if (bankroll < 0) bankroll = 0;

    stakes[g.id] = stake;
  }

  // For all skipped games, assign stake = 0
  sorted.forEach(g => {
    if (stakes[g.id] == null) stakes[g.id] = 0;
  });

  return stakes;
}
