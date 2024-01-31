import { useState, useEffect } from 'react'
import {
    genFootballScores,
    genAmericanFootballScores,
    genBaseballScores,
    genBasketballScores,
    genHockeyScores
} from '../../utils/searchUtils.js'
import { Container, Row, Col } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import Button from 'react-bootstrap/Button'

const UpcomingGames = () => {
    const [displaySport, setDisplaySport] = useState()
    const [NFLScores, setNFLScores] = useState()
    const [NHLScores, setNHLScores] = useState()
    const [NBAScores, setNBAScores] = useState()
    // genFootballScores()
    // genBaseballScores()

    const getNFLScores = async () => {
        const res = await genAmericanFootballScores()
        setNFLScores(res)
    }
    const getNHLScores = async () => {
        const res = await genHockeyScores()
        setNHLScores(res)
    }
    const getNBAScores = async () => {
        const res = await genBasketballScores()
        setNBAScores(res)
    }

    useEffect(() => {
        getNFLScores()
        getNHLScores()
        getNBAScores()
    }, [])

    console.log(NBAScores)

    return (

        <Container fluid style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            {/* <Row style={{ textAlign: "center"}}>
                <Col><h1>Upcoming Games</h1></Col>
            </Row>

            <Row style={{ textAlign: "center" }}> <Col><h2>NFL</h2></Col> </Row>
            <Container style={{ maxWidth: '100vw', display: 'grid', justifyContent: 'space-around', gridAutoFlow: 'column' }}>
                {NFLScores ? NFLScores.events.map((event) => { return (<Col style={{ padding: 10 }}><MatchupCard eventData={event} sport="football" league="nfl" /></Col>) }) : null}
            </Container>
            <Row style={{ textAlign: "center" }}> <Col><h2>NHL</h2></Col> </Row>
            <Container style={{ maxWidth: '100vw', display: 'flex', justifyContent: 'space-around', }}>
            </Container>
            <Row style={{ textAlign: "center" }}> <Col><h2>NBA</h2></Col> </Row>
            <Container style={{ maxWidth: '100vw', display: 'grid', justifyContent: 'space-around', gridAutoFlow: 'column' }}>
                {NBAScores ? NBAScores.events.map((event) => { return (<Col style={{ padding: 10 }}><MatchupCard eventData={event} sport="basketball" league="nba" /></Col>) }) : null}
            </Container> */} 
            {/* <Row style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
             {NFLScores ? NFLScores.events.slice(0,10).map((event) => { return (<MatchupCard eventData={event} sport="football" league="nfl" />) }) : null}   
            </Row> */}
            <Row style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            {NHLScores ? NHLScores.events.map((event) => { return (<MatchupCard eventData={event} sport="hockey" league="nhl" />) }) : null}  
            </Row>
            <Row style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            {NBAScores ? NBAScores.events.map((event) => { return (<MatchupCard eventData={event} sport="basketball" league="nba" />) }) : null} 
            </Row>
            
            
            

        </Container>
    )
}

export default UpcomingGames