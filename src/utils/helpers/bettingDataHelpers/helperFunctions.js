import { sportConfidenceBucketMap } from '../../constants.js';

/**
 * Calculate the stake for a game based on options.
 * @param {Object} game - The game object with odds and predicted probability.
 * @param {Object} options - { strategy: 'kelly' | 'flat', userKelleyPct?: number, flatBetAmount?: number }
 * @returns {number} stake amount
 */
export const calculateStake = (game, odds, sports, override) => {
  // return 1 // flat stake to test EV
  let gameSport = sports.find((sport) => sport.name === game.sport_key)
  if (!gameSport) {
    return 0
  }
  const { overrideStrategy, overridePct, flatBetAmount } = override || {};
  // ---------------------------------------------
  // 1. If a manual override was provided (backtesting)
  // ---------------------------------------------
  if (overrideStrategy && overrideStrategy === "flat") {
    return flatBetAmount ?? 1;
  }

  if (overrideStrategy && overrideStrategy === "kelly") {
    if (!game.predictionConfidence || !odds) return 0;

    const decimalOdds = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
    const b = decimalOdds - 1;
    const p = game.predictionConfidence;
    const q = 1 - p;

    let kellyFraction = ((b * p) - q) / b;

    const pct = overridePct ?? 1; // default full Kelly

    return (kellyFraction * pct) * game.stakeBankroll;
  }

  // ---------------------------------------------
  // 2. If no override → fall back to the new automatic system
  // ---------------------------------------------


  const sportVariance = gameSport.variance
  const sportReliability = gameSport.reliabilityWeight

  // const segmentAverageVariance = gameSport.valueBetSettings.reduce((sum, seg) => sum + seg.segmentVariance, 0) / gameSport.valueBetSettings.length
  // const segmentAverageReliability = gameSport.valueBetSettings.reduce((sum, seg) => sum + seg.segmentReliability, 0) / gameSport.valueBetSettings.length

  // const finalVariance = (sportVariance + segmentAverageVariance) / 2
  // const finalReliability = (sportReliability + segmentAverageReliability) / 2

  const reliabilityFactor = sportReliability / sportVariance

  const decimalOdds = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
  const b = decimalOdds - 1;
  const p = game.predictionConfidence;
  const q = 1 - p;

  // 1. Compute base Kelly
  let rawKelly = ((b * p) - q) / b;

  rawKelly *= reliabilityFactor

  let adjustedKellyPct = rawKelly * 1

  return adjustedKellyPct;

};

/**
 * Calculate profit from US odds
 */
export const calculateProfitFromUSOdds = (odds, stake) => {
  if (odds > 0) {
    return (odds / 100) * stake;
  } else {
    return (100 / Math.abs(odds)) * stake;
  }
};

export const calculateKellyFraction = (game) => {
  const bookmaker = game?.bookmakers?.find(b => b.key === 'fanduel');
  const market = bookmaker?.markets?.find(m => m.key === 'h2h');
  const outcome = market?.outcomes?.find(out =>
    out.name === (
      game.predictedWinner === 'home'
        ? game.homeTeamDetails.espnDisplayName
        : game.awayTeamDetails.espnDisplayName
    )
  );


  const odds = outcome.price
  const decimalOdds = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
  const b = decimalOdds - 1
  const p = game.predictionConfidence

  const pEff = 0.5 + (p - 0.5) * .60
  const kellyF = ((b * pEff) - (1 - pEff)) / b

  return kellyF
}

export const calculateReliability = (game, sport) => {
  const sportVariance = sport.variance
  const sportReliability = sport.reliabilityWeight

  const segmentAverageVariance = sport.valueBetSettings.reduce((sum, seg) => sum + seg.segmentVariance, 0) / sport.valueBetSettings.length
  const segmentAverageReliability = sport.valueBetSettings.reduce((sum, seg) => sum + seg.segmentReliability, 0) / sport.valueBetSettings.length

  const finalVariance = (sportVariance + segmentAverageVariance) / 2
  const finalReliability = (sportReliability + segmentAverageReliability) / 2

  const reliabilityFactor = finalReliability / finalVariance

  return reliabilityFactor
}

export const computeDayStakesForDay = (dayGames, startingBankroll, past, sportsWithGames, override, allSports) => {
  if (!dayGames || dayGames.length === 0) return [];

  // ---------------------------------------------
  // PASS 1 — PER-SPORT BANKROLL, CONFIDENCE SORT
  // ---------------------------------------------
  const gamesByConfidence = [...dayGames]

  const stakesMap = new Map();        // game.id → stake
  const weightsMap = new Map()

  let globalBankroll = startingBankroll

  for (const game of gamesByConfidence) {

    // find outcome
    const bookmaker = game?.bookmakers?.find(b => b.key === 'fanduel');
    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
    const outcome = market?.outcomes?.find(out =>
      out.name === (
        game.predictedWinner === 'home'
          ? game.homeTeamDetails.espnDisplayName
          : game.awayTeamDetails.espnDisplayName
      )
    );

    if (!outcome) {
      stakesMap.set(game.id, 0);
      continue;
    }

    weightsMap.set(game.id, calculateStake(game, outcome.price, allSports));



  }
// totalWeight could be 0 if all rawKellys <= 0
const totalWeight = Math.max([...weightsMap.values()].reduce((sum, w) => sum + Math.max(w,0), 0), 1)

  for (const game of gamesByConfidence) {
    let gameWeight = weightsMap.get(game.id)

    let weightPct = gameWeight / totalWeight

    const MAX_DAILY_EXPOSURE = .8
    const ALLOWED_CAPITAL = startingBankroll * MAX_DAILY_EXPOSURE

    const SINGLE_BET_MAX = 1

    let stake = weightPct * ALLOWED_CAPITAL

    stake = Math.min(stake, SINGLE_BET_MAX * startingBankroll)

    stake = Math.max(stake, 0.1); // No negatives 
    stake = Math.floor(stake * 10) / 10; // Always round DOWN to nearest $0.10 
    stakesMap.set(game.id, stake);

  }

  // ---------------------------------------------
  // PASS 2 — SORT BY GAME TIME, PROFIT ONLY
  // ---------------------------------------------
  const gamesByTime = gamesByConfidence.sort(
    (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
  );

  let runningProfit = 0;
  let rollingBankroll = startingBankroll;

  return gamesByTime.map(game => {
    const stake = stakesMap.get(game.id) ?? 0;
    // find outcome
    const bookmaker = game?.bookmakers?.find(b => b.key === 'fanduel');
    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
    const outcome = market?.outcomes?.find(out =>
      out.name === (
        game.predictedWinner === 'home'
          ? game.homeTeamDetails.espnDisplayName
          : game.awayTeamDetails.espnDisplayName
      )
    );

    if (!outcome) {
      return {
        ...game,
        stake,
        profit: 0,
        expectedProfit: 0,
        runningProfit,
        bankrollAfter: past ? rollingBankroll : undefined
      };
    }

    let profit = 0;
    let expectedProfit = 0;

    if (past) {
      profit = game.predictionCorrect
        ? calculateProfitFromUSOdds(outcome.price, stake)
        : -stake;

      rollingBankroll += profit;
      runningProfit += profit;

    } else {
      expectedProfit = calculateProfitFromUSOdds(outcome.price, stake);
      // Do NOT update runningProfit or bankroll for future games
    }


    return {
      ...game,
      stake,
      profit: past ? profit : undefined,
      expectedProfit: !past ? expectedProfit : undefined,
      runningProfit: past ? runningProfit : undefined,
      bankrollAfter: past ? rollingBankroll : undefined
    };

  });
};

