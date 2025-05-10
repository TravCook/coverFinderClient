import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Button, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'react-bootstrap'
import PastGamesDisplay from '../pastGames/pastGames.js';
import { isSameDay, formatDate, combinedCondition, valueBetConditionCheck } from '../../utils/constants.js';
import { setPastOdds } from '../../redux/odds/actions/oddsActions.js'
import { setTeams } from '../../redux/teams/actions/teamActions';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MatchupCard from '../matchupCard/matchupCard.js';


const Results = () => {
    const dispatch = useDispatch()
    document.title = 'Results'
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set time to midnight

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    fifteenDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight

    const sixyDaysAgo = new Date();
    sixyDaysAgo.setDate(sixyDaysAgo.getDate() - 60);
    sixyDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight

    let indexRows = ["1-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35", "35-40", "40-45", "45-50"]
    let winrateRows = ["1-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"]
    let confidenceRows = ["1-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"]

    const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
    const { games, pastGames, sports } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    const [overallChartDataFinal, setoverallChartDataFinal] = useState()


    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/api/odds/pastGameOdds`, {
            method: "POST",
        }).then((res) => res.json()).then((data) => {
            console.log(data)
            dispatch(setPastOdds(data.pastGames))
        })
    }, [])

    useEffect(() => {
        let overallChartData = []
        for (let i = 0; i < 21; i++) {
            let dataDate = new Date()
            dataDate.setDate(dataDate.getDate() - i);
            dataDate.setHours(0, 0, 0, 0);  // Set time to midnight

            let dataGames = pastGames.filter((game) => isSameDay(new Date(game.commence_time), dataDate))

            let valueGames = dataGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames))

            let overallWinRate = dataGames.filter((game) => game.predictionCorrect === true).length / dataGames.length

            let valueWinRate = valueGames.filter((game) => game.predictionCorrect === true).length / valueGames.length

            overallChartData.unshift({
                date: `${dataDate.getDate()}/${dataDate.getMonth() + 1}/${dataDate.getFullYear()}`,
                winrates: [overallWinRate * 100, valueWinRate * 100]
            })
        }
        console.log(overallChartData)
        setoverallChartDataFinal(overallChartData)
    }, [pastGames])



    let valueGames = pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames))
    let todayGames = pastGames.filter((game) => isSameDay(new Date(game.commence_time), new Date()))
    todayGames.length === 0 ? todayGames = pastGames : todayGames = todayGames
    return (
        <Container fluid style={{ position: 'relative', top: 60, backgroundColor: '#121212', margin: '1em 0' }}>
            <Row style={{ border: 'solid .25em gray' }}>
                <Row style={{ fontSize: '.85rem', textAlign: 'center' }}>
                    <Row>
                        <Col>
                            ALL GAMES
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            Total Games
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {pastGames.filter((game) => game.predictionCorrect === true || game.predictionCorrect === false).length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Total wins
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {pastGames.filter((game) => game.predictionCorrect === true).length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today Games
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {todayGames.length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today wins
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {todayGames.filter((game) => game.predictionCorrect === true).length}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            Total Value
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Total V wins
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today Value
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {todayGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today V wins
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {todayGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            Games/Day
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {(pastGames.length / 7).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Wins/Day
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {(pastGames.filter((game) => game.predictionCorrect === true).length / 7).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Total winrate
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {((pastGames.filter((game) => game.predictionCorrect === true).length / pastGames.filter((game) => game.predictionCorrect === true || game.predictionCorrect === false).length) * 100).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today winrate
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {((todayGames.filter((game) => game.predictionCorrect === true).length / todayGames.length) * 100).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            Value/Day
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {(pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length / 7).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Vwins/Day
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {(pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / 7).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            V winrate
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {((pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length) * 100).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            Today V
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {((todayGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / todayGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length) * 100).toFixed(2)}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                </Row>
                <Row>
                    {overallChartDataFinal && <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={overallChartDataFinal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="winrates[0]" fill="#8884d8" name='Winrate' />
                            <Bar dataKey="winrates[1]" fill="#82ca9d" name='Value Winrate' />
                        </BarChart>
                    </ResponsiveContainer>}
                </Row>
                {pastGames && <PastGamesDisplay displayGames={pastGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames))} />}
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {sports.filter((sport) => pastGames.filter((game) => game.sport_key === sport.name).length > 0).map((sport) => {
                    let sportNameArr = sport.name.split('_')
                    let leagueName = sportNameArr[1]
                    let sportGames = pastGames.filter((game) => game.sport_key === sport.name).filter((game) => isSameDay(new Date(game.commence_time), new Date()))
                    sportGames.length === 0 ? sportGames = pastGames.filter((game) => game.sport_key === sport.name) : sportGames = sportGames

                    let sportChartData = []
                    for (let x = 0; x < 21; x++) {
                        let dataDate = new Date()
                        dataDate.setDate(dataDate.getDate() - x);
                        dataDate.setHours(0, 0, 0, 0);  // Set time to midnight

                        let dataGames = pastGames.filter((game) => game.sport_key === sport.name).filter((game) => isSameDay(new Date(game.commence_time), dataDate))

                        let valueGames = dataGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames))

                        let overallWinRate = dataGames.filter((game) => game.predictionCorrect === true).length / dataGames.length

                        let valueWinRate = valueGames.filter((game) => game.predictionCorrect === true).length / valueGames.length

                        sportChartData.unshift({
                            date: `${dataDate.getDate()}/${dataDate.getMonth() + 1}/${dataDate.getFullYear()}`,
                            winrates: [overallWinRate * 100, valueWinRate * 100]
                        })
                    }
                    let sportSettings = sport?.valueBetSettings.find((setting) => setting.bookmaker === sportsbook)
                    let valueBetSettings = sportSettings?.settings
                    return (
                        <Col xs={12} style={{ border: 'solid .25em gray', margin: '1em auto' }}>
                            <Row style={{ fontSize: '.85rem', textAlign: 'center' }}>
                                <Row>
                                    <Col>
                                        {leagueName.toUpperCase()}
                                    </Col>
                                    <Col>
                                        { valueBetSettings && <Row>
                                            <Col>Value Settings</Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        {`(${valueBetSettings?.indexDiffSmallNum} - ${valueBetSettings?.indexDiffSmallNum + valueBetSettings?.indexDiffRangeNum})`}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                    {`(${((valueBetSettings?.confidenceLowNum) * 100).toFixed(0)} - ${((valueBetSettings?.confidenceLowNum + valueBetSettings?.confidenceRangeNum) * 100).toFixed(0)})`}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Total Games
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {sportGames.length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Total wins
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {sportGames.filter((game) => game.predictionCorrect === true).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today Games
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {todayGames.filter((game) => game.sport_key === sport.name).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today wins
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {todayGames.filter((game) => game.sport_key === sport.name).filter((game) => game.predictionCorrect === true).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Total Value
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Total V wins
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today Value
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {todayGames.filter((game) => game.sport_key === sport.name).filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today V wins
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {todayGames.filter((game) => game.sport_key === sport.name).filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Games/Day
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {(sportGames.length / 7).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Wins/Day
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {(sportGames.filter((game) => game.predictionCorrect === true).length / 7).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Total winrate
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {((sportGames.filter((game) => game.predictionCorrect === true).length / sportGames.length) * 100).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today winrate
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {((todayGames.filter((game) => game.sport_key === sport.name).filter((game) => game.predictionCorrect === true).length / todayGames.filter((game) => game.sport_key === sport.name).length) * 100).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Value/Day
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {(sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length / 7).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Vwins/Day
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {(sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / 7).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        V winrate
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {((sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / sportGames.filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length) * 100).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        Today V
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {((todayGames.filter((game) => game.sport_key === sport.name).filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).filter((game) => game.predictionCorrect === true).length / todayGames.filter((game) => game.sport_key === sport.name).filter((game) => valueBetConditionCheck(sports, game, sportsbook, pastGames)).length) * 100).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>
                            </Row>

                            {<ResponsiveContainer width='100%' height={250}>
                                <BarChart data={sportChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="winrates[0]" fill="#8884d8" name='Winrate' />
                                    <Bar dataKey="winrates[1]" fill="#82ca9d" name='Value Winrate' />
                                </BarChart>
                            </ResponsiveContainer>}
                            {pastGames && <PastGamesDisplay displayGames={sportGames.length > 0 ? sportGames : pastGames.filter((game) => game.sport_key === sport.name)} />}
                        </Col>

                    )


                })}
            </Row>

        </Container>
    )
}

export default Results
