import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'



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
            setGames(data)
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
                        <Col>
                            <MatchupCard key={game._id} gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                        </Col>
                    )
                }) : null}
            </Row>
        </Container>
    )
}

export default SingleSportDisplay