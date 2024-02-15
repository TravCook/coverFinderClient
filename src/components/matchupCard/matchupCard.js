import { useEffect, useState } from 'react'
import { Col, Card, Row } from 'react-bootstrap'
import moment from 'moment'
// import { teamStatsSearch, teamRecordSearch } from '../../utils/searchUtils'

const MatchupCard = (props) => {
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
        if(sport === 'soccer'){
            home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamStats(data)) :
            fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await  setAwayTeamStats(data))

        }else{
             home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await  setHomeTeamStats(data)) :
            fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await  setAwayTeamStats(data))

        }
       
    }

    const teamRecordSearch = (sport, league, team, home) => {
        if(sport === 'soccer') {
            home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamRecord(data)) :
            fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setAwayTeamRecord(data))
    
        }else{
              home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamRecord(data)) :
            fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setAwayTeamRecord(data))
       
        }
   }

    const retrieveOdds = () => {
        fetch('http://hegdebetterapi.com:3001/api/odds/quick', {
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
        retrieveOdds()
        teamStatsSearch(props.sport, props.league, homeTeam.team.id, true)
        teamRecordSearch(props.sport, props.league, homeTeam.team.id, true)
        teamStatsSearch(props.sport, props.league, awayTeam.team.id, false)
        teamRecordSearch(props.sport, props.league, awayTeam.team.id, false)
    }, [props.pageIndex])
    const homeBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0

        if (sport === 'football') {

        } else if (sport === 'hockey') {


        } else if (sport === 'basketball') {
            homeRecord.items[0].stats[17].value > .50 ? index++ : index-- // Win rate over 50%
            homeRecord.items[0].stats[3].value > homeRecord.items[0].stats[2] ? index++ : index-- //AVG Points for vs Points Against
            homeRecord.items[0].stats[11].value > 0 ? index++ : index-- // Point Differential
            homeRecord.items[1].stats[3].value > .50 ? index++ : index-- // Home win %
            homeRecord.items[5].stats[17].value > .50 ? index++ : index-- // Last 10 win%
            homeStats.splits.categories[1].stats[10].value > awayStats.splits.categories[1].stats[10].value ? index++ : index-- // NBA Rating
            homeStats.splits.categories[1].stats[3].value > awayStats.splits.categories[1].stats[3].value ? index++ : index-- //Rebound Differential
            homeStats.splits.categories[2].stats[13].value > awayStats.splits.categories[2].stats[13].value ? index++ : index-- //3 PT %
            homeStats.splits.categories[2].stats[1].value > awayStats.splits.categories[2].stats[1].value ? index++ : index-- //FG %
            homeStats.splits.categories[1].stats[24].value > awayStats.splits.categories[1].stats[24].value ? index++ : index-- //Assist/Turnover Ratio
            homeStats.splits.categories[2].stats[31].value > awayStats.splits.categories[2].stats[31].value ? index++ : index-- //FT Attempts
        }
        if (index >= -10 && index <= -6) {
            homeOddsBGColor = '#bb1c1cc9'
        } else if (index <= -1) {
            homeOddsBGColor = '#ff7d14c9'
        } else if (index === 0) {
            homeOddsBGColor = '#c3bd2cc9'
        } else if (index >= 1 && index <= 5) {
            homeOddsBGColor = '#2aaf338c'
        } else if (index >= 6) {
            homeOddsBGColor = '#2c4ec3c9'
        }
    }
    const awayBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0
        if (sport === 'football') {

        } else if (sport === 'hockey') {

        } else if (sport === 'basketball') {
            awayRecord.items[0].stats[17].value > .50 ? index++ : index-- // Win rate over 50%
            awayRecord.items[0].stats[3].value > awayRecord.items[0].stats[2] ? index++ : index-- //AVG Points for vs Points Against
            awayRecord.items[0].stats[11].value > 0 ? index++ : index-- // Point Differential
            awayRecord.items[2].stats[3].value > .50 ? index++ : index-- // away win %
            awayRecord.items[5].stats[17].value > .50 ? index++ : index-- // Last 10 win%
            awayStats.splits.categories[1].stats[10].value > homeStats.splits.categories[1].stats[10].value ? index++ : index--
            awayStats.splits.categories[1].stats[3].value > homeStats.splits.categories[1].stats[3].value ? index++ : index-- //Rebound Differential
            awayStats.splits.categories[2].stats[13].value > homeStats.splits.categories[2].stats[13].value ? index++ : index-- //3 PT %
            awayStats.splits.categories[2].stats[1].value > homeStats.splits.categories[2].stats[1].value ? index++ : index-- //FG %
            awayStats.splits.categories[1].stats[24].value > homeStats.splits.categories[1].stats[24].value ? index++ : index-- //Assist/Turnover Ratio
            awayStats.splits.categories[2].stats[31].value > awayStats.splits.categories[2].stats[31].value ? index++ : index-- //3PT Attempts

        }

        if (index >= -21 && index <= -16) {
            awayOddsBGColor = '#bb1c1cc9'
        } else if (index >= -15 && index <= -6) {
            awayOddsBGColor = '#ff7d14c9'
        } else if (index >= -6 && index <= 5) {
            awayOddsBGColor = '#c3bd2cc9'
        } else if (index >= 6 && index <= 15) {
            awayOddsBGColor = '#2aaf338c'
        } else if (index >= 16 && index <= 21) {
            awayOddsBGColor = '#2c4ec3c9'
        }
    }
    homeTeamRecord && homeTeamStats && awayTeamRecord && awayTeamStats ? homeBackgroundColorPicker(homeTeamRecord, homeTeamStats, awayTeamRecord, awayTeamStats, props.sport) : <></>
    awayTeamRecord && awayTeamStats && homeTeamRecord && homeTeamStats ? awayBackgroundColorPicker(homeTeamRecord, homeTeamStats, awayTeamRecord, awayTeamStats, props.sport) : <></>
    return (
        eventOdds ?

            <Card style={{ backgroundColor: '#7a7582', width: 240, textAlign: 'center', color: 'white', borderRadius: 25, margin: 5 }}>
                {/* top row is for showing matchup */}
                {eventOdds ? moment(eventOdds.commence_time).format('DD/MMM/YYYY') : null}
                <Row>
                    {/* this card is the home team */}
                    <Col>
                        <Card style={{ backgroundColor: '#7a7582', border: 'none', color: 'white', alignItems: 'center'}}>
                            <Card.Img
                                src={homeTeam.team.logo}
                                variant="top"
                                style={{
                                    height: 'auto',
                                    maxHeight: '30px',
                                    width: 'auto',
                                    maxWidth: '30px',
                                    backgroundColor: '#7a7582'
                                }}
                            />
                                <Row style={{ fontSize: 13, marginBottom: 0  }}>
                                {props.sport === 'soccer' ? null : `${homeTeam.team.abbreviation}`}
                                </Row>
                                <Row style={{ fontSize: 13, marginBottom: 0  }}>
                                {props.sport === 'soccer' ? homeTeam.team.shortDisplayName : `${homeTeam.team.name}`}
                                </Row>
                            <Card.Text style={{ fontSize: 13 }}>({homeTeam ? homeTeam.records[0].summary : null})</Card.Text>
                        </Card>
                    </Col>
                    <Col xs={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center', fontSize: 16, padding: 0}}>VS</Col>
                    <Col>
                        {/* this column is the away team */}
                        <Card style={{ backgroundColor: '#7a7582', border: 'none', color: 'white', textAlign: 'center', alignItems: 'center'}}>
                            <Card.Img
                                src={awayTeam.team.logo}
                                variant="top"
                                style={{
                                    height: 'auto',
                                    maxHeight: '30px',
                                    width: 'auto',
                                    maxWidth: '30px'
                                }}
                            />
                            <Row style={{ fontSize: 13, marginBottom: 0  }}>
                                {props.sport === 'soccer' ? null : `${awayTeam.team.abbreviation}`}
                                </Row>
                                <Row style={{ fontSize: 13, marginBottom: 0  }}>
                                {props.sport === 'soccer' ? awayTeam.team.shortDisplayName : `${awayTeam.team.name}`}
                                </Row>
                            <Card.Text style={{ fontSize: 13 }}>({awayTeam.records[0].summary})</Card.Text>
                        </Card>
                    </Col>
                </Row>
                {/* bottom row is for showing odds */}
                <Row style={{ display: 'flex', flexDirection: 'column' }}>
                    { eventOdds.bookmakers.map((odds) => {
                        if (odds.key === props.sportsBook) {
                            return (
                                <Card style={{ width: '80%', backgroundColor: '#1d1e20', alignSelf: 'center', margin: 5, borderRadius: 5, boxShadow: "1px 2px 5px #00000F", }}>
                                    <Card.Text style={{ margin: 0, backgroundColor: '#527595', borderRadius: 5, fontWeight: 600, color: '#eef3f3'  }}>Money Line</Card.Text>
                                    {odds.markets[0].outcomes.map((outcome) => {
                                        if(props.sport === 'soccer'){
                                            if (outcome.name === homeTeam.team.name) {
                                                return (
                                                    <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: homeOddsBGColor, borderRadius: 25 }}>
                                                        <Col>
                                                            {homeTeam.team.shortDisplayName} : 
                                                        </Col>
                                                        <Col>
                                                            {outcome.price}
                                                        </Col>
                                                    </Row>
                                                )
                                            }
                                            if (outcome.name === awayTeam.team.name) {
                                                return (
                                                    <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: awayOddsBGColor, borderRadius: 20 }}>
                                                        <Col sm={10}>
                                                            {awayTeam.team.shortDisplayName} :
                                                        </Col>
                                                        <Col>
                                                            {outcome.price}
                                                        </Col>
                                                    </Row>
                                                )
                                            }else{
                                                return (
                                                    <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: awayOddsBGColor, borderRadius: 20 }}>
                                                        <Col sm={10}>
                                                            {outcome.name} :
                                                        </Col>
                                                        <Col>
                                                            {outcome.price}
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                        }
                                        if (outcome.name.includes(homeTeam.team.name)) {
                                            return (
                                                <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: homeOddsBGColor, borderRadius: 25 }}>
                                                    <Col>
                                                        {homeTeam.team.abbreviation} : 
                                                    </Col>
                                                    <Col>
                                                        {outcome.price}
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        if (outcome.name.includes(awayTeam.team.name)) {
                                            return (
                                                <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: awayOddsBGColor, borderRadius: 20 }}>
                                                    <Col>
                                                        {awayTeam.team.abbreviation} :
                                                    </Col>
                                                    <Col>
                                                        {outcome.price}
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })}


                                </Card>
                            )
                        }else{
                            
                        }

                    }) }
                </Row>
            </Card>
            : null
    )
}

export default MatchupCard