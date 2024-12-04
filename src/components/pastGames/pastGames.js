import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import PastGameCard from '../pastGameCard/pastGameCard.js'
import moment from 'moment'



const PastGamesDisplay = (props) => {
    const [games, setGames] = useState()
    const [searchFilter, setSearchFilter] = useState()

    const pastGamesGet = () => {
        fetch('http://localhost:3001/api/odds/pastGameOdds', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => res.json()).then((data) => {
            // console.log(data)
            let sortedData = data.sort((a, b) => moment.utc(b.commence_time) - moment.utc(a.commence_time))
            //TODO: PAGINATION HERE??
            setGames(sortedData)
        })
    }

    useEffect(() => {
        pastGamesGet()
    }, [searchFilter])



    return (

        <Container fluid >
            <Row>

                <Col>
                    <Row>
                    <Col>Date Picker</Col>
                    <Col>League</Col>
                    <Col>Teams</Col>
                    <Col>Home Index</Col>
                    <Col>Away Index</Col>
                    <Col>Win Percent Range</Col>
                    <Col>Index Difference Range</Col>
                    </Row>
                </Col>
                <Col>
                    {games ? `${((games.filter((game) => game.predictionCorrect).length / games.length) * 100).toFixed(2)}%` : null}
                </Col>

            </Row>
            <Row style={{display: 'flex', justifyContent: 'space-evenly'}}>
                {games ? games.map((game) => {
                    return (
                            <PastGameCard  gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} ></PastGameCard>
                    )
                }) : null}
            </Row>
        </Container>
    )
}

export default PastGamesDisplay