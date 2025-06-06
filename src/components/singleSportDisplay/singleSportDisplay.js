import { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import { Link, useParams } from 'react-router' // Import useNavigate for navigation
import { useSelector } from 'react-redux';
import { isSameDay } from '../../utils/constants.js'

const SingleSportDisplay = (props) => {
    const { league } = useParams(); // Get the matchup ID from the URL
    const { games } = useSelector((state) => state.games)


    useEffect(() => {
    }, [games])

    // Function to navigate back to the landing page

    return (
        <Container fluid style={{ position: 'relative', top: 60, backgroundColor: '#121212' }}>
            {/* Button to navigate back to the landing page */}
            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                <Col style={{ textAlign: 'center' }}>
                    <Link to={"/"} >
                        <Button style={{ backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                            Back to Landing Page
                        </Button>
                    </Link>

                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {
                    games && games.filter((game) => game.sport_title === league.toUpperCase()).length > 0 ? (
                        games.filter((game) => game.sport_title === league.toUpperCase()).map((game) => (
                            <Col xs={12} sm={4} xl={3}>
                                <MatchupCard todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))} key={game.id} gameData={game} />
                            </Col>

                        ))
                    ) : (
                        <Col style={{ textAlign: 'center' }}>
                            <p>No upcoming games found.</p>
                        </Col>
                    )
                }
            </Row>


        </Container>
    )
}

export default SingleSportDisplay
