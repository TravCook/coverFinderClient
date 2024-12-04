import { useState, useEffect } from 'react'
import { Container, Row, Col, Button} from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'



const UpcomingGames = (props) => {
    const [games, setGames] = useState()
    let sports = [
        {
            name: "americanfootball_nfl",
            espnSport: 'Football',
            league: 'NFL',
            startMonth: 9,
            endMonth: 2,
            multiYear: true,
            statYear: 2024
        },
        {
            name: "americanfootball_ncaaf",
            espnSport: 'Football',
            league: 'NCAAF',
            startMonth: 9,
            endMonth: 1,
            multiYear: true,
            statYear: 2024
        },
        {
            name: "basketball_nba",
            espnSport: 'Basketball',
            league: 'NBA',
            startMonth: 10,
            endMonth: 4,
            multiYear: true,
            statYear: 2024
        },
        {
            name: "icehockey_nhl",
            espnSport: 'Hockey',
            league: 'NHL',
            startMonth: 10,
            endMonth: 4,
            multiYear: true,
            statYear: 2025,
            prevstatYear: 2024
        },
        {
            name: "baseball_mlb",
            espnSport: 'Baseball',
            league: 'MLB',
            startMonth: 3,
            endMonth: 10,
            multiYear: false,
            statYear: 2024
        },
    ]

    const upcomingGamesGet = () => {
        fetch('http://localhost:3001/api/odds').then((res) => {
            res.json().then((data) => {
                let sortedData = data.sort((a, b) => moment.utc(a.commence_time) === moment.utc(b.commence_time) ? a.winPercent - b.winPercent : moment.utc(a.commence_time) - moment.utc(b.commence_time))
                setGames(sortedData)
            })
        })
    }

    const handleClick = (event) => {
        props.setPageSelect(event.target.id)
    }
    useEffect(() => {
        upcomingGamesGet()
    }, [])

    return (

        <Container fluid >
            <Row>
                <Col xs={12} md={9}>
                    <Row>
                        <Row>
                            <Row>High Win Chance</Row>
                            <Row style={{overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
                               {games ? games.filter((game)=> game.winPercent >= .60).filter((game) => moment(game.commence_time).local().isBefore(moment().add(1, 'days'))).sort((a, b) => a.winPercent === b.winPercent ? b.commence_time - a.commence_time : b.winPercent - a.winPercent).map((game) => {
                                console.log(game)
                                    return (
                                            <MatchupCard gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                    ) 
                                }) : null}
                            </Row>
                        </Row>
                        <Row>
                            <Row>High Stat Disparity</Row>
                            <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
                            {games ? games.filter((game)=> (game.homeTeamIndex - game.awayTeamIndex) > 5 || (game.awayTeamIndex - game.homeTeamIndex) > 5).filter((game) => moment(game.commence_time).local().isBefore(moment().add(1, 'days'))).sort((a, b) => a.winPercent === b.winPercent ? b.commence_time - a.commence_time : b.winPercent - a.winPercent).map((game) => {
                                console.log(game)
                                    return (
                                            <MatchupCard gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                    )
                                }) : null}
                            </Row>
                        </Row>
                        {sports.map((sport) => {
                            if (sport.multiYear) {
                                if (moment().format('M') > sport.startMonth || moment().format('M') < sport.endMonth) {
                                    if (games) {
                                        if (games.filter((game) => game.sport_title === sport.league).filter((game) => moment(game.commence_time).local().isBefore(moment().add(6, 'days'))).length > 0) {
                                            return (
                                                <Row>
                                                    <Row>
                                                        <Col>{`Upcoming ${sport.league} Games`}</Col>
                                                        <Col style={{textAlign: 'right'}}>
                                                            <Button id={sport.espnSport} style={{backgroundColor: '#0A0A0B', borderColor: '#0A0A0B'}} onClick={handleClick}>see more</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
                                                        {games ? games.filter((game) => game.sport_title === sport.league).filter((game) => moment(game.commence_time).local().isBefore(moment().add(6, 'days'))).map((game, idx) => {
                                                            return (
                                                                    <MatchupCard gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                                            )
                                                        }) : null}
                                                    </Row>
                                                </Row>
                                            )
                                        }
                                    }
                                }
                            } else {
                                if (moment().format('M') > sport.startMonth && moment().format('M') < sport.endMonth) {
                                    if (games) {
                                        if (games.filter((game) => game.sport_title === sport.league).filter((game) => moment(game.commence_time).local().isBefore(moment().add(1, 'days'))).length > 0) {
                                            return (
                                                <Row>
                                                    <Row>
                                                    <Col>{`Upcoming ${sport.league} Games`}</Col>
                                                        <Col>
                                                            <Button>see more</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>{games ? games.filter((game) => game.sport_title === sport.league).filter((game) => moment(game.commence_time).local().isBefore(moment().add(1, 'days'))).map((game, idx) => {
                                                        return (
                                                                <MatchupCard gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                                        )
                                                    }) : null}</Row>
                                                </Row>
                                            )
                                        }
                                    }
                                }
                            }
                        })}
                    </Row>
                </Col>
                <Col xs={12} md={3}>
                    <Row>
                        <Col style={{ textAlign: 'center' }}>
                            Parlay Picker
                        </Col>
                        <Row>
                            PARLAY PICKER MODULE WHEN MADE
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default UpcomingGames