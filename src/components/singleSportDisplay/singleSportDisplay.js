import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'

const SingleSportDisplay = (props) => {
    const [games, setGames] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const upcomingGamesGet = () => {
        setLoading(true)
        fetch('http://localhost:3001/api/odds/sport', {
            method: 'POST',
            body: JSON.stringify({
                sport: props.pageSelect
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            let sortedData = data.sort((a, b) => moment.utc(a.commence_time) - moment.utc(b.commence_time))
            setGames(sortedData)
        })
        .catch((error) => {
            setError("Failed to load games. Please try again later.")
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        upcomingGamesGet()
    }, [props.pageSelect])

    return (
        <Container fluid>
            <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {loading && !error ? (
                    <Col style={{ textAlign: 'center' }}>
                        <Spinner animation="border" />
                    </Col>
                ) : error ? (
                    <Col style={{ textAlign: 'center' }}>
                        <p>{error}</p>
                    </Col>
                ) : (
                    games && games.length > 0 ? (
                        games.map((game) => (
                            <MatchupCard key={game.id} gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} />
                        ))
                    ) : (
                        <Col style={{ textAlign: 'center' }}>
                            <p>No upcoming games found.</p>
                        </Col>
                    )
                )}
            </Row>
        </Container>
    )
}

export default SingleSportDisplay
