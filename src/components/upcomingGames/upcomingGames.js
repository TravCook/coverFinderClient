import { useState, useEffect } from 'react'
import { Container, Row, Col, } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'



const UpcomingGames = (props) => {
    const [games, setGames] = useState()
    const [highIndex, sethighIndex] = useState()
    const [lowIndex, setlowIndex] = useState()

    const upcomingGamesGet = () => {
        fetch('http://localhost:3001/api/odds').then((res) => {
            res.json().then((data) => {
                let sortedData = data.sort((a, b) => moment.utc(a.commence_time) - moment.utc(b.commence_time))
                if(data.length > 10)data.length=10
                setGames(sortedData)
            })
        })
    }
    const highIndexGet = () => {
        fetch('http://localhost:3001/api/odds/highIndex').then((res) => {
            res.json().then((data) => {
                data.length = 5
                // let sortedData = data.sort((a, b) => moment.utc(a.gameIndex.commence_time) - moment.utc(b.gameIndex.commence_time))
                sethighIndex(data)
            })
        })
    }
    const lowIndexGet = () => {
        fetch('http://localhost:3001/api/odds/lowIndex').then((res) => {
            res.json().then((data) => {
                data.length = 5
                // let sortedData = data.sort((a, b) => moment.utc(a.gameIndex.commence_time) - moment.utc(b.gameIndex.commence_time))
                setlowIndex(data)
            })
        })
    }

    useEffect(() => {
        upcomingGamesGet()
        highIndexGet()
        lowIndexGet()
    }, [])



    return (

        <Container fluid >
            <Row >
                <Col lg={3}>
                <Row>
                    <Col>
                        <h2>Stat Favorites</h2>
                    </Col>
                </Row>
                    <Row>
                        {highIndex ? highIndex.map((game) => {

                            return moment(game.commence_time).isBefore(moment().add(6, 'days')) ?

                                <Col xs={12}>
                                    <MatchupCard key={game._id} gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                </Col>
                                : <></>

                        }) : <> </>}
                    </Row>
                </Col>
                <Col lg={6}>
                <Row>
                    <Col>
                        <h2>Upcoming Games</h2>
                    </Col>
                </Row>
                    <Row>
                        {games ? games.map((game) => {
                            return moment(game.commence_time).isBefore(moment().add(7, 'days')) ?
                                <Col xs={12} md={6}>
                                    <MatchupCard key={game._id} gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                </Col>
                                : <></>
                        }) : <> </>}
                    </Row>

                </Col>
                <Col lg={3}>
                <Row>
                    <Col>
                        <h2>Bad Teams</h2>
                    </Col>
                </Row>
                    <Row>
                        {lowIndex ? lowIndex.map((game) => {
                            return moment(game.commence_time).isBefore(moment().add(6, 'days')) ?

                                <Col xs={12}>
                                    <MatchupCard key={game._id} gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                                </Col>


                                : <></>
                        }) : <> </>}
                    </Row>

                </Col>

            </Row>
        </Container>
    )
}

export default UpcomingGames