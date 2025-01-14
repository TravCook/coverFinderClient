export const sports = [
  { name: "americanfootball_nfl", espnSport: 'football', league: 'nfl', startMonth: 9, endMonth: 2, multiYear: true, statYear: 2024, decayFactor: 0.95 },
  { name: "basketball_nba", espnSport: 'basketball', league: 'nba', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
  { name: "icehockey_nhl", espnSport: 'hockey', league: 'nhl', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, prevstatYear: 2024, decayFactor: 0.85 },
  { name: "baseball_mlb", espnSport: 'baseball', league: 'mlb', startMonth: 3, endMonth: 10, multiYear: false, statYear: 2024, decayFactor: 0.75 },
  { name: "americanfootball_ncaaf", espnSport: 'football', league: 'ncaaf', startMonth: 9, endMonth: 1, multiYear: true, statYear: 2024, decayFactor: 0.90 },
  { name: "basketball_ncaab", espnSport: 'basketball', league: 'NCAAB', startMonth: 11, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
  { name: "basketball_wncaab", espnSport: 'basketball', league: 'womens-college-basketball', startMonth: 11, endMonth: 4, multiYear: true, statYear: 2025, decayFactor: 0.85 },
]

export const statLabels = {
  'seasonWinLoss': 'Season Win-Loss Record',
  'homeWinLoss': 'Home Win-Loss Record',
  'awayWinLoss': 'Away Win-Loss Record',
  'pointDiff': 'Point Differential',
  'PointsTotal': 'Total Points',
  'pointsPergame': 'Points per Game',
  'effectiveFieldGoalPct': 'Effective Field Goal Percentage',
  'fieldGoalMakesperAttempts': 'Field Goals Made per Attempt',
  'freeThrowsMadeperAttemps': 'Free Throws Made per Attempt',
  'freeThrowPct': 'Free Throw Percentage',
  'threePointPct': '3-Point Percentage',
  'trueShootingPct': 'True Shooting Percentage',
  'pointsinPaint': 'Points in the Paint',
  'pace': 'Pace (Possessions per Game)',
  'pointsPerGame': 'Points per Game',
  'totalPoints': 'Total Points Scored',
  'totalFirstDowns': 'Total First Downs',
  'rushingFirstDowns': 'Rushing First Downs',
  'passingFirstDowns': 'Passing First Downs',
  'thirdDownEfficiency': 'Third Down Efficiency',
  'netPassingYardsPerGame': 'Net Passing Yards per Game',
  'interceptions': 'Interceptions',
  'completionPercent': 'Completion Percentage',
  'rushingYards': 'Total Rushing Yards',
  'rushingYardsPerGame': 'Rushing Yards per Game',
  'yardsPerRushAttempt': 'Yards per Rush Attempt',
  'yardsPerGame': 'Yards per Game',
  'fGgoodPct': 'Field Goal Good Percentage',
  'touchBackPercentage': 'Touchback Percentage',
  'strikeoutsTotal': 'Total Strikeouts',
  'rBIsTotal': 'Total RBIs',
  'hitsTotal': 'Total Hits',
  'stolenBasesTotal': 'Total Stolen Bases',
  'walksTotal': 'Total Walks',
  'runsTotal': 'Total Runs Scored',
  'homeRunsTotal': 'Total Home Runs',
  'totalBases': 'Total Bases',
  'extraBaseHitsTotal': 'Total Extra Base Hits',
  'battingAverageTotal': 'Batting Average',
  'sluggingPercentage': 'Slugging Percentage',
  'onBasePercent': 'On-Base Percentage',
  'onBasePlusSlugging': 'On-Base Plus Slugging (OPS)',
  'stolenBasePct': 'Stolen Base Percentage',
  'walkToStrikeoutRatio': 'Walk-to-Strikeout Ratio',
  'goals': 'Total Goals',
  'goalsPerGame': 'Goals per Game',
  'assists': 'Total Assists',
  'assistsPerGame': 'Assists per Game',
  'totalShotsTaken': 'Total Shots Taken',
  'shotsTakenPerGame': 'Shots Taken per Game',
  'powerPlayGoals': 'Power Play Goals',
  'powerPlayGoalsPerGame': 'Power Play Goals per Game',
  'powerPlayPct': 'Power Play Percentage',
  'shootingPct': 'Shooting Percentage',
  'faceoffsWon': 'Faceoffs Won',
  'faceoffsWonPerGame': 'Faceoffs Won per Game',
  'faceoffPercent': 'Faceoff Percentage',
  'giveaways': 'Giveaways',
  // OFFENSE
  'ReboundsTotal': 'Total Rebounds',
  'defensiveRebounds': 'Defensive Rebounds',
  'defensiveReboundsperGame': 'Defensive Rebounds per Game',
  'offensiveRebounds': 'Offensive Rebounds',
  'offensiveReboundsperGame': 'Offensive Rebounds per Game',
  'blocksTotal': 'Total Blocks',
  'blocksPerGame': 'Blocks per Game',
  'steals': 'Total Steals',
  'stealsperGame': 'Steals per Game',
  'totalTurnovers': 'Total Turnovers',
  'averageTurnovers': 'Average Turnovers per Game',
  'turnoverRatio': 'Turnover Ratio',
  'assisttoTurnoverRatio': 'Assist to Turnover Ratio',
  'totalPenyards': 'Total Penalty Yards',
  'averagePenYardsPerGame': 'Average Penalty Yards per Game',
  'giveaways': 'Giveaways',
  'takeaways': 'Takeaways',
  'turnoverDiff': 'Turnover Differential',
  'sacksTotal': 'Total Sacks',
  'sacksPerGame': 'Sacks per Game',
  'yardsLostPerSack': 'Yards Lost per Sack',
  'passesDefended': 'Passes Defended',
  'passesDefendedPerGame': 'Passes Defended per Game',
  'tacklesforLoss': 'Tackles for Loss',
  'tacklesforLossPerGame': 'Tackles for Loss per Game',
  'saves': 'Total Saves',
  'strikeoutsPitchingTotal': 'Total Pitching Strikeouts',
  'walksPitchingTotal': 'Total Pitching Walks',
  'qualityStarts': 'Quality Starts',
  'earnedRunAverage': 'Earned Run Average (ERA)',
  'walksHitsPerInningPitched': 'Walks + Hits per Inning Pitched (WHIP)',
  'groundToFlyRatio': 'Ground to Fly Ratio',
  'runSupportAverage': 'Run Support Average',
  'oppBattingAverage': 'Opponent Batting Average',
  'oppSlugging': 'Opponent Slugging Percentage',
  'oppOPS': 'Opponent OPS (On-Base Plus Slugging)',
  'savePct': 'Save Percentage',
  'strikeoutPerNine': 'Strikeouts per Nine Innings',
  'strikeoutToWalkRatioPitcher': 'Strikeout-to-Walk Ratio (Pitching)',
  'doublePlays': 'Double Plays',
  'fieldingErrors': 'Fielding Errors',
  'fieldingPercentage': 'Fielding Percentage',
  'penaltyMinutes': 'Total Penalty Minutes',
  'penaltyMinutesPerGame': 'Penalty Minutes per Game',
  'goalsAgainst': 'Goals Against',
  'goalsAgainstAverage': 'Goals Against Average',
  'shotsAgainst': 'Shots Against',
  'shotsAgainstPerGame': 'Shots Against per Game',
  'shotsBlocked': 'Total Shots Blocked',
  'shotsBlockedPerGame': 'Shots Blocked per Game',
  'penaltyKillPct': 'Penalty Kill Percentage',
  'totalSaves': 'Total Saves (Goalkeeper)',
  'savePerGame': 'Saves per Game',
  'savePct': 'Save Percentage (Goalkeeper)',
  'takeaways': 'Takeaways',
  // DEFENSE
};