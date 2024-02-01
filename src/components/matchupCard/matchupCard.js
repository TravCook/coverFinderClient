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
        home ? fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(data => setHomeTeamStats(data)) :
            fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(data => setAwayTeamStats(data))

    }

    const teamRecordSearch = (sport, league, team, home) => {
        home ? fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(data => setHomeTeamRecord(data)) :
            fetch(`http://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(data => setAwayTeamRecord(data))
    }

    const retriveOdds = () => {
        fetch('http://ec2-35-173-188-106.compute-1.amazonaws.com:3001/api/odds/quick', {
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
        teamStatsSearch(props.sport, props.league, homeTeam.team.id, true)
        teamRecordSearch(props.sport, props.league, homeTeam.team.id, true)
        teamStatsSearch(props.sport, props.league, awayTeam.team.id, false)
        teamRecordSearch(props.sport, props.league, awayTeam.team.id, false)
    }, [props.displaySport])
    const homeBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0
        console.log(homeRecord)
        console.log(homeStats)
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
        console.log(homeTeam.team.name + " index: " + index)
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
            <Card style={{ backgroundColor: '#434343', minWidth: 275, textAlign: 'center', borderRadius: 25, margin: 5 }}>
                {/* top row is for showing matchup */}
                {eventOdds ? <Row>{moment(eventOdds.commence_time).format('DD/MM/YYYY')}</Row> : null}
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
                                <Card style={{ width: '80%', backgroundColor: '#1d1e20', alignSelf: 'center', margin: 5, borderRadius: 5, boxShadow: "1px 2px 5px #00000F", }}>
                                    <Card.Text style={{ margin: 0, backgroundColor: oddsBG, borderRadius: 5, fontWeight: 700, textShadow: "1px 2px 10px #00000F" }}>{odds.key === "draftkings" ? "Draft Kings" : odds.key === "fanduel" ? "Fan Duel" : odds.key === "betmgm" ? "Bet MGM" : null}</Card.Text>
                                    {odds.markets[0].outcomes.map((outcome) => {
                                        if (outcome.name === (homeTeam.team.location === 'LA' ? 'Los Angeles' + homeTeam.team.name : homeTeam.team.location + " " + homeTeam.team.name)) {
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
                                        if (outcome.name === (awayTeam.team.location === 'LA' ? 'Los Angeles ' + awayTeam.team.name : awayTeam.team.location + " " + awayTeam.team.name)) {
                                            return (
                                                <Row style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 14, padding: 5, margin: 10, color: 'white', backgroundColor: awayOddsBGColor, borderRadius: 20 }}>
                                                    <Col sm={10}>
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
                        }

                    }) : null}
                </Row>
            </Card>
            : null
    )
}

export default MatchupCard