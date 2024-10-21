import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'



const SingleSportDisplay = (props) => {
    const [games, setGames] = useState()

    const upcomingGamesGet = () => {
        fetch('http://localhost:3001/api/odds/sport', {
            method: 'POST',
            body: JSON.stringify({
                sport: props.pageSelect
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => res.json()).then((data) => {
            let sortedData = data.sort((a, b) => moment.utc(a.commence_time) - moment.utc(b.commence_time))
            //TODO: PAGINATION HERE??
            setGames(sortedData)
        })
    }

    useEffect(() => {

        upcomingGamesGet()
    }, [props.pageSelect])



    return (

        <Container fluid >
            <Row>
                {games ? games.map((game) => {
                    return (
                        <Col xs={12} md={4}>
                            <MatchupCard key={game.id} gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} ></MatchupCard>
                        </Col>
                    )
                }) : null}
            </Row>
        </Container>
    )
}

export default SingleSportDisplay