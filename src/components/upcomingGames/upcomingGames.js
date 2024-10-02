import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'



const UpcomingGames = (props) => {
    const [games, setGames] = useState()

    const upcomingGamesGet = () => {
        fetch('http://localhost:3001/api/odds').then((res) => {
            res.json().then((data) => {

                let sortedData = data.sort((a, b) => moment.utc(a.commence_time) - moment.utc(b.commence_time))
                setGames(sortedData)
            })
        })
    }

    useEffect(() => {

        upcomingGamesGet()
    }, [])



    return (

        <Container fluid >
            <Row>
                <Col sm={3}>
                
                </Col>
                <Col sm={6}>
                <Row>
                  {games ? games.map((game) => {
                    return (
                        <Col>
                            <MatchupCard key={game.id} gameData={game} sportsbook={props.sportsBook} ></MatchupCard>
                        </Col>
                    )
                }) : <> </>}  
                </Row>
                
                </Col>
                <Col sm={3}>
                
                
                </Col>

            </Row>
        </Container>
    )
}

export default UpcomingGames