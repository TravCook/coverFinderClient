import { useEffect, useState } from 'react'
import { Col, Card, Row } from 'react-bootstrap'
import moment from 'moment'
// import { teamStatsSearch, teamRecordSearch } from '../../utils/searchUtils'

const MatchupCard = (props) => {
    // console.log(props)
    let homeTeam = props.eventData.competitions[0].competitors[0]
    let awayTeam = props.eventData.competitions[0].competitors[1]
    let homeOddsBGColor
    let awayOddsBGColor
    const [eventOdds, setEventOdds] = useState()
    const [homeTeamRecord, setHomeTeamRecord] = useState()
    const [homeTeamStats, setHomeTeamStats] = useState()
    const [awayTeamRecord, setAwayTeamRecord] = useState()
    const [awayTeamStats, setAwayTeamStats] = useState()

    const teamStatsSearch = (sport, league, team, home) => {
        home ? fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(data => setHomeTeamStats(data)) :
        fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(data => setAwayTeamStats(data))
        
    }

    const teamRecordSearch = (sport, league, team, home) => {
        home ? fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(data => setHomeTeamRecord(data)) : 
        fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(data => setAwayTeamRecord(data))
    }

    const retriveOdds = () => {
        fetch('/api/odds/quick', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "home_team": homeTeam.team.name,
                "away_team": awayTeam.team.name,
            })
        }).then(res => res.json())
            .then((data) => {
                setEventOdds(data)
            })
    }

    useEffect(() => {
        retriveOdds()
        teamStatsSearch( props.sport, props.league , homeTeam.team.id, true)
        teamRecordSearch( props.sport, props.league , homeTeam.team.id, true)
        teamStatsSearch( props.sport, props.league , awayTeam.team.id, false)
        teamRecordSearch( props.sport, props.league , awayTeam.team.id, false)  

    }, [props.displaySport])
    const homeBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0
        if(sport === 'football'){
            homeRecord.items[0].stats[19].value > homeRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            homeRecord.items[0].stats[19].value > awayRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compared to OPP
            homeRecord.items[0].stats[1].value > awayRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            homeStats.splits.categories[1].stats[5].value < awayStats.splits.categories[1].stats[5].value ? index++ : index-- // less ints
            homeStats.splits.categories[0].stats[2].value > awayStats.splits.categories[0].stats[2].value ? index++ : index-- // Forced Fumbles
            homeStats.splits.categories[0].stats[3].value > awayStats.splits.categories[0].stats[3].value ? index++ : index-- // Fumbles Recovered
            homeStats.splits.categories[1].stats[0].value > awayStats.splits.categories[1].stats[0].value ? index++ : index-- //Avg gain on passes
            homeStats.splits.categories[1].stats[2].value > awayStats.splits.categories[1].stats[2].value ? index++ : index-- // more completions
            homeStats.splits.categories[1].stats[20].value > awayStats.splits.categories[1].stats[20].value ? index++ : index-- // higher YAC
            homeStats.splits.categories[1].stats[30].value > awayStats.splits.categories[1].stats[30].value ? index++ : index-- // Higher PPG
            homeStats.splits.categories[2].stats[5].value > awayStats.splits.categories[2].stats[5].value ? index++ : index-- // Higher net rushing yards
            homeStats.splits.categories[2].stats[11].value > awayStats.splits.categories[2].stats[11].value ? index++ : index-- // Rushing TD's
            homeStats.splits.categories[4].stats[1].value > awayStats.splits.categories[4].stats[1].value ? index++ : index--  // Higher Int yards
            homeStats.splits.categories[4].stats[15].value > awayStats.splits.categories[4].stats[15].value ? index++ : index-- // Higher sack yards
            homeStats.splits.categories[4].stats[12].value > awayStats.splits.categories[4].stats[12].value ? index++ : index-- //Pass defended
            homeStats.splits.categories[4].stats[14].value > awayStats.splits.categories[4].stats[14].value ? index++ : index-- //total sacks
            homeStats.splits.categories[4].stats[20].value > awayStats.splits.categories[4].stats[20].value ? index++ : index-- // tackles for loss
            homeStats.splits.categories[5].stats[1].value > awayStats.splits.categories[5].stats[1].value ? index++ : index-- // defensive ints
            homeStats.splits.categories[6].stats[18].value > awayStats.splits.categories[6].stats[18].value ? index++ : index-- //FG %
            homeStats.splits.categories[9].stats[11].value > awayStats.splits.categories[9].stats[11].value ? index++ : index-- //2PT conversions
            homeStats.splits.categories[10].stats[10].value > awayStats.splits.categories[10].stats[10].value ? index++ : index-- // red zone efficiency
            
        }else if(sport === 'hockey'){
            homeRecord.items[0].stats[19].value > homeRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            homeRecord.items[0].stats[19].value > awayRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compared to OPP
            homeRecord.items[0].stats[1].value > awayRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            homeStats.splits.categories[1].stats[15].value > awayStats.splits.categories[1].stats[15].value ? index++ : index-- // shot diff
            homeStats.splits.categories[1].stats[16].value > awayStats.splits.categories[1].stats[16].value ? index++ : index-- // goal diff
            homeStats.splits.categories[2].stats[1].value > awayStats.splits.categories[2].stats[1].value ? index++ : index-- // total goals
            homeStats.splits.categories[2].stats[2].value > awayStats.splits.categories[2].stats[2].value ? index++ : index-- // goals per game
            homeStats.splits.categories[2].stats[11].value > awayStats.splits.categories[2].stats[11].value ? index++ : index-- // Points
            homeStats.splits.categories[2].stats[12].value > awayStats.splits.categories[2].stats[12].value ? index++ : index-- // Points per game
            homeStats.splits.categories[2].stats[13].value > awayStats.splits.categories[2].stats[13].value ? index++ : index-- // power play goals
            homeStats.splits.categories[2].stats[24].value > awayStats.splits.categories[2].stats[24].value ? index++ : index-- // shot %
            homeStats.splits.categories[2].stats[26].value > awayStats.splits.categories[2].stats[26].value ? index++ : index-- // faceoffs won
            homeStats.splits.categories[3].stats[0].value > awayStats.splits.categories[3].stats[0].value ? index++ : index--  // goals against average
            homeStats.splits.categories[3].stats[2].value > awayStats.splits.categories[3].stats[2].value ? index++ : index-- // shots against
            homeStats.splits.categories[3].stats[4].value > awayStats.splits.categories[3].stats[4].value ? index++ : index-- // penalty kill %
            homeStats.splits.categories[3].stats[12].value > awayStats.splits.categories[3].stats[12].value ? index++ : index-- // SHutouts
            homeStats.splits.categories[3].stats[14].value > awayStats.splits.categories[3].stats[14].value ? index++ : index-- // save %
            homeStats.splits.categories[3].stats[16].value > awayStats.splits.categories[3].stats[16].value ? index++ : index-- // blocked shots
            homeStats.splits.categories[3].stats[18].value > awayStats.splits.categories[3].stats[18].value ? index++ : index-- // takeaways
            homeStats.splits.categories[3].stats[17].value > awayStats.splits.categories[3].stats[17].value ? index++ : index-- // hits
            homeStats.splits.categories[3].stats[10].value < awayStats.splits.categories[3].stats[10].value ? index++ : index-- // times shorthanded

        }else if(sport === 'basketball'){
            homeRecord.items[0].stats[19].value > homeRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            homeRecord.items[0].stats[19].value > awayRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compared to OPP
            homeRecord.items[0].stats[1].value > awayRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            homeStats.splits.categories[0].stats[1].value > awayStats.splits.categories[0].stats[1].value ? index++ : index-- // Defensive Rebounds
            homeStats.splits.categories[0].stats[2].value > awayStats.splits.categories[0].stats[2].value ? index++ : index-- // Steals
            homeStats.splits.categories[0].stats[4].value > awayStats.splits.categories[0].stats[4].value ? index++ : index-- // Defensive Rebound Rate
            homeStats.splits.categories[0].stats[6].value > awayStats.splits.categories[0].stats[6].value ? index++ : index-- // Avg Blocks
            homeStats.splits.categories[0].stats[7].value > awayStats.splits.categories[0].stats[7].value ? index++ : index-- // Avg steals
            homeStats.splits.categories[1].stats[1].value < awayStats.splits.categories[1].stats[1].value ? index++ : index-- // flagrant fouls
            homeStats.splits.categories[1].stats[2].value < awayStats.splits.categories[1].stats[2].value ? index++ : index-- // fouls
            homeStats.splits.categories[2].stats[0].value > awayStats.splits.categories[2].stats[0].value ? index++ : index-- // assists
            homeStats.splits.categories[2].stats[1].value > awayStats.splits.categories[2].stats[1].value ? index++ : index-- // FG %
            homeStats.splits.categories[2].stats[4].value > awayStats.splits.categories[2].stats[4].value ? index++ : index--  // FG Made
            homeStats.splits.categories[2].stats[7].value > awayStats.splits.categories[2].stats[7].value ? index++ : index-- // FT %
            homeStats.splits.categories[2].stats[10].value > awayStats.splits.categories[2].stats[10].value ? index++ : index-- // Offensive Rebound
            homeStats.splits.categories[2].stats[11].value > awayStats.splits.categories[2].stats[11].value ? index++ : index-- // points
            homeStats.splits.categories[2].stats[13].value > awayStats.splits.categories[2].stats[13].value ? index++ : index-- // 3PT %
            homeStats.splits.categories[2].stats[17].value < awayStats.splits.categories[2].stats[17].value ? index++ : index-- // Total Turnovers
            homeStats.splits.categories[2].stats[20].value > awayStats.splits.categories[2].stats[20].value ? index++ : index-- // Points in Paint
            homeStats.splits.categories[2].stats[32].value > awayStats.splits.categories[2].stats[32].value ? index++ : index-- // Points Per Game
            homeStats.splits.categories[2].stats[26].value > awayStats.splits.categories[2].stats[26].value ? index++ : index-- // AVG FG%
        }
        
        if(index >= -21 && index <= -16){
            homeOddsBGColor = '#bb1c1cc9'
        }else if(index >= -15 && index <= -6){
            homeOddsBGColor = '#ff7d14c9'
        }else if(index >= -6 && index <= 5){
            homeOddsBGColor = '#c3bd2cc9'
        }else if(index >= 6 && index <= 15){
            homeOddsBGColor = '#2aaf338c'
        }else if(index >= 16 && index <= 21){
            homeOddsBGColor = '#2c4ec3c9'
        }
    }
    const awayBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0
        if(sport === 'football'){
            awayRecord.items[0].stats[19].value > awayRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            awayRecord.items[0].stats[19].value > homeRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compare to OPP
            awayRecord.items[0].stats[1].value > homeRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            awayStats.splits.categories[0].stats[2].value > homeStats.splits.categories[0].stats[2].value ? index++ : index-- // Forced Fumbles
            awayStats.splits.categories[0].stats[3].value > homeStats.splits.categories[0].stats[3].value ? index++ : index-- // Fumbles Recovered
            awayStats.splits.categories[1].stats[0].value > homeStats.splits.categories[1].stats[0].value ? index++ : index-- //Avg gain on passes
            awayStats.splits.categories[1].stats[2].value > homeStats.splits.categories[1].stats[2].value ? index++ : index-- // more completions
            awayStats.splits.categories[1].stats[5].value < homeStats.splits.categories[1].stats[5].value ? index++ : index-- // less ints
            awayStats.splits.categories[1].stats[20].value > homeStats.splits.categories[1].stats[20].value ? index++ : index-- // higher YAC
            awayStats.splits.categories[1].stats[30].value > homeStats.splits.categories[1].stats[30].value ? index++ : index-- // Higher PPG
            awayStats.splits.categories[2].stats[5].value > homeStats.splits.categories[2].stats[5].value ? index++ : index-- // Higher net rushing yards
            awayStats.splits.categories[2].stats[11].value > homeStats.splits.categories[2].stats[11].value ? index++ : index-- // Rushing TD's
            awayStats.splits.categories[4].stats[1].value > homeStats.splits.categories[4].stats[1].value ? index++ : index--  // Higher Int yards
            awayStats.splits.categories[4].stats[15].value > homeStats.splits.categories[4].stats[15].value ? index++ : index-- // Higher sack yards
            awayStats.splits.categories[4].stats[12].value > homeStats.splits.categories[4].stats[12].value ? index++ : index-- //Pass defended
            awayStats.splits.categories[4].stats[14].value > homeStats.splits.categories[4].stats[14].value ? index++ : index-- //total sacks
            awayStats.splits.categories[4].stats[20].value > homeStats.splits.categories[4].stats[20].value ? index++ : index-- // tackles for loss
            awayStats.splits.categories[5].stats[1].value > homeStats.splits.categories[5].stats[1].value ? index++ : index-- // defensive ints
            awayStats.splits.categories[6].stats[18].value > homeStats.splits.categories[6].stats[18].value ? index++ : index-- //FG %
            awayStats.splits.categories[9].stats[11].value > homeStats.splits.categories[9].stats[11].value ? index++ : index-- //2PT conversions
            awayStats.splits.categories[10].stats[10].value > homeStats.splits.categories[10].stats[10].value ? index++ : index-- // red zone efficiency

        }else if(sport === 'hockey'){
            awayRecord.items[0].stats[19].value > awayRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            awayRecord.items[0].stats[19].value > homeRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compared to OPP
            awayRecord.items[0].stats[1].value > homeRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            awayStats.splits.categories[1].stats[15].value > homeStats.splits.categories[1].stats[15].value ? index++ : index-- // shot diff
            awayStats.splits.categories[1].stats[16].value > homeStats.splits.categories[1].stats[16].value ? index++ : index-- // goal diff
            awayStats.splits.categories[2].stats[1].value > homeStats.splits.categories[2].stats[1].value ? index++ : index-- // goals
            awayStats.splits.categories[2].stats[2].value > homeStats.splits.categories[2].stats[2].value ? index++ : index-- // goals per game
            awayStats.splits.categories[2].stats[11].value > homeStats.splits.categories[2].stats[11].value ? index++ : index-- // points
            awayStats.splits.categories[2].stats[12].value > homeStats.splits.categories[2].stats[12].value ? index++ : index-- // points per game
            awayStats.splits.categories[2].stats[13].value > homeStats.splits.categories[2].stats[13].value ? index++ : index-- // power play goals
            awayStats.splits.categories[2].stats[24].value > homeStats.splits.categories[2].stats[24].value ? index++ : index-- // shot %
            awayStats.splits.categories[2].stats[26].value > homeStats.splits.categories[2].stats[26].value ? index++ : index-- // faceoffs won
            awayStats.splits.categories[3].stats[0].value > homeStats.splits.categories[3].stats[0].value ? index++ : index--  // goals against average
            awayStats.splits.categories[3].stats[2].value > homeStats.splits.categories[3].stats[2].value ? index++ : index-- // shots against
            awayStats.splits.categories[3].stats[4].value > homeStats.splits.categories[3].stats[4].value ? index++ : index-- // penalty kill %
            awayStats.splits.categories[3].stats[12].value > homeStats.splits.categories[3].stats[12].value ? index++ : index-- // shutouts
            awayStats.splits.categories[3].stats[14].value > homeStats.splits.categories[3].stats[14].value ? index++ : index-- // save %
            awayStats.splits.categories[3].stats[16].value > homeStats.splits.categories[3].stats[16].value ? index++ : index-- // blocked shots
            awayStats.splits.categories[3].stats[18].value > homeStats.splits.categories[3].stats[18].value ? index++ : index-- // takeaways
            awayStats.splits.categories[3].stats[17].value > homeStats.splits.categories[3].stats[17].value ? index++ : index-- // hits
            awayStats.splits.categories[3].stats[10].value < homeStats.splits.categories[3].stats[10].value ? index++ : index-- // time shorthanded

        }else if(sport === 'basketball'){
            awayRecord.items[0].stats[19].value > awayRecord.items[0].stats[10].value ? index++ : index-- //Wins vs Losses
            awayRecord.items[0].stats[19].value > homeRecord.items[0].stats[19].value ? index++ : index-- //Totals wins compared to OPP
            awayRecord.items[0].stats[1].value > homeRecord.items[0].stats[1].value ? index++ : index--  // OT Wins compared to OPP
            awayStats.splits.categories[0].stats[1].value > homeStats.splits.categories[0].stats[1].value ? index++ : index-- // Defensive Rebounds
            awayStats.splits.categories[0].stats[2].value > homeStats.splits.categories[0].stats[2].value ? index++ : index-- // Steals
            awayStats.splits.categories[0].stats[4].value > homeStats.splits.categories[0].stats[4].value ? index++ : index-- // Defensive Rebound Rate
            awayStats.splits.categories[0].stats[6].value > homeStats.splits.categories[0].stats[6].value ? index++ : index-- // Avg Blocks
            awayStats.splits.categories[0].stats[7].value > homeStats.splits.categories[0].stats[7].value ? index++ : index-- // Avg steals
            awayStats.splits.categories[1].stats[1].value < homeStats.splits.categories[1].stats[1].value ? index++ : index-- // flagrant fouls
            awayStats.splits.categories[1].stats[2].value < homeStats.splits.categories[1].stats[2].value ? index++ : index-- // fouls
            awayStats.splits.categories[2].stats[0].value > homeStats.splits.categories[2].stats[0].value ? index++ : index-- // assists
            awayStats.splits.categories[2].stats[1].value > homeStats.splits.categories[2].stats[1].value ? index++ : index-- // FG %
            awayStats.splits.categories[2].stats[4].value > homeStats.splits.categories[2].stats[4].value ? index++ : index--  // FG Made
            awayStats.splits.categories[2].stats[7].value > homeStats.splits.categories[2].stats[7].value ? index++ : index-- // FT %
            awayStats.splits.categories[2].stats[10].value > homeStats.splits.categories[2].stats[10].value ? index++ : index-- // Offensive Rebound
            awayStats.splits.categories[2].stats[11].value > homeStats.splits.categories[2].stats[11].value ? index++ : index-- // points
            awayStats.splits.categories[2].stats[13].value > homeStats.splits.categories[2].stats[13].value ? index++ : index-- // 3PT %
            awayStats.splits.categories[2].stats[17].value < homeStats.splits.categories[2].stats[17].value ? index++ : index-- // Total Turnovers
            awayStats.splits.categories[2].stats[20].value > homeStats.splits.categories[2].stats[20].value ? index++ : index-- // Points in Paint
            awayStats.splits.categories[2].stats[32].value > homeStats.splits.categories[2].stats[32].value ? index++ : index-- // Points Per Game
            awayStats.splits.categories[2].stats[26].value > homeStats.splits.categories[2].stats[26].value ? index++ : index-- // AVG FG%
        }

        if(index >= -21 && index <= -16){
            awayOddsBGColor = '#bb1c1cc9'
        }else if(index >= -15 && index <= -6){
            awayOddsBGColor = '#ff7d14c9'
        }else if(index >= -6 && index <= 5){
            awayOddsBGColor = '#c3bd2cc9'
        }else if(index >= 6 && index <= 15){
            awayOddsBGColor = '#2aaf338c'
        }else if(index >= 16 && index <= 21){
            awayOddsBGColor = '#2c4ec3c9'
        }
    }
   
    homeTeamRecord && homeTeamStats && awayTeamRecord && awayTeamStats ? homeBackgroundColorPicker(homeTeamRecord, homeTeamStats, awayTeamRecord, awayTeamStats, props.sport) : <></>
    awayTeamRecord && awayTeamStats && homeTeamRecord && homeTeamStats ? awayBackgroundColorPicker(homeTeamRecord, homeTeamStats, awayTeamRecord, awayTeamStats, props.sport): <></>
    return (
        eventOdds ? 
        <Card style={{ backgroundColor: '#434343', minWidth: 275, textAlign: 'center', borderRadius: 25, margin: 5}}>
            {/* top row is for showing matchup */}
            {eventOdds ?<Row>{moment(eventOdds.commence_time).format('DD/MM/YYYY')}</Row> : null}
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                {/* this card is the home team */}
                <Col>
                    <Card>
                        <Card.Img
                            src={homeTeam.team.logo}
                            variant="top"
                            style={{
                                height: 'auto',
                                maxHeight: '70px',
                                width: 'auto',
                                maxWidth: '70px'
                            }}
                        />
                        <Card.Text style={{ fontSize: 13 }}>
                            {homeTeam.team.abbreviation} {homeTeam.team.name}
                        </Card.Text>
                        <Card.Text style={{ fontSize: 13 }}>({homeTeam.records[0].summary})</Card.Text>
                    </Card>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 26 }}>VS</Col>
                <Col>
                    {/* this column is the away team */}
                    <Card>
                        <Card.Img
                            src={awayTeam.team.logo}
                            variant="top"
                            style={{
                                height: 'auto',
                                maxHeight: '70px',
                                width: 'auto',
                                maxWidth: '70px'
                            }}
                        />
                        <Card.Text style={{ fontSize: 13 }}>
                            {awayTeam.team.abbreviation} {awayTeam.team.name}
                        </Card.Text>
                        <Card.Text style={{ fontSize: 13 }}>({awayTeam.records[0].summary})</Card.Text>
                    </Card>
                </Col>
            </Row>
            {/* bottom row is for showing odds */}
            <Row style={{ display: 'flex', flexDirection: 'column' }}>
                {eventOdds ? eventOdds.bookmakers.map((odds) => {
                    let oddsBG
                    if (odds.key === "draftkings") {
                        oddsBG = '#61b510'
                    } else if (odds.key === "fanduel") {
                        oddsBG = '#0070eb'
                    } else if (odds.key === "betmgm") {
                        oddsBG = '#dbc172'
                    }
                    if (odds.key === "draftkings" || odds.key === "fanduel" || odds.key === "betmgm") {
                        return (
                            <Card style={{ width: '80%',  backgroundColor: '#1d1e20',alignSelf: 'center', margin: 5, borderRadius: 5, boxShadow: "1px 2px 5px #00000F",  }}>
                                <Card.Text style={{margin: 0, backgroundColor: oddsBG, borderRadius: 5, fontWeight: 700, textShadow: "1px 2px 10px #00000F" }}>{odds.key === "draftkings" ? "Draft Kings" : odds.key === "fanduel" ? "Fan Duel" : odds.key === "betmgm" ? "Bet MGM" : null}</Card.Text>
                                <Row style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: 5,margin: 10, color: 'white', backgroundColor: homeOddsBGColor, borderRadius: 25  }}>
                                    <Col>
                                        {odds.markets[0].outcomes[0].name === "Minnesota Timberwolves" ? 'MIN Timberwolves' : odds.markets[0].outcomes[0].name} :
                                    </Col>
                                    <Col>
                                        {odds.markets[0].outcomes[0].price}
                                    </Col>
                                </Row>
                                <Row style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: 5,margin: 10, color: 'white', backgroundColor: awayOddsBGColor, borderRadius: 20 }}>
                                    <Col sm={10}>
                                        {odds.markets[0].outcomes[1].name === "Minnesota Timberwolves" ? 'MIN Timberwolves' : odds.markets[1].outcomes[1].name} :
                                    </Col>
                                    <Col>
                                        {odds.markets[0].outcomes[1].price}
                                    </Col>
                                </Row>
                            </Card>
                        )
                    }

                }) : null}
            </Row>
        </Card>
         : null
    )
}

export default MatchupCard