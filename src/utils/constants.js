import { useSelector } from 'react-redux';
import { erf } from 'mathjs'
import statsMinMax from './sampledGlobalStats.json';

export const getDifferenceInMinutes = (date1, date2) => {
  const diffMilliseconds = date2.getTime() - date1.getTime();
  const diffMinutes = diffMilliseconds / (1000 * 60);
  return diffMinutes;
}

export const normalizeStat = (statName, value, sportKey) => {
  const minMaxValues = statsMinMax[statName];
  if (!minMaxValues) {
    console.warn(`No min/max values found for stat: ${statName}`);
    return value; // If no min/max values, return original value (or handle differently)
  }
  const { min, max } = minMaxValues;
  // Avoid division by zero
  if (max === min) return 0;
  return (value - min) / (max - min); // Apply Min-Max Normalization
}

export function sigmoidNormalize(value, midpoint, sharpness) {
  const sigmoid = 1 / (1 + Math.exp(-sharpness * (value - midpoint)));
  return sigmoid * 45; // map to 0–45 for HSL
}

export const reverseComparisonStats = [
  'BSKBturnoversPerGame',
  'BSKBfoulsPerGame',
  'BSKBturnoverRatio',
  'BSBhitsGivenUp',
  'BSBearnedRuns',
  'BSBbattersWalked',
  'BSBrunsAllowed',
  'BSBhomeRunsAllowed',
  'BSBbattingStrikeouts',
  'BSBearnedRunAverage',
  'BSBwalksHitsPerInningPitched',
  'BSBopponentBattingAverage',
  'BSBopponentSlugAverage',
  'BSBopponentOnBasePct',
  'BSBopponentOnBasePlusSlugging',
  'BSBerrors',
  'BSBpassedBalls',
  'BSBcatcherStolenBasesAllowed',
  'BSBatBatsPerHomeRun',
  'HKYshotsMissed',
  'HKYshotsMissedPerGame',
  'HKYfaceoffsLost',
  'HKYfaceoffsLostPerGame',
  'HKYgiveaways',
  'HKYppGoalsAgainst',
  'HKYppGoalsAgainstPerGame',
  'HKYpimDifferential',
  'HKYpimDifferentialPerGame',
  'HKYtotalPenalties',
  'HKYpenaltiesPerGame',
  'HKYpenaltyMinutes',
  'HKYpenaltyMinutesPerGame',
  'USFBgiveaways',
]

export const generalStats = {
  'seasonWinLoss': 'Season Win-Loss Record',
  'homeWinLoss': 'Home Win-Loss Record',
  'awayWinLoss': 'Away Win-Loss Record',
  'pointDiff': 'Point Differential',
  'BSKBtotalPoints': 'Total Points',
  'BSKBpointsPerGame': 'Points per Game',
  'BSKBassists': 'Assists',
  'BSKBassistsPerGame': 'Assists per Game',
  'HKYgoals': 'Goals',
  'HKYgoalsPerGame': 'Goals per Game',
  'HKYassists': 'Assists',
  'HKYassistsPerGame': 'Assists per Game',
  'HKYfaceoffs': 'Faceoffs',
  'HKYfaceoffsPerGame': 'Faceoffs per Game',
  'HKYfaceoffsWon': 'Faceoffs Won',
  'HKYfaceoffsWonPerGame': 'Faceoffs Won per Game',
  'HKYfaceoffsLost': 'Faceoffs Lost',
  'HKYfaceoffsLostPerGame': 'Faceoffs Lost per Game',
  'HKYfaceoffPct': 'Faceoff Percentage',
  'HKYfaceoffPctPerGame': 'Faceoff Percentage per Game',
  'USFBtotalFirstDowns': 'Total First Downs',
  'USFBthirdDownEfficiency': 'Third Down Efficiency',
  'USFBpassingYards': 'Passing Yards',
  'USFBreceivingYards': 'Receiving Yards',
  'USFBrushingYards': 'Rushing Yards',
  'USFBsacksPerGame': 'Sacks per Game',
  'USFBfieldGoalsMade': 'Field Goals Made',
  'USFBtotalTouchdowns': 'Total Touchdowns',
  'USFBtouchdownsPerGame': 'Touchdowns per Game',
  'USFBtotalPoints': 'Total Points',
  'USFBpointsPerGame': 'Points per Game',
  'USFBtotalPenyards': 'Total Penalty Yards',
  'USFBaveragePenYardsPerGame': 'Average Penalty Yards per Game',
  'USFBgiveaways': 'Giveaways',
  'USFBtakeaways': 'Takeaways',
  'USFBturnoverDiff': 'Turnover Differential',

}
export const offenseStats = {
  'BSKBtotalPoints': 'Total Points',
  'BSKBpointsPerGame': 'Points per Game',
  'BSKBassists': 'Assists',
  'BSKBassistsPerGame': 'Assists per Game',
  'BSKBassistRatio': 'Assist Ratio',
  'BSKBeffectiveFgPercent': 'Effective Field Goal Percentage',
  'BSKBfieldGoalPercent': 'Field Goal Percentage',
  'BSKBfieldGoalsAttempted': 'Field Goals Attempted',
  'BSKBfieldGoalsMade': 'Field Goals Made',
  'BSKBfieldGoalsPerGame': 'Field Goals per Game',
  'BSKBfreeThrowPercent': 'Free Throw Percentage',
  'BSKBfreeThrowsAttempted': 'Free Throws Attempted',
  'BSKBfreeThrowsMade': 'Free Throws Made',
  'BSKBfreeThrowsMadePerGame': 'Free Throws Made per Game',
  'BSKBoffensiveRebounds': 'Offensive Rebounds',
  'BSKBoffensiveReboundsPerGame': 'Offensive Rebounds per Game',
  'BSKBoffensiveReboundRate': 'Offensive Rebound Rate',
  'BSKBoffensiveTurnovers': 'Offensive Turnovers',
  'BSKBturnoversPerGame': 'Turnovers per Game',
  'BSKBturnoverRatio': 'Turnover Ratio',
  'BSKBthreePointPct': 'Three-Point Percentage',
  'BSKBthreePointsAttempted': 'Three-Point Attempts',
  'BSKBthreePointsMade': 'Three-Point Made',
  'BSKBtrueShootingPct': 'True Shooting Percentage',
  'BSKBpace': 'Pace',
  'BSKBpointsInPaint': 'Points in the Paint',
  'BSKBshootingEfficiency': 'Shooting Efficiency',
  'BSKBscoringEfficiency': 'Scoring Efficiency',
  'HKYgoals': 'Goals',
  'HKYgoalsPerGame': 'Goals per Game',
  'HKYassists': 'Assists',
  'HKYassistsPerGame': 'Assists per Game',
  'HKYshotsIn1st': 'Shots in 1st Period',
  'HKYshotsIn1stPerGame': 'Shots in 1st Period per Game',
  'HKYshotsIn2nd': 'Shots in 2nd Period',
  'HKYshotsIn2ndPerGame': 'Shots in 2nd Period per Game',
  'HKYshotsIn3rd': 'Shots in 3rd Period',
  'HKYshotsIn3rdPerGame': 'Shots in 3rd Period per Game',
  'HKYtotalShots': 'Total Shots',
  'HKYtotalShotsPerGame': 'Total Shots per Game',
  'HKYshotsMissed': 'Shots Missed',
  'HKYshotsMissedPerGame': 'Shots Missed per Game',
  'HKYppgGoals': 'Power Play Goals',
  'HKYppgGoalsPerGame': 'Power Play Goals per Game',
  'HKYppassists': 'Power Play Assists',
  'HKYppassistsPerGame': 'Power Play Assists per Game',
  'HKYpowerplayPct': 'Power Play Percentage',
  'HKYshortHandedGoals': 'Shorthanded Goals',
  'HKYshortHandedGoalsPerGame': 'Shorthanded Goals per Game',
  'HKYshootingPct': 'Shooting Percentage',
  'HKYfaceoffs': 'Faceoffs',
  'HKYfaceoffsPerGame': 'Faceoffs per Game',
  'HKYfaceoffsWon': 'Faceoffs Won',
  'HKYfaceoffsWonPerGame': 'Faceoffs Won per Game',
  'HKYfaceoffsLost': 'Faceoffs Lost',
  'HKYfaceoffsLostPerGame': 'Faceoffs Lost per Game',
  'HKYfaceoffPct': 'Faceoff Percentage',
  'HKYfaceoffPctPerGame': 'Faceoff Percentage per Game',
  'HKYgiveaways': 'Giveaways',
  'HKYshotDifferential': 'Shot Differential',
  'HKYshotDifferentialPerGame': 'Shot Differential per Game',
  'HKYgoalDifferentialPerGame': 'Goal Differential per Game',
}
export const defenseStats = {
  'BSKBblocks': 'Blocks',
  'BSKBblocksPerGame': 'Blocks per Game',
  'BSKBdefensiveRebounds': 'Defensive Rebounds',
  'BSKBdefensiveReboundsPerGame': 'Defensive Rebounds per Game',
  'BSKBsteals': 'Steals',
  'BSKBstealsPerGame': 'Steals per Game',
  'BSKBreboundRate': 'Rebound Rate',
  'BSKBreboundsPerGame': 'Rebounds per Game',
  'BSKBfoulsPerGame': 'Fouls per Game',
  'BSKBteamAssistToTurnoverRatio': 'Team Assist to Turnover Ratio',
  'HKYgoalsAgainst': 'Goals Against',
  'HKYgoalsAgainstPerGame': 'Goals Against per Game',
  'HKYshotsAgainst': 'Shots Against',
  'HKYshotsAgainstPerGame': 'Shots Against per Game',
  'HKYpenaltyKillPct': 'Penalty Kill Percentage',
  'HKYpenaltyKillPctPerGame': 'Penalty Kill Percentage per Game',
  'HKYppGoalsAgainst': 'Power Play Goals Against',
  'HKYppGoalsAgainstPerGame': 'Power Play Goals Against per Game',
  'HKYshutouts': 'Shutouts',
  'HKYsaves': 'Saves',
  'HKYsavesPerGame': 'Saves per Game',
  'HKYsavePct': 'Save Percentage',
  'HKYblockedShots': 'Blocked Shots',
  'HKYblockedShotsPerGame': 'Blocked Shots per Game',
  'HKYhits': 'Hits',
  'HKYhitsPerGame': 'Hits per Game',
  'HKYtakeaways': 'Takeaways',
  'HKYtakeawaysPerGame': 'Takeaways per Game',
  'USFBtacklesforLoss': 'Tackles for Loss',
  'USFBtacklesforLossPerGame': 'Tackles for Loss per Game',
  'USFBinterceptions': 'Interceptions',
  'USFByardsPerInterception': 'Yards per Interception',
  'USFBsacksTotal': 'Total Sacks',
  'USFBsacksPerGame': 'Sacks per Game',
  'USFBsackYards': 'Sack Yards',
  'USFBsackYardsPerGame': 'Sack Yards per Game',
  'USFBstuffs': 'Stuffs',
  'USFBstuffsPerGame': 'Stuffs per Game',
  'USFBstuffYards': 'Stuff Yards',
  'USFBpassesDefended': 'Passes Defended',
  'USFBpassesDefendedPerGame': 'Passes Defended per Game',
  'USFBsafties': 'Safeties',
}
export const passingStats = {
  'USFBcompletionPercent': 'Completion Percentage',
  'USFBcompletions': 'Completions',
  'USFBcompletionsPerGame': 'Completions per Game',
  'USFBnetPassingYards': 'Net Passing Yards',
  'USFBnetPassingYardsPerGame': 'Net Passing Yards per Game',
  'USFBpassingFirstDowns': 'Passing First Downs',
  'USFBpassingTouchdowns': 'Passing Touchdowns',
  'USFBpassingYards': 'Passing Yards',
  'USFBpassingYardsPerGame': 'Passing Yards per Game',
  'USFBpassingAttempts': 'Passing Attempts',
  'USFBpassingAttemptsPerGame': 'Passing Attempts per Game',
  'USFByardsPerPassAttempt': 'Yards per Pass Attempt',
}
export const receivingStats = {
  'USFBreceivingFirstDowns': 'Receiving First Downs',
  'USFBreceivingTouchdowns': 'Receiving Touchdowns',
  'USFBreceivingYards': 'Receiving Yards',
  'USFBreceivingYardsPerGame': 'Receiving Yards per Game',
  'USFBreceivingYardsPerReception': 'Receiving Yards per Reception',
  'USFBreceivingYardsAfterCatch': 'Receiving Yards After Catch',
  'USFBreceivingYardsAfterCatchPerGame': 'Receiving Yards After Catch per Game',
}
export const rushingStats = {
  'USFBrushingAttempts': 'Rushing Attempts',
  'USFBrushingFirstDowns': 'Rushing First Downs',
  'USFBrushingTouchdowns': 'Rushing Touchdowns',
  'USFBrushingYards': 'Rushing Yards',
  'USFBrushingYardsPerGame': 'Rushing Yards per Game',
  'USFByardsPerRushAttempt': 'Yards per Rush Attempt',
}
export const kickingStats = {
  'USFBaverageKickoffYards': 'Average Kickoff Yards',
  'USFBaverageKickoffYardsPerGame': 'Average Kickoff Yards per Game',
  'USFBextraPointAttempts': 'Extra Point Attempts',
  'USFBextraPointAttemptsPerGame': 'Extra Point Attempts per Game',
  'USFBextraPointsMade': 'Extra Points Made',
  'USFBextraPointsMadePerGame': 'Extra Points Made per Game',
  'USFBextraPointPercent': 'Extra Point Percentage',
  'USFBextraPointPercentPerGame': 'Extra Point Percentage per Game',
  'USFBfieldGoalAttempts': 'Field Goal Attempts',
  'USFBfieldGoalAttemptsPerGame': 'Field Goal Attempts per Game',
  'USFBfieldGoalsMade': 'Field Goals Made',
  'USFBfieldGoalsMadePerGame': 'Field Goals Made per Game',
  'USFBfieldGoalPct': 'Field Goal Percentage',
  'USFBfieldGoalPercentPerGame': 'Field Goal Percentage per Game',
  'USFBtouchbacks': 'Touchbacks',
  'USFBtouchbacksPerGame': 'Touchbacks per Game',
  'USFBtouchBackPercentage': 'Touchback Percentage',
}
export const returningStats = {
  'USFBkickReturns': 'Kick Returns',
  'USFBkickReturnsPerGame': 'Kick Returns per Game',
  'USFBkickReturnYards': 'Kick Return Yards',
  'USFBkickReturnYardsPerGame': 'Kick Return Yards per Game',
  'USFBpuntReturns': 'Punt Returns',
  'USFBpuntReturnsPerGame': 'Punt Returns per Game',
  'USFBpuntReturnFairCatchPct': 'Punt Return Fair Catch Percentage',
  'USFBpuntReturnYards': 'Punt Return Yards',
  'USFBpuntReturnYardsPerGame': 'Punt Return Yards per Game',
  'USFByardsPerReturn': 'Yards per Return',
}
export const battingStats = {
  'BSBbattingStrikeouts': 'Batting Strikeouts',
  'BSBrunsBattedIn': 'Runs Batted In',
  'BSBsacrificeHits': 'Sacrifice Hits',
  'BSBHitsTotal': 'Total Hits',
  'BSBwalks': 'Walks',
  'BSBruns': 'Runs',
  'BSBhomeRuns': 'Home Runs',
  'BSBdoubles': 'Doubles',
  'BSBtotalBases': 'Total Bases',
  'BSBextraBaseHits': 'Extra Base Hits',
  'BSBbattingAverage': 'Batting Average',
  'BSBsluggingPercentage': 'Slugging Percentage',
  'BSBonBasePercentage': 'On-Base Percentage',
  'BSBonBasePlusSlugging': 'On-Base Plus Slugging',
  'BSBgroundToFlyRatio': 'Ground to Fly Ratio',
  'BSBatBatsPerHomeRun': 'At-Bats per Home Run',
  'BSBstolenBasePercentage': 'Stolen Base Percentage',
  'BSBbatterWalkToStrikeoutRatio': 'Batter Walk to Strikeout Ratio',
}
export const pitchingStats = {
  'BSBsaves': 'Saves',
  'BSBpitcherStrikeouts': 'Pitcher Strikeouts',
  'BSBhitsGivenUp': 'Hits Given Up',
  'BSBearnedRuns': 'Earned Runs',
  'BSBbattersWalked': 'Batters Walked',
  'BSBrunsAllowed': 'Runs Allowed',
  'BSBhomeRunsAllowed': 'Home Runs Allowed',
  'BSBwins': 'Wins',
  'BSBshutouts': 'Shutouts',
  'BSBearnedRunAverage': 'Earned Run Average',
  'BSBwalksHitsPerInningPitched': 'Walks and Hits per Inning Pitched',
  'BSBwinPct': 'Win Percentage',
  'BSBpitcherCaughtStealingPct': 'Pitcher Caught Stealing Percentage',
  'BSBpitchesPerInning': 'Pitches per Inning',
  'BSBrunSupportAverage': 'Run Support Average',
  'BSBopponentBattingAverage': 'Opponent Batting Average',
  'BSBopponentSlugAverage': 'Opponent Slugging Average',
  'BSBopponentOnBasePct': 'Opponent On-Base Percentage',
  'BSBopponentOnBasePlusSlugging': 'Opponent On-Base Plus Slugging',
  'BSBsavePct': 'Save Percentage',
  'BSBstrikeoutsPerNine': 'Strikeouts per Nine',
  'BSBpitcherStrikeoutToWalkRatio': 'Pitcher Strikeout to Walk Ratio',
}
export const fieldingStats = {
  'BSBdoublePlays': 'Double Plays',
  'BSBerrors': 'Errors',
  'BSBpassedBalls': 'Passed Balls',
  'BSBassists': 'Assists',
  'BSBputouts': 'Putouts',
  'BSBcatcherCaughtStealing': 'Catcher Caught Stealing',
  'BSBcatcherCaughtStealingPct': 'Catcher Caught Stealing Percentage',
  'BSBcatcherStolenBasesAllowed': 'Catcher Stolen Bases Allowed',
  'BSBfieldingPercentage': 'Fielding Percentage',
  'BSBrangeFactor': 'Range Factor',
}
export const penaltyStats = {
  'HKYpimDifferential': 'PIM Differential',
  'HKYpimDifferentialPerGame': 'PIM Differential per Game',
  'HKYtotalPenalties': 'Total Penalties',
  'HKYpenaltiesPerGame': 'Penalties per Game',
  'HKYpenaltyMinutes': 'Penalty Minutes',
  'HKYpenaltyMinutesPerGame': 'Penalty Minutes per Game',
}

export const allStatLabels = {
  'seasonWinLoss': 'Season Win-Loss',
  'homeWinLoss': 'Home Win-Loss',
  'awayWinLoss': 'Away Win-Loss',
  'pointDiff': 'Point Differential',
  'BSKBtotalPoints': 'Total Points',
  'BSKBpointsPerGame': 'Points per Game',
  'BSKBassists': 'Assists',
  'BSKBassistsPerGame': 'Assists per Game',
  'HKYgoals': 'Goals',
  'HKYgoalsPerGame': 'Goals per Game',
  'HKYassists': 'Assists',
  'HKYassistsPerGame': 'Assists per Game',
  'HKYfaceoffs': 'Faceoffs',
  'HKYfaceoffsPerGame': 'Faceoffs per Game',
  'HKYfaceoffsWon': 'Faceoffs Won',
  'HKYfaceoffsWonPerGame': 'Faceoffs Won per Game',
  'HKYfaceoffsLost': 'Faceoffs Lost',
  'HKYfaceoffsLostPerGame': 'Faceoffs Lost per Game',
  'HKYfaceoffPct': 'Faceoff Percentage',
  'HKYfaceoffPctPerGame': 'Faceoff Percentage per Game',
  'USFBtotalFirstDowns': 'Total First Downs',
  'USFBthirdDownEfficiency': 'Third Down Efficiency',
  'USFBpassingYards': 'Passing Yards',
  'USFBreceivingYards': 'Receiving Yards',
  'USFBrushingYards': 'Rushing Yards',
  'USFBsacksPerGame': 'Sacks per Game',
  'USFBfieldGoalsMade': 'Field Goals Made',
  'USFBtotalTouchdowns': 'Total Touchdowns',
  'USFBtouchdownsPerGame': 'Touchdowns per Game',
  'USFBtotalPoints': 'Total Points',
  'USFBpointsPerGame': 'Points per Game',
  'USFBtotalPenyards': 'Total Penalty Yards',
  'USFBaveragePenYardsPerGame': 'Average Penalty Yards per Game',
  'USFBgiveaways': 'Giveaways',
  'USFBtakeaways': 'Takeaways',
  'USFBturnoverDiff': 'Turnover Differential',
  'BSKBassistRatio': 'Assist Ratio',
  'BSKBeffectiveFgPercent': 'Effective Field Goal Percentage',
  'BSKBfieldGoalPercent': 'Field Goal Percentage',
  'BSKBfieldGoalsAttempted': 'Field Goals Attempted',
  'BSKBfieldGoalsMade': 'Field Goals Made',
  'BSKBfieldGoalsPerGame': 'Field Goals per Game',
  'BSKBfreeThrowPercent': 'Free Throw Percentage',
  'BSKBfreeThrowsAttempted': 'Free Throws Attempted',
  'BSKBfreeThrowsMade': 'Free Throws Made',
  'BSKBfreeThrowsMadePerGame': 'Free Throws Made per Game',
  'BSKBoffensiveRebounds': 'Offensive Rebounds',
  'BSKBoffensiveReboundsPerGame': 'Offensive Rebounds per Game',
  'BSKBoffensiveReboundRate': 'Offensive Rebound Rate',
  'BSKBoffensiveTurnovers': 'Offensive Turnovers',
  'BSKBturnoversPerGame': 'Turnovers per Game',
  'BSKBturnoverRatio': 'Turnover Ratio',
  'BSKBthreePointPct': 'Three-Point Percentage',
  'BSKBthreePointsAttempted': 'Three-Point Attempts',
  'BSKBthreePointsMade': 'Three-Point Made',
  'BSKBtrueShootingPct': 'True Shooting Percentage',
  'BSKBpace': 'Pace',
  'BSKBpointsInPaint': 'Points in the Paint',
  'BSKBshootingEfficiency': 'Shooting Efficiency',
  'BSKBscoringEfficiency': 'Scoring Efficiency',
  'HKYshotsIn1st': 'Shots in 1st Period',
  'HKYshotsIn1stPerGame': 'Shots in 1st Period per Game',
  'HKYshotsIn2nd': 'Shots in 2nd Period',
  'HKYshotsIn2ndPerGame': 'Shots in 2nd Period per Game',
  'HKYshotsIn3rd': 'Shots in 3rd Period',
  'HKYshotsIn3rdPerGame': 'Shots in 3rd Period per Game',
  'HKYtotalShots': 'Total Shots',
  'HKYtotalShotsPerGame': 'Total Shots per Game',
  'HKYshotsMissed': 'Shots Missed',
  'HKYshotsMissedPerGame': 'Shots Missed per Game',
  'HKYppgGoals': 'Power Play Goals',
  'HKYppgGoalsPerGame': 'Power Play Goals per Game',
  'HKYppassists': 'Power Play Assists',
  'HKYppassistsPerGame': 'Power Play Assists per Game',
  'HKYpowerplayPct': 'Power Play Percentage',
  'HKYshortHandedGoals': 'Shorthanded Goals',
  'HKYshortHandedGoalsPerGame': 'Shorthanded Goals per Game',
  'HKYshootingPct': 'Shooting Percentage',
  'HKYgiveaways': 'Giveaways',
  'HKYshotDifferential': 'Shot Differential',
  'HKYshotDifferentialPerGame': 'Shot Differential per Game',
  'HKYgoalDifferentialPerGame': 'Goal Differential per Game',
  'BSKBblocks': 'Blocks',
  'BSKBblocksPerGame': 'Blocks per Game',
  'BSKBdefensiveRebounds': 'Defensive Rebounds',
  'BSKBdefensiveReboundsPerGame': 'Defensive Rebounds per Game',
  'BSKBsteals': 'Steals',
  'BSKBstealsPerGame': 'Steals per Game',
  'BSKBreboundRate': 'Rebound Rate',
  'BSKBreboundsPerGame': 'Rebounds per Game',
  'BSKBfoulsPerGame': 'Fouls per Game',
  'BSKBteamAssistToTurnoverRatio': 'Team Assist to Turnover Ratio',
  'HKYgoalsAgainst': 'Goals Against',
  'HKYgoalsAgainstPerGame': 'Goals Against per Game',
  'HKYshotsAgainst': 'Shots Against',
  'HKYshotsAgainstPerGame': 'Shots Against per Game',
  'HKYpenaltyKillPct': 'Penalty Kill Percentage',
  'HKYpenaltyKillPctPerGame': 'Penalty Kill Percentage per Game',
  'HKYppGoalsAgainst': 'Power Play Goals Against',
  'HKYppGoalsAgainstPerGame': 'Power Play Goals Against per Game',
  'HKYshutouts': 'Shutouts',
  'HKYsaves': 'Saves',
  'HKYsavesPerGame': 'Saves per Game',
  'HKYsavePct': 'Save Percentage',
  'HKYblockedShots': 'Blocked Shots',
  'HKYblockedShotsPerGame': 'Blocked Shots per Game',
  'HKYhits': 'Hits',
  'HKYhitsPerGame': 'Hits per Game',
  'HKYtakeaways': 'Takeaways',
  'HKYtakeawaysPerGame': 'Takeaways per Game',
  'USFBtacklesforLoss': 'Tackles for Loss',
  'USFBtacklesforLossPerGame': 'Tackles for Loss per Game',
  'USFBinterceptions': 'Interceptions',
  'USFByardsPerInterception': 'Yards per Interception',
  'USFBsacksTotal': 'Total Sacks',
  'USFBsackYards': 'Sack Yards',
  'USFBsackYardsPerGame': 'Sack Yards per Game',
  'USFBstuffs': 'Stuffs',
  'USFBstuffsPerGame': 'Stuffs per Game',
  'USFBstuffYards': 'Stuff Yards',
  'USFBpassesDefended': 'Passes Defended',
  'USFBpassesDefendedPerGame': 'Passes Defended per Game',
  'USFBsafties': 'Safeties',
  'USFBcompletionPercent': 'Completion Percentage',
  'USFBcompletions': 'Completions',
  'USFBcompletionsPerGame': 'Completions per Game',
  'USFBnetPassingYards': 'Net Passing Yards',
  'USFBnetPassingYardsPerGame': 'Net Passing Yards per Game',
  'USFBpassingFirstDowns': 'Passing First Downs',
  'USFBpassingTouchdowns': 'Passing Touchdowns',
  'USFBpassingYardsPerGame': 'Passing Yards per Game',
  'USFBpassingAttempts': 'Passing Attempts',
  'USFBpassingAttemptsPerGame': 'Passing Attempts per Game',
  'USFByardsPerPassAttempt': 'Yards per Pass Attempt',
  'USFBreceivingFirstDowns': 'Receiving First Downs',
  'USFBreceivingTouchdowns': 'Receiving Touchdowns',
  'USFBreceivingYardsPerGame': 'Receiving Yards per Game',
  'USFBreceivingYardsPerReception': 'Receiving Yards per Reception',
  'USFBreceivingYardsAfterCatch': 'Receiving Yards After Catch',
  'USFBreceivingYardsAfterCatchPerGame': 'Receiving Yards After Catch per Game',
  'USFBrushingAttempts': 'Rushing Attempts',
  'USFBrushingFirstDowns': 'Rushing First Downs',
  'USFBrushingTouchdowns': 'Rushing Touchdowns',
  'USFBrushingYardsPerGame': 'Rushing Yards per Game',
  'USFByardsPerRushAttempt': 'Yards per Rush Attempt',
  'USFBaverageKickoffYards': 'Average Kickoff Yards',
  'USFBaverageKickoffYardsPerGame': 'Average Kickoff Yards per Game',
  'USFBextraPointAttempts': 'Extra Point Attempts',
  'USFBextraPointAttemptsPerGame': 'Extra Point Attempts per Game',
  'USFBextraPointsMade': 'Extra Points Made',
  'USFBextraPointsMadePerGame': 'Extra Points Made per Game',
  'USFBextraPointPercent': 'Extra Point Percentage',
  'USFBextraPointPercentPerGame': 'Extra Point Percentage per Game',
  'USFBfieldGoalAttempts': 'Field Goal Attempts',
  'USFBfieldGoalAttemptsPerGame': 'Field Goal Attempts per Game',
  'USFBfieldGoalsMadePerGame': 'Field Goals Made per Game',
  'USFBfieldGoalPct': 'Field Goal Percentage',
  'USFBfieldGoalPercentPerGame': 'Field Goal Percentage per Game',
  'USFBtouchbacks': 'Touchbacks',
  'USFBtouchbacksPerGame': 'Touchbacks per Game',
  'USFBtouchBackPercentage': 'Touchback Percentage',
  'USFBkickReturns': 'Kick Returns',
  'USFBkickReturnsPerGame': 'Kick Returns per Game',
  'USFBkickReturnYards': 'Kick Return Yards',
  'USFBkickReturnYardsPerGame': 'Kick Return Yards per Game',
  'USFBpuntReturns': 'Punt Returns',
  'USFBpuntReturnsPerGame': 'Punt Returns per Game',
  'USFBpuntReturnFairCatchPct': 'Punt Return Fair Catch Percentage',
  'USFBpuntReturnYards': 'Punt Return Yards',
  'USFBpuntReturnYardsPerGame': 'Punt Return Yards per Game',
  'USFByardsPerReturn': 'Yards per Return',
  'BSBbattingStrikeouts': 'Batting Strikeouts',
  'BSBrunsBattedIn': 'Runs Batted In',
  'BSBsacrificeHits': 'Sacrifice Hits',
  'BSBHitsTotal': 'Total Hits',
  'BSBwalks': 'Walks',
  'BSBruns': 'Runs',
  'BSBhomeRuns': 'Home Runs',
  'BSBdoubles': 'Doubles',
  'BSBtotalBases': 'Total Bases',
  'BSBextraBaseHits': 'Extra Base Hits',
  'BSBbattingAverage': 'Batting Average',
  'BSBsluggingPercentage': 'Slugging Percentage',
  'BSBonBasePercentage': 'On-Base Percentage',
  'BSBonBasePlusSlugging': 'On-Base Plus Slugging',
  'BSBgroundToFlyRatio': 'Ground to Fly Ratio',
  'BSBatBatsPerHomeRun': 'At-Bats per Home Run',
  'BSBstolenBasePercentage': 'Stolen Base %',
  'BSBbatterWalkToStrikeoutRatio': 'Batter Walk to Strikeout Ratio',
  'BSBsaves': 'Saves',
  'BSBpitcherStrikeouts': 'Pitcher Strikeouts',
  'BSBhitsGivenUp': 'Hits Given Up',
  'BSBearnedRuns': 'Earned Runs',
  'BSBbattersWalked': 'Batters Walked',
  'BSBrunsAllowed': 'Runs Allowed',
  'BSBhomeRunsAllowed': 'Home Runs Allowed',
  'BSBwins': 'Wins',
  'BSBshutouts': 'Shutouts',
  'BSBearnedRunAverage': 'Earned Run Average',
  'BSBwalksHitsPerInningPitched': 'Walks and Hits per Inning Pitched',
  'BSBwinPct': 'Win Percentage',
  'BSBpitcherCaughtStealingPct': 'Pitcher Caught Stealing Percentage',
  'BSBpitchesPerInning': 'Pitches per Inning',
  'BSBrunSupportAverage': 'Run Support Average',
  'BSBopponentBattingAverage': 'Opponent Batting Average',
  'BSBopponentSlugAverage': 'Opponent Slugging Average',
  'BSBopponentOnBasePct': 'Opponent On-Base Percentage',
  'BSBopponentOnBasePlusSlugging': 'Opponent On-Base Plus Slugging',
  'BSBsavePct': 'Save Percentage',
  'BSBstrikeoutsPerNine': 'Strikeouts per Nine',
  'BSBpitcherStrikeoutToWalkRatio': 'Pitcher Strikeout to Walk Ratio',
  'BSBdoublePlays': 'Double Plays',
  'BSBerrors': 'Errors',
  'BSBpassedBalls': 'Passed Balls',
  'BSBassists': 'Assists',
  'BSBputouts': 'Putouts',
  'BSBcatcherCaughtStealing': 'Catcher Caught Stealing',
  'BSBcatcherCaughtStealingPct': 'Catcher Caught Stealing Percentage',
  'BSBcatcherStolenBasesAllowed': 'Catcher Stolen Bases Allowed',
  'BSBfieldingPercentage': 'Fielding Percentage',
  'BSBrangeFactor': 'Range Factor',
  'HKYpimDifferential': 'PIM Differential',
  'HKYpimDifferentialPerGame': 'PIM Differential per Game',
  'HKYtotalPenalties': 'Total Penalties',
  'HKYpenaltiesPerGame': 'Penalties per Game',
  'HKYpenaltyMinutes': 'Penalty Minutes',
  'HKYpenaltyMinutesPerGame': 'Penalty Minutes per Game',
}

export const allStatLabelsShort = {
  'offense': 'Offense',
  'defense': 'Defense',
  'penalty': 'Penalty',
  'passing': 'Passing',
  'rushing': 'Rushing',
  'recieving': 'Recieving',
  'returning': 'Returning',
  'kicking': 'Kicking',
  'defense': 'Defense',
  'other': 'Other',
  'batting': 'Batting',
  'pitching': 'Pitching',
  'fielding': 'Fielding',
  'general': 'General',
  'seasonWinLoss': 'Wins',
  'homeWinLoss': 'Home Wins',
  'awayWinLoss': 'Away Wins',
  'pointDiff': 'Point Diff',
  'BSKBtotalPoints': 'Total Points',
  'BSKBpointsPerGame': 'Pts per Game',
  'BSKBassists': 'Assists',
  'BSKBassistsPerGame': 'Assists/G',
  'HKYgoals': 'Goals',
  'HKYgoalsPerGame': 'Goals/G',
  'HKYassists': 'Assists',
  'HKYassistsPerGame': 'Assists/G',
  'HKYfaceoffs': 'Faceoffs',
  'HKYfaceoffsPerGame': 'Faceoffs/G',
  'HKYfaceoffsWon': 'Faceoffs Won',
  'HKYfaceoffsWonPerGame': 'Faceoffs Won/G',
  'HKYfaceoffsLost': 'Faceoffs Lost',
  'HKYfaceoffsLostPerGame': 'Faceoffs Lost/G',
  'HKYfaceoffPct': 'Faceoff %',
  'HKYfaceoffPctPerGame': 'Faceoff %/G',
  'USFBtotalFirstDowns': 'Total First Downs',
  'USFBthirdDownEfficiency': '3rd Down Eff.',
  'USFBpassingYards': 'Passing Yds',
  'USFBreceivingYards': 'Receiving Yds',
  'USFBrushingYards': 'Rushing Yds',
  'USFBsacksPerGame': 'Sacks/G',
  'USFBfieldGoalsMade': 'FG Made',
  'USFBtotalTouchdowns': 'Total TDs',
  'USFBtouchdownsPerGame': 'TDs/G',
  'USFBtotalPoints': 'Total Points',
  'USFBpointsPerGame': 'Pts/G',
  'USFBtotalPenyards': 'Total Pen Yds',
  'USFBaveragePenYardsPerGame': 'Avg Pen Yds/G',
  'USFBgiveaways': 'Giveaways',
  'USFBtakeaways': 'Takeaways',
  'USFBturnoverDiff': 'TO Diff',
  'BSKBassistRatio': 'Assist Ratio',
  'BSKBeffectiveFgPercent': 'Eff FG %',
  'BSKBfieldGoalPercent': 'FG %',
  'BSKBfieldGoalsAttempted': 'FG Att',
  'BSKBfieldGoalsMade': 'FG Made',
  'BSKBfieldGoalsPerGame': 'FG/G',
  'BSKBfreeThrowPercent': 'FT %',
  'BSKBfreeThrowsAttempted': 'FT Att',
  'BSKBfreeThrowsMade': 'FT Made',
  'BSKBfreeThrowsMadePerGame': 'FT Made/G',
  'BSKBoffensiveRebounds': 'Off Rebs',
  'BSKBoffensiveReboundsPerGame': 'Off Rebs/G',
  'BSKBoffensiveReboundRate': 'Off Reb Rate',
  'BSKBoffensiveTurnovers': 'Off TOs',
  'BSKBturnoversPerGame': 'TOs/G',
  'BSKBturnoverRatio': 'TO Ratio',
  'BSKBthreePointPct': '3PT %',
  'BSKBthreePointsAttempted': '3PT Att',
  'BSKBthreePointsMade': '3PT Made',
  'BSKBtrueShootingPct': 'TS %',
  'BSKBpace': 'Pace',
  'BSKBpointsInPaint': 'Pts in Paint',
  'BSKBshootingEfficiency': 'Shoot Eff.',
  'BSKBscoringEfficiency': 'Score Eff.',
  'HKYshotsIn1st': '1st Period Shots',
  'HKYshotsIn1stPerGame': '1st Period Shots/G',
  'HKYshotsIn2nd': '2nd Period Shots',
  'HKYshotsIn2ndPerGame': '2nd Period Shots/G',
  'HKYshotsIn3rd': '3rd Period Shots',
  'HKYshotsIn3rdPerGame': '3rd Period Shots/G',
  'HKYtotalShots': 'Total Shots',
  'HKYtotalShotsPerGame': 'Shots/G',
  'HKYshotsMissed': 'Shots Missed',
  'HKYshotsMissedPerGame': 'Shots Missed/G',
  'HKYppgGoals': 'PP Goals',
  'HKYppgGoalsPerGame': 'PP Goals/G',
  'HKYppassists': 'PP Assists',
  'HKYppassistsPerGame': 'PP Assists/G',
  'HKYpowerplayPct': 'PP %',
  'HKYshortHandedGoals': 'SH Goals',
  'HKYshortHandedGoalsPerGame': 'SH Goals/G',
  'HKYshootingPct': 'Shoot %',
  'HKYgiveaways': 'Giveaways',
  'HKYshotDifferential': 'Shot Diff',
  'HKYshotDifferentialPerGame': 'Shot Diff/G',
  'HKYgoalDifferentialPerGame': 'Goal Diff/G',
  'BSKBblocks': 'Blocks',
  'BSKBblocksPerGame': 'Blocks/G',
  'BSKBdefensiveRebounds': 'Def Rebs',
  'BSKBdefensiveReboundsPerGame': 'Def Rebs/G',
  'BSKBsteals': 'Steals',
  'BSKBstealsPerGame': 'Steals/G',
  'BSKBreboundRate': 'Reb Rate',
  'BSKBreboundsPerGame': 'Rebs/G',
  'BSKBfoulsPerGame': 'Fouls/G',
  'BSKBteamAssistToTurnoverRatio': 'Assist/TO',
  'HKYgoalsAgainst': 'GA',
  'HKYgoalsAgainstPerGame': 'GA/G',
  'HKYshotsAgainst': 'Shots Against',
  'HKYshotsAgainstPerGame': 'Shots Against/G',
  'HKYpenaltyKillPct': 'PK %',
  'HKYpenaltyKillPctPerGame': 'PK %/G',
  'HKYppGoalsAgainst': 'PP GA',
  'HKYppGoalsAgainstPerGame': 'PP GA/G',
  'HKYshutouts': 'Shutouts',
  'HKYsaves': 'Saves',
  'HKYsavesPerGame': 'Saves/G',
  'HKYsavePct': 'Save %',
  'HKYblockedShots': 'Blocked Shots',
  'HKYblockedShotsPerGame': 'Blocked Shots/G',
  'HKYhits': 'Hits',
  'HKYhitsPerGame': 'Hits/G',
  'HKYtakeaways': 'Takeaways',
  'HKYtakeawaysPerGame': 'Takeaways/G',
  'USFBtacklesforLoss': 'TFL',
  'USFBtacklesforLossPerGame': 'TFL/G',
  'USFBinterceptions': 'INTs',
  'USFByardsPerInterception': 'Yds/INT',
  'USFBsacksTotal': 'Total Sacks',
  'USFBsackYards': 'Sack Yds',
  'USFBsackYardsPerGame': 'Sack Yds/G',
  'USFBstuffs': 'Stuffs',
  'USFBstuffsPerGame': 'Stuffs/G',
  'USFBstuffYards': 'Stuff Yds',
  'USFBpassesDefended': 'PD',
  'USFBpassesDefendedPerGame': 'PD/G',
  'USFBsafties': 'Safeties',
  'USFBcompletionPercent': 'Comp %',
  'USFBcompletions': 'Completions',
  'USFBcompletionsPerGame': 'Completions/G',
  'USFBnetPassingYards': 'Net Pass Yds',
  'USFBnetPassingYardsPerGame': 'Net Pass Yds/G',
  'USFBpassingFirstDowns': 'Pass FD',
  'USFBpassingTouchdowns': 'Pass TDs',
  'USFBpassingYardsPerGame': 'Pass Yds/G',
  'USFBpassingAttempts': 'Pass Att',
  'USFBpassingAttemptsPerGame': 'Pass Att/G',
  'USFByardsPerPassAttempt': 'Yds/Pass Att',
  'USFBreceivingFirstDowns': 'Rec FD',
  'USFBreceivingTouchdowns': 'Rec TDs',
  'USFBreceivingYardsPerGame': 'Rec Yds/G',
  'USFBreceivingYardsPerReception': 'Rec Yds/Rec',
  'USFBreceivingYardsAfterCatch': 'YAC Yds',
  'USFBreceivingYardsAfterCatchPerGame': 'YAC Yds/G',
  'USFBrushingAttempts': 'Rush Att',
  'USFBrushingFirstDowns': 'Rush FD',
  'USFBrushingTouchdowns': 'Rush TDs',
  'USFBrushingYardsPerGame': 'Rush Yds/G',
  'USFByardsPerRushAttempt': 'Yds/Rush',
  'USFBaverageKickoffYards': 'Avg KO Yds',
  'USFBaverageKickoffYardsPerGame': 'Avg KO Yds/G',
  'USFBextraPointAttempts': 'XP Att',
  'USFBextraPointAttemptsPerGame': 'XP Att/G',
  'USFBextraPointsMade': 'XP Made',
  'USFBextraPointsMadePerGame': 'XP Made/G',
  'USFBextraPointPercent': 'XP %',
  'USFBextraPointPercentPerGame': 'XP %/G',
  'USFBfieldGoalAttempts': 'FG Att',
  'USFBfieldGoalAttemptsPerGame': 'FG Att/G',
  'USFBfieldGoalsMadePerGame': 'FG Made/G',
  'USFBfieldGoalPct': 'FG %',
  'USFBfieldGoalPercentPerGame': 'FG %/G',
  'USFBtouchbacks': 'Touchbacks',
  'USFBtouchbacksPerGame': 'Touchbacks/G',
  'USFBtouchBackPercentage': 'TB %',
  'USFBkickReturns': 'Kick Returns',
  'USFBkickReturnsPerGame': 'Kick Returns/G',
  'USFBkickReturnYards': 'KR Yds',
  'USFBkickReturnYardsPerGame': 'KR Yds/G',
  'USFBpuntReturns': 'Punt Returns',
  'USFBpuntReturnsPerGame': 'Punt Returns/G',
  'USFBpuntReturnFairCatchPct': 'PR Fair Catch %',
  'USFBpuntReturnYards': 'PR Yds',
  'USFBpuntReturnYardsPerGame': 'PR Yds/G',
  'USFByardsPerReturn': 'Yds/Return',
  'BSBbattingStrikeouts': 'Batter K\'s',
  'BSBrunsBattedIn': 'RBIs',
  'BSBsacrificeHits': 'Sac Hits',
  'BSBHitsTotal': 'Hits',
  'BSBwalks': 'Walks',
  'BSBruns': 'Runs',
  'BSBhomeRuns': 'HRs',
  'BSBdoubles': '2B',
  'BSBtotalBases': 'TB',
  'BSBextraBaseHits': 'XBH',
  'BSBbattingAverage': 'Avg',
  'BSBsluggingPercentage': 'SLG',
  'BSBonBasePercentage': 'OBP',
  'BSBonBasePlusSlugging': 'OPS',
  'BSBgroundToFlyRatio': 'GB/FB Ratio',
  'BSBatBatsPerHomeRun': 'AB/HR',
  'BSBstolenBasePercentage': 'SB %',
  'BSBbatterWalkToStrikeoutRatio': 'BB/K Ratio',
  'BSBsaves': 'Saves',
  'BSBpitcherStrikeouts': 'K\'s',
  'BSBhitsGivenUp': 'Hits Allowed',
  'BSBearnedRuns': 'ERs',
  'BSBbattersWalked': 'BBs',
  'BSBrunsAllowed': 'Runs Allowed',
  'BSBhomeRunsAllowed': 'HR Allowed',
  'BSBwins': 'Wins',
  'BSBshutouts': 'S/Os',
  'BSBearnedRunAverage': 'ERA',
  'BSBwalksHitsPerInningPitched': 'WHIP',
  'BSBwinPct': 'Win %',
  'BSBpitcherCaughtStealingPct': 'CS %',
  'BSBpitchesPerInning': 'Pitches/Inning',
  'BSBrunSupportAverage': 'RS Avg',
  'BSBopponentBattingAverage': 'Opponent Avg',
  'BSBopponentSlugAverage': 'Opponent SLG',
  'BSBopponentOnBasePct': 'Opponent OBP',
  'BSBopponentOnBasePlusSlugging': 'Opponent OPS',
  'BSBsavePct': 'Save %',
  'BSBstrikeoutsPerNine': 'K/9',
  'BSBpitcherStrikeoutToWalkRatio': 'K/BB Ratio',
  'BSBdoublePlays': 'DPs',
  'BSBerrors': 'Errors',
  'BSBpassedBalls': 'PBs',
  'BSBassists': 'Assists',
  'BSBputouts': 'Putouts',
  'BSBcatcherCaughtStealing': 'Catcher CS',
  'BSBcatcherCaughtStealingPct': 'Catcher CS %',
  'BSBcatcherStolenBasesAllowed': 'SBA',
  'BSBfieldingPercentage': 'Fld %',
  'BSBrangeFactor': 'Range Factor',
  'HKYpimDifferential': 'PIM Diff',
  'HKYpimDifferentialPerGame': 'PIM Diff/G',
  'HKYtotalPenalties': 'Total Penalties',
  'HKYpenaltiesPerGame': 'Penalties/G',
  'HKYpenaltyMinutes': 'PIM',
  'HKYpenaltyMinutesPerGame': 'PIM/G',
}


export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

// Helper function to format Date as 'YYYY-MM-DD'
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate the index difference
export const indexCondition = (game, indexDifSmall, indexDiffRange) => {

  const indexDiff = game.predictedWinner === 'home'
    ? game.homeTeamScaledIndex - game.awayTeamScaledIndex
    : game.awayTeamScaledIndex - game.homeTeamScaledIndex;
  return indexDiff >= indexDifSmall && (indexDiff <= (indexDifSmall + indexDiffRange));
};

export const strengthCondition = (game, confidenceLow, confidenceRange) => {
  return game.predictionConfidence > confidenceLow && game.predictionConfidence < (confidenceLow + confidenceRange);
};

export const probabilityCondition = (o, game, sportsbook) => {
  return (o.impliedProbability * 100) < (game.winPercent)
};



// You can also combine them into a single condition
export const combinedCondition = (game, o, indexDifSmall, indexDiffRange, confidenceLow, confidenceRange, sportsbook) => {

  return indexCondition(game, indexDifSmall, indexDiffRange)
    && strengthCondition(game, confidenceLow, confidenceRange)
    && probabilityCondition(o, game, sportsbook)


};

export const combinedCloseCondition = (game, o, indexDifSmall, indexDiffRange, confidenceLow, confidenceRange, sportsbook) => {

  const conditionCount = [
    probabilityCondition(o, game, sportsbook),
    indexCondition(game, indexDifSmall, indexDiffRange),
    strengthCondition(game, confidenceLow, confidenceRange)
  ].filter(Boolean).length;

  return conditionCount == 2;

};

export const evCondition = (o, game, sportsbook, minEV = 0, customProb = null) => {
  // Use custom probability if provided
  const pModel = customProb ?? game.predictionConfidence;

  // Convert American odds to decimal odds if needed
  let odds = o.price ?? o.odds;
  if (odds > 0 && odds < 1000 || odds < 0 && odds > -1000) {
    odds = odds > 0 ? 1 + odds / 100 : 1 - 100 / odds;
  }

  const EV = (pModel * odds) - 1;
  return EV
};

export const sportConfidenceBucketMap = {
  "americanfootball_nfl": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '9-1',
      correspondingStrat: 'kelly-.1'
    },
  ],
  "americanfootball_ncaaf": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.9-1',
      correspondingStrat: 'kelly-1'
    },
  ],
  "basketball_nba": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '9-1',
      correspondingStrat: 'kelly-1'
    },
  ],
  "basketball_ncaab": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '9-1',
      correspondingStrat: 'kelly-1'
    },
  ],
  "basketball_wncaab": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-.1'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-1'
    },
    {
      valueBucket: '9-1',
      correspondingStrat: 'kelly-1'
    },
  ],
  "icehockey_nhl": [
    {
      valueBucket: '0-.1',
      correspondingStrat: 'flat'
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: 'kelly-0'
    },
    {
      valueBucket: '9-1',
      correspondingStrat: 'kelly-0'
    },
  ],
  "baseball_mlb": [
    {
      valueBucket: '0-.1',
      correspondingStrat: ''
    },
    {
      valueBucket: '.1-.2',
      correspondingStrat: ''
    },
    {
      valueBucket: '.2-.3',
      correspondingStrat: ''
    },
    {
      valueBucket: '.3-.4',
      correspondingStrat: ''
    },
    {
      valueBucket: '.4-.5',
      correspondingStrat: ''
    },
    {
      valueBucket: '.5-.6',
      correspondingStrat: ''
    },
    {
      valueBucket: '.6-.7',
      correspondingStrat: ''
    },
    {
      valueBucket: '.7-.8',
      correspondingStrat: ''
    },
    {
      valueBucket: '.8-.9',
      correspondingStrat: ''
    },
    {
      valueBucket: '9-1',
      correspondingStrat: ''
    },
  ]
};

// Profitable confidence buckets per sport
export const PROFITABLE_CONFIDENCE_BUCKETS = {
  americanfootball_nfl: .83,
  basketball_wncaab: .5,
  americanfootball_ncaaf:  .5,
  icehockey_nhl: 1,
  basketball_nba:  .9,
  basketball_ncaab: .9,

};

// Check if a game passes the gate
export const passesGate = (game, outcome) => {

};



export const valueBetConditionCheck = (sports, game, sportsbook, market) => {
  let gameSport = sports.find((sport) => sport.name === game.sport_key)

  const bookmaker = game.bookmakers?.find(b => b.key === sportsbook);
  if (!bookmaker) return false;

  const marketData = bookmaker.markets?.find(m => m.key === market);
  if (!marketData) return false;

  // H2H (Moneyline)
  if (market === 'h2h') {
    if (!marketData) return false

    const outcome = marketData.outcomes.find((o) => {
      return o.name === (game.predictedWinner == 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName)
    })

    if (!outcome || !gameSport) return false
    const edge = game.predictionConfidence - outcome.impliedProbability

    const EV = (game.predictionConfidence * calculateProfitFromUSOdds(outcome.price, 1)) - (outcome.impliedProbability * 1)

    return calculateProfitFromUSOdds(outcome.price, .09) > .01
    // &&  edge > gameSport.threshold
    // &&  edge >= PROFITABLE_CONFIDENCE_BUCKETS[gameSport.name]
    //   
    && game.value_score >= PROFITABLE_CONFIDENCE_BUCKETS[gameSport.name]

  }

  // FUTURE: add similar logic for 'totals' using over/under probability
  return false;
};



export const valueBetConditionCloseCheck = (sports, game, sportsbook) => {
  const bookmaker = game.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
  if (bookmaker) {
    const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');

    let outcome = marketData?.outcomes?.find(o => {
      return o.name === (game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName)
    });

    if (outcome) {
      let currentSport = sports.find(arraySport => arraySport.name === game.sport_key)
      let sportSettings = currentSport?.valueBetSettings.find((setting) => setting.bookmaker === sportsbook)
      if (sportSettings !== undefined) {
        return combinedCloseCondition(game, outcome, sportSettings.indexDiffSmall, sportSettings.indexDiffRange, sportSettings.confidenceSmall, sportSettings.confidenceRange, sportsbook)
      }

    }
  }
}

export const calculateProfitFromImpliedProb = (impliedProb, stake) => {

  const decimalOdds = (1 / impliedProb) + 1;
  const profit = (stake * decimalOdds) - stake;
  return profit;
}

export const calculateProfitFromUSOdds = (odds, stake) => {
  let profit;
  if (odds > 0) {
    profit = (odds / 100) * stake;
  } else {
    profit = (100 / Math.abs(odds)) * stake;
  }
  return profit;
}

// Utility to calculate contrast ratio between two luminances
export const getLuminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const getContrastRatio = (bgColor, fgColor = [255, 255, 255]) => {
  const L1 = getLuminance(...bgColor);
  const L2 = getLuminance(...fgColor);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
};



export const getColorForIndex = (index, total = 45) => {
  const hue = (index / total) * 120; // Evenly distribute hues
  let saturation = 85;
  let lightness = 25;

  // Slight variation to make colors distinct
  saturation += (index % 4) * 3;
  lightness += (index % 3) * 3;

  // Make sure lightness isn't too bright for white text
  let rgb = hslToRgb(hue, saturation, lightness);
  let contrast = getContrastRatio(rgb);

  // Reduce lightness until contrast is sufficient
  while (contrast < 4.5 && lightness > 10) {
    lightness -= 2;
    rgb = hslToRgb(hue, saturation, lightness);
    contrast = getContrastRatio(rgb);
  }

  return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
};




export const formatMinutesToHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const getNumericStat = (stats, statName) => {
  if (!stats || stats[statName] === undefined) return 0;

  if (statName === 'seasonWinLoss') {
    const [wins, losses] = stats[statName].split("-").map(Number);
    return wins;
  }

  if (statName === 'homeWinLoss' || statName === 'awayWinLoss') {
    const [wins, losses] = stats[statName].split("-").map(Number);
    return wins;
  }

  return stats[statName];
};

export function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  // Support shorthand (#f00)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) {
    throw new Error('Invalid hex color');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
}


// Step 1: RGB to XYZ
function rgbToXyz([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;

  // Gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  // Convert to XYZ
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return [x, y, z];
}

// Step 2: XYZ to LAB
function xyzToLab([x, y, z]) {
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  x /= refX;
  y /= refY;
  z /= refZ;

  x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
  y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
  z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;

  const L = (116 * y) - 16;
  const A = 500 * (x - y);
  const B = 200 * (y - z);

  return [L, A, B];
}

// Step 3: Delta E (CIE76)
function deltaE(lab1, lab2) {
  const [L1, A1, B1] = lab1;
  const [L2, A2, B2] = lab2;
  return Math.sqrt(
    Math.pow(L1 - L2, 2) +
    Math.pow(A1 - A2, 2) +
    Math.pow(B1 - B2, 2)
  );
}

// Utility to check similarity
export function areColorsTooSimilar(hex1, hex2, threshold = 50) {
  const lab1 = xyzToLab(rgbToXyz(hexToRgb(`#${hex1}`)));
  const lab2 = xyzToLab(rgbToXyz(hexToRgb(`#${hex2}`)));
  return deltaE(lab1, lab2) < threshold;
}

// Convert American odds to Decimal
function americanToDecimal(odds) {
  if (odds > 0) {
    return (odds / 100) + 1;
  } else {
    return (100 / Math.abs(odds)) + 1;
  }
}

// Convert Decimal odds to American
function decimalToAmerican(decimalOdds) {
  if (decimalOdds >= 2.0) {
    return Math.round((decimalOdds - 1) * 100);
  } else {
    return Math.round(-100 / (decimalOdds - 1));
  }
}

export function calculateParlayOdds(americanOddsArray) {
  const decimalOdds = americanOddsArray.map(americanToDecimal);
  const parlayDecimal = decimalOdds.reduce((acc, val) => acc * val, 1);
  const parlayAmerican = decimalToAmerican(parlayDecimal);

  return {
    decimal: parlayDecimal.toFixed(2),
    american: parlayAmerican
  };
}