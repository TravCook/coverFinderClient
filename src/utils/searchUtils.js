import moment from 'moment'

let today = new Date(Date.now())
let startDate = moment(today).format('YYYYMMDD')
let endDate = moment(today.setDate(today.getDate() + 2)).format('YYYYMMDD')

export async function genAmericanFootballScores() {
  const data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
  const dataJSON = await data.json()
  console.log(dataJSON)
  return dataJSON
}

export function genFootballScores() {
  fetch(`http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${startDate}-${endDate}`)
    .then((res) =>
      res.json()
    ).then((data) => {
      console.log('Football Scores')
      console.log(data)
    })
}

export function genBaseballScores() {
  fetch(`https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${startDate}-${endDate}`)
    .then((res) =>
      res.json()
    ).then((data) => {
      console.log('Baseball Scores')
      console.log(data)
    })
}

export async function genBasketballScores() {
  const data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${startDate}-${endDate}`)
  const dataJSON = await data.json()
  return dataJSON
}

export async function genHockeyScores() {
  const data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${startDate}-${endDate}`)
  const dataJSON = await data.json()
  return dataJSON
}

export async function teamRecordSearch(sport, league, team) {
  const data = await fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/record?lang=en&region=us`)
  const dataJSON = await data.json()
  return dataJSON
}

export async function teamStatsSearch(sport, league, team) {
  const data = await fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/statistics?lang=en&region=us`)
  const dataJSON = await data.json()
  return dataJSON
}

