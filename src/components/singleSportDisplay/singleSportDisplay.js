import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'
import { Link, useNavigate } from 'react-router' // Import useNavigate for navigation

const SingleSportDisplay = (props) => {
    const [games, setGames] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate(); // Initialize the navigate function

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

    // Function to navigate back to the landing page
    const handleBackToLanding = () => {
        props.setPageSelect('Home') // Redirect to the landing page
    }

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
                            <MatchupCard valueBets={props.valueBets} todaysGames={props.todaysGames} betType={props.betType} key={game.id} bankroll={props.bankroll} gameData={game} sportsbook={props.sportsBook}  winRates={props.winRates} />
                        ))
                    ) : (
                        <Col style={{ textAlign: 'center' }}>
                            <p>No upcoming games found.</p>
                        </Col>
                    )
                )}
            </Row>

            {/* Button to navigate back to the landing page */}
            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                <Col style={{ textAlign: 'center' }}>
                <Link to={"/"} >
                <Button variant="primary">
                        Back to Landing Page
                    </Button>
                </Link>

                </Col>
            </Row>
        </Container>
    )
}

export default SingleSportDisplay
