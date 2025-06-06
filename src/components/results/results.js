import { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import PastGamesDisplay from '../pastGames/pastGames.js';
import { isSameDay, valueBetConditionCheck, calculateProfitFromImpliedProb, calculateProfitFromUSOdds } from '../../utils/constants.js';
import { setPastOdds } from '../../redux/odds/actions/oddsActions.js'
import { useDispatch, useSelector } from 'react-redux';


const Results = () => {
    const dispatch = useDispatch()
    document.title = 'Results'

    const { sportsbook } = useSelector((state) => state.user);
    const { pastGames, sports } = useSelector((state) => state.games)
    const [valueProfitToday, setValueProfitToday] = useState(0)
    const [profitToday, setProfitToday] = useState(0)
    const [valueProfitThisWeek, setValueProfitThisWeek] = useState(0)
    const [profitThisWeek, setProfitThisWeek] = useState(0)
    const [stake, setStake] = useState(1)

    // useEffect(() => {
    //     fetch(`http://${process.env.REACT_APP_API_URL}/api/odds/pastGameOdds`, {
    //         method: "POST",
    //     }).then((res) => res.json()).then((data) => {
    //         dispatch(setPastOdds(data.pastGames))
    //     })
    // }, [sports, sportsbook, dispatch])

    useEffect(() => {
        let profitTodayTemp = 0
        let valueProfitTodayTemp = 0
        pastGames.filter((game) => game.commence_time && isSameDay(new Date(game.commence_time), new Date())).forEach((game) => {
            if(game.predictionCorrect === true){
                let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook)
                let market = bookmaker && bookmaker.markets.find((market) => market.key === 'h2h')
                let outcome = market && market.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team))
                if(outcome){
                    if(outcome.impliedProb){
                        setProfitToday(profitTodayTemp += calculateProfitFromUSOdds(outcome.price, stake))
                        if(valueBetConditionCheck(sports, game, sportsbook)){
                            setValueProfitToday(valueProfitTodayTemp += calculateProfitFromUSOdds(outcome.price, stake))
                        }
                    }else{
                        console.log(game.id)
                    }
                    
                }
            }else if(game.predictionCorrect === false){
                let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook)
                let market = bookmaker && bookmaker.markets.find((market) => market.key === 'h2h')
                let outcome = market && market.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team))
                if(outcome){
                    setProfitToday(profitTodayTemp -= stake)
                    if(valueBetConditionCheck(sports, game, sportsbook)){
                        setValueProfitToday(valueProfitTodayTemp -= stake)
                    }
                }
            }
        })
        pastGames.forEach((game) => {
            if(game.predictionCorrect === true){
                let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook)
                let market = bookmaker && bookmaker.markets.find((market) => market.key === 'h2h')
                let outcome = market && market.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team))
                if(outcome){
                    if(outcome.impliedProb){
                        setProfitThisWeek(profitTodayTemp += calculateProfitFromUSOdds(outcome.price, stake))
                        if(valueBetConditionCheck(sports, game, sportsbook)){
                            setValueProfitThisWeek(valueProfitTodayTemp += calculateProfitFromUSOdds(outcome.price, stake))
                        }
                    }else{
                        console.log(game.id)
                    }
                    
                }
            }else if(game.predictionCorrect === false){
                let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook)
                let market = bookmaker && bookmaker.markets.find((market) => market.key === 'h2h')
                let outcome = market && market.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team))
                if(outcome){
                    setProfitThisWeek(profitTodayTemp -= stake)
                    if(valueBetConditionCheck(sports, game, sportsbook)){
                        setValueProfitThisWeek(valueProfitTodayTemp -= stake)
                    }
                }
            }
        })
    }, [pastGames])


    return (
        <Container fluid style={{ position: 'relative', top: 60, backgroundColor: '#121212', margin: '1em 0' }}>
            <Row>
                <Card style={{ backgroundColor: '#2a2a2a' }}>
                    <Row>
                        <Col style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}>
                            Today's Games
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: '.5em' }}>
                            <Card style={{ backgroundColor: '#2a2a2a' }}>
                                <Card.Body>
                                    <Card.Title style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}> Profit: {profitToday.toFixed(2)}</Card.Title>
                                    <Card.Text style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                        {pastGames && pastGames.length > 0 ? (
                                            <PastGamesDisplay
                                                displayGames={pastGames.filter((game) => game.commence_time && isSameDay(new Date(game.commence_time), new Date()))}
                                            />
                                        ) : (
                                            <div style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                                No past games available.
                                            </div>
                                        )}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4} style={{ padding: '.5em' }}>
                            <Card style={{ backgroundColor: '#3c3c3c' }}>
                                <Card.Body>
                                    <Card.Title style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}>Profit: {valueProfitToday.toFixed(2)}</Card.Title>
                                    <Card.Text style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                        {pastGames && pastGames.length > 0 ? (
                                            <PastGamesDisplay
                                                displayGames={pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook)).filter((game) => game.commence_time && isSameDay(new Date(game.commence_time), new Date()))}
                                            />
                                        ) : (
                                            <div style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                                No past games available.
                                            </div>
                                        )}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Row>
            <Row>
            <Card style={{ backgroundColor: '#2a2a2a' }}>
                    <Row>
                        <Col style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}>
                            This Week's Games
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: '.5em' }}>
                            <Card style={{ backgroundColor: '#2a2a2a' }}>
                                <Card.Body>
                                    <Card.Title style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}>Profit: {profitThisWeek.toFixed(2)}</Card.Title>
                                    <Card.Text style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                        {pastGames && pastGames.length > 0 ? (
                                            <PastGamesDisplay
                                                displayGames={pastGames}
                                            />
                                        ) : (
                                            <div style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                                No past games available.
                                            </div>
                                        )}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4} style={{ padding: '.5em' }}>
                            <Card style={{ backgroundColor: '#3c3c3c' }}>
                                <Card.Body>
                                    <Card.Title style={{ color: 'white', fontSize: '2em', textAlign: 'center' }}>Profit: {valueProfitThisWeek.toFixed(2)}</Card.Title>
                                    <Card.Text style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                        {pastGames && pastGames.length > 0 ? (
                                            <PastGamesDisplay
                                                displayGames={pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook))}
                                            />
                                        ) : (
                                            <div style={{ color: 'white', fontSize: '1.5em', textAlign: 'center' }}>
                                                No past games available.
                                            </div>
                                        )}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Row>
        </Container>
    )
}

export default Results
