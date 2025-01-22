export const sports = [
  { name: "americanfootball_nfl", espnSport: 'football', league: 'nfl', startMonth: 9, endMonth: 2, multiYear: true, statYear: 2024, decayFactor: 0.95 },
  { name: "basketball_nba", espnSport: 'basketball', league: 'nba', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
  { name: "icehockey_nhl", espnSport: 'hockey', league: 'nhl', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, prevstatYear: 2024, decayFactor: 0.85 },
  { name: "baseball_mlb", espnSport: 'baseball', league: 'mlb', startMonth: 3, endMonth: 10, multiYear: false, statYear: 2024, decayFactor: 0.75 },
  { name: "americanfootball_ncaaf", espnSport: 'football', league: 'ncaaf', startMonth: 9, endMonth: 1, multiYear: true, statYear: 2024, decayFactor: 0.90 },
  { name: "basketball_ncaab", espnSport: 'basketball', league: 'NCAAB', startMonth: 11, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
  { name: "basketball_wncaab", espnSport: 'basketball', league: 'WNCAAB', startMonth: 11, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
]

export const generalStats ={
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
export const offenseStats ={
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
export const defenseStats ={
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
export const passingStats ={
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
export const receivingStats ={
  'USFBreceivingFirstDowns': 'Receiving First Downs',
  'USFBreceivingTouchdowns': 'Receiving Touchdowns',
  'USFBreceivingYards': 'Receiving Yards',
  'USFBreceivingYardsPerGame': 'Receiving Yards per Game',
  'USFBreceivingYardsPerReception': 'Receiving Yards per Reception',
  'USFBreceivingYardsAfterCatch': 'Receiving Yards After Catch',
  'USFBreceivingYardsAfterCatchPerGame': 'Receiving Yards After Catch per Game',
}
export const rushingStats ={
  'USFBrushingAttempts': 'Rushing Attempts',
  'USFBrushingFirstDowns': 'Rushing First Downs',
  'USFBrushingTouchdowns': 'Rushing Touchdowns',
  'USFBrushingYards': 'Rushing Yards',
  'USFBrushingYardsPerGame': 'Rushing Yards per Game',
  'USFByardsPerRushAttempt': 'Yards per Rush Attempt',
}
export const kickingStats ={
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
export const returningStats ={
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
export const battingStats ={
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
export const pitchingStats ={
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
export const fieldingStats ={
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
export const penaltyStats ={
  'HKYpimDifferential': 'PIM Differential',
  'HKYpimDifferentialPerGame': 'PIM Differential per Game',
  'HKYtotalPenalties': 'Total Penalties',
  'HKYpenaltiesPerGame': 'Penalties per Game',
  'HKYpenaltyMinutes': 'Penalty Minutes',
  'HKYpenaltyMinutesPerGame': 'Penalty Minutes per Game',
}


export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

  // Helper function to format Date as 'YYYY-MM-DD'
export  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
