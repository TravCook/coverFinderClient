export async function teamRecordSearch(sport, league, team) {
  const data = await fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/record?lang=en&region=us`)
  const dataJSON = await data.json()
  return dataJSON
}

export async function teamStatsSearch(sport, league, team) {
  const data = await fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/statistics?lang=en&region=us`)
  const dataJSON = await data.json()
  return dataJSON
}

