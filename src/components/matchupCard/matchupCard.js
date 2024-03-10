import { useEffect, useState } from 'react'
import { Col, Card, Row } from 'react-bootstrap'
import moment from 'moment'

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
        if (sport === 'soccer') {
            home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamStats(data)) :
                fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await setAwayTeamStats(data))

        } else {
            home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamStats(data)) :
                fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2024/types/2/teams/${team}/statistics?lang=en&region=us`).then(res => res.json()).then(async data => await setAwayTeamStats(data))

        }

    }

    const teamRecordSearch = (sport, league, team, home) => {
        if (sport === 'soccer') {
            home ? fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setHomeTeamRecord(data)) :
                fetch(`https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/2023/types/1/teams/${team}/record?lang=en&region=us`).then(res => res.json()).then(async data => await setAwayTeamRecord(data))

        } else {
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

        // console.log(`Away Record:  ${awayRecord}`)
        // console.log(`Away Stats:  ${awayStats}`)

        if (sport === 'football') {

        } else if (sport === 'hockey') {


        } else if (sport === 'basketball') {
            // RECORD COMPARISONS || VALUE
            homeRecord.items[0].stats[17].value > .50 ? index = index + 1 : index = index - 1// OVERALL WIN PERCENTAGE || 1
            homeRecord.items[1].stats[3].value > .50 ? index = index + 1 : index = index - 1// HOME WIN PERCENTAGE || 1
            index = index + (homeRecord.items[5].stats[18].value)// L10 WIN PERCENTAGE || *10
            homeRecord.items[0].stats[11].value > 0 ? index = index + 1 : index = index - 1// POINT DIFFERENTIAL || 1
            // IF CONF THEN CONF WIN PERCENTAGE || 2
            // IF DIV THEN DIV WIN PERCENTAGE || 3
            homeRecord.items[0].stats[3].value > homeRecord.items[0].stats[2].value ? index = index + 1 : index = index - 1// OVERALL POINTS FOR VS POINTS AGAINST || 1
            homeRecord.items[5].stats[3].value > homeRecord.items[0].stats[2].value ? index = index + 2 : index = index - 2// L10 POINTS FOR VS POINTS AGAINST || 2
            // STAT COMPARISONS || VALUE
            homeStats.splits.categories[1].stats[18].value > awayStats.splits.categories[1].stats[18].value ? index = index + 1 : index = index - 1//ASSIST TO TURNOVER RATIO || 1
            homeStats.splits.categories[2].stats[5].value > awayStats.splits.categories[2].stats[5].value ? index = index + 2 : index = index - 2//FIELD GOAL PERCENTAGE || 2
            homeStats.splits.categories[2].stats[3].value > awayStats.splits.categories[2].stats[3].value ? index = index + 1 : index = index - 1//FIELD GOAL ATTEMPTS || 1
            homeStats.splits.categories[2].stats[7].value > awayStats.splits.categories[2].stats[7].value ? index = index + 2 : index = index - 2//FREE THROW PERCENTAGE || 2
            homeStats.splits.categories[2].stats[13].value > awayStats.splits.categories[2].stats[13].value ? index = index + 2 : index = index - 2//3 POINT PERCENTAGE || 2
            homeStats.splits.categories[2].stats[14].value > awayStats.splits.categories[2].stats[14].value ? index = index + 2 : index = index - 2//3 POINT ATTEMPTS || 2
            homeStats.splits.categories[1].stats[3].value > awayStats.splits.categories[1].stats[3].value ? index = index + 2 : index = index - 2//REBOUNDING MARGIN || 2
            homeStats.splits.categories[2].stats[19].value > awayStats.splits.categories[2].stats[19].value ? index = index + 1 : index = index - 1//ASSISTS ON FIELD GOALS % || 1
            homeStats.splits.categories[2].stats[49].value > awayStats.splits.categories[2].stats[49].value ? index = index + 2 : index = index - 2//OFFENSIVE RATING || 2
            homeStats.splits.categories[0].stats[5].value > awayStats.splits.categories[0].stats[5].value ? index = index + 2 : index = index - 2//DEFENSIVE REBOUNDS || 2
            homeStats.splits.categories[2].stats[25].value > awayStats.splits.categories[2].stats[25].value ? index = index + 1 : index = index - 1//PACE || 1
        }
        if (index <= -26) {
            homeOddsBGColor = '#bb1c1cc9'
        } else if (index <= -10 && index >= -25) {
            homeOddsBGColor = '#ff7d14c9'
        } else if (index >= -9 && index <= 9) {
            homeOddsBGColor = '#c3bd2cc9'
        } else if (index >= 10 && index <= 25) {
            homeOddsBGColor = '#2aaf338c'
        } else if (index >= 26) {
            homeOddsBGColor = '#2c4ec3c9'
        }
    }
    const awayBackgroundColorPicker = (homeRecord, homeStats, awayRecord, awayStats, sport) => {
        let index = 0
        if (sport === 'football') {

        } else if (sport === 'hockey') {

        } else if (sport === 'basketball') {
            // console.log(awayRecord)
            // RECORD COMPARISONS || VALUE
            awayRecord.items[0].stats[17].value > .50 ? index = index + 1 : index = index - 1// OVERALL WIN PERCENTAGE || 1
            awayRecord.items[1].stats[3].value > .50 ? index = index + 1 : index = index - 1// HOME WIN PERCENTAGE || 1
            index = index + (awayRecord.items[5].stats[18].value)// L10 WIN PERCENTAGE || *10
            awayRecord.items[0].stats[11].value > 0 ? index = index + 1 : index = index - 1// POINT DIFFERENTIAL || 1
            // IF CONF THEN CONF WIN PERCENTAGE || 2
            // IF DIV THEN DIV WIN PERCENTAGE || 3
            awayRecord.items[0].stats[3].value > awayRecord.items[0].stats[2].value ? index = index + 1 : index = index - 1// OVERALL POINTS FOR VS POINTS AGAINST || 1
            awayRecord.items[5].stats[3].value > awayRecord.items[0].stats[2].value ? index = index + 2 : index = index - 2// L10 POINTS FOR VS POINTS AGAINST || 2
            // STAT COMPARISONS || VALUE
            awayStats.splits.categories[1].stats[18] > homeStats.splits.categories[1].stats[18] ? index = index + 1 : index = index - 1//ASSIST TO TURNOVER RATIO || 1
            awayStats.splits.categories[2].stats[5] > homeStats.splits.categories[2].stats[5] ? index = index + 2 : index = index - 2//FIELD GOAL PERCENTAGE || 2
            awayStats.splits.categories[2].stats[3] > homeStats.splits.categories[2].stats[3] ? index = index + 1 : index = index - 1//FIELD GOAL ATTEMPTS || 1
            awayStats.splits.categories[2].stats[7] > homeStats.splits.categories[2].stats[7] ? index = index + 2 : index = index - 2//FREE THROW PERCENTAGE || 2
            awayStats.splits.categories[2].stats[13] > homeStats.splits.categories[2].stats[13] ? index = index + 2 : index = index - 2//3 POINT PERCENTAGE || 2
            awayStats.splits.categories[2].stats[14] > homeStats.splits.categories[2].stats[14] ? index = index + 2 : index = index - 2//3 POINT ATTEMPTS || 2
            awayStats.splits.categories[1].stats[3] > homeStats.splits.categories[1].stats[3] ? index = index + 2 : index = index - 2//REBOUNDING MARGIN || 2
            awayStats.splits.categories[2].stats[19] > homeStats.splits.categories[2].stats[19] ? index = index + 1 : index = index - 1//ASSISTS ON FIELD GOALS % || 1
            awayStats.splits.categories[2].stats[49] > homeStats.splits.categories[2].stats[49] ? index = index + 2 : index = index - 2//OFFENSIVE RATING || 2
            awayStats.splits.categories[0].stats[5] > homeStats.splits.categories[0].stats[5] ? index = index + 2 : index = index - 2//DEFENSIVE REBOUNDS || 2
            awayStats.splits.categories[2].stats[25] > homeStats.splits.categories[2].stats[25] ? index = index + 1 : index = index - 1//PACE || 1
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

            <Card style={{ backgroundColor: '#7a7582', width: 500, textAlign: 'center', color: 'white', borderRadius: 25, margin: 5, fontSize: 14 }}>
                {/* top row is for showing matchup */}
                {eventOdds ? moment(eventOdds.commence_time).format('DD/MMM/YYYY') : null}
                {/* away team */}
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center' }} xs={1}>
                        <img src={awayTeam.team.logo}
                            variant="top"
                            style={{
                                height: 'auto',
                                maxHeight: '28px',
                                width: 'auto',
                                maxWidth: '28px',
                                backgroundColor: '#7a7582'
                            }}></img>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        {props.sport === 'soccer' ? null : `${awayTeam.team.abbreviation}`} {props.sport === 'soccer' ? awayTeam.team.shortDisplayName : `${awayTeam.team.name}`}
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }} xs={2}>
                        {awayTeam.records[0].summary}
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Spread
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {

                                    return (
                                        odds.key === props.sportsBook ? odds.markets[1].outcomes.map((outcome) => {
                                            if (outcome.name === (awayTeam.team.location === 'LA' ? 'Los Angeles ' + awayTeam.team.name : awayTeam.team.location + " " + awayTeam.team.name)) {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Money
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ backgroundColor: awayOddsBGColor, borderRadius: 15 }}>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {

                                    return (
                                        odds.key === props.sportsBook ? odds.markets[0].outcomes.map((outcome) => {
                                            if (outcome.name === (awayTeam.team.location === 'LA' ? 'Los Angeles ' + awayTeam.team.name : awayTeam.team.location + " " + awayTeam.team.name)) {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Over
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {
                                    return (
                                        odds.key === props.sportsBook ? odds.markets[2].outcomes.map((outcome) => {
                                            if (outcome.name === 'Over') {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', textAlign: 'left' }}>
                    <Col>
                        @
                    </Col>
                </Row>
                {/* home team */}
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center' }} xs={1}>
                        <img src={homeTeam.team.logo}
                            variant="top"
                            style={{
                                height: 'auto',
                                maxHeight: '28px',
                                width: 'auto',
                                maxWidth: '28px',
                                backgroundColor: '#7a7582'
                            }}></img>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        {props.sport === 'soccer' ? null : `${homeTeam.team.abbreviation}`} {props.sport === 'soccer' ? homeTeam.team.shortDisplayName : `${homeTeam.team.name}`}
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }} xs={2}>
                        {homeTeam.records[0].summary}
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Spread
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {
                                    return (
                                        odds.key === props.sportsBook ? odds.markets[1].outcomes.map((outcome) => {
                                            if (outcome.name === (homeTeam.team.location === 'LA' ? 'Los Angeles ' + homeTeam.team.name : homeTeam.team.location + " " + homeTeam.team.name)) {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Money
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ backgroundColor: homeOddsBGColor, borderRadius: 15 }}>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {
                                    return (
                                        odds.key === props.sportsBook ? odds.markets[0].outcomes.map((outcome) => {
                                            if (outcome.name === (homeTeam.team.location === 'LA' ? 'Los Angeles ' + homeTeam.team.name : homeTeam.team.location + " " + homeTeam.team.name)) {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col>
                                Under
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {eventOdds ? eventOdds.bookmakers.map((odds) => {
                                    return (
                                        odds.key === props.sportsBook ? odds.markets[2].outcomes.map((outcome) => {
                                            if (outcome.name === 'Under') {
                                                return (outcome.price)
                                            }
                                        }) : null
                                    )

                                }) : null}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
            : null
    )
}

export default MatchupCard