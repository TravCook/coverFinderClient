import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Table } from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { statLabels } from '../../utils/constants'

const MatchupDetails = () => {
    const { id } = useParams(); // Get the matchup ID from the URL
    const [gameData, setGameData] = useState(null);
    const { pastGames } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    let homeTeam

    if (Array.isArray(teams) && teams.length > 0) {
        homeTeam = teams.find((team) => team.espnDisplayName === gameData.home_team);
    }
    // const homeTeam = teams.find((team) => team.espnDisplayName === gameData.home_team)

    // Fetch the detailed game data based on the ID
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/api/odds/${id}`) // Use the appropriate endpoint for detailed data
            .then((res) => res.json())
            .then((data) => setGameData(data));
    }, [id]);

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const renderAwayRecent = () => {
        let awayTeamGames = pastGames.filter((game) => game.away_team === gameData.away_team || game.home_team === gameData.away_team).sort((a, b) => moment(a.commence_time).isBefore(moment(b.commence_time)) ? 1 : -1)

        return (
            awayTeamGames.map((game) => {
                return (
                    <Col xs={2} style={{ padding: 0 }}>
                        <Row>
                            <Col style={{ padding: 0, }}>{game.away_team === gameData.away_team && game.awayScore > game.homeScore ? <img src={game.awayTeamlogo} style={{ borderRadius: '25%', border: '2px solid #c69f42', width: '200%', maxWidth: '30px' }}></img> : <img src={game.awayTeamlogo} style={{ width: '200%', maxWidth: '30px' }}></img>}</Col>
                            <Col  style={{ padding: 0 }}>{game.home_team === gameData.home_team ? 'vs' : '@'}</Col>
                            <Col style={{ padding: 0, }}>{game.home_team === gameData.away_team && game.awayScore < game.homeScore ? <img src={game.homeTeamlogo} style={{ borderRadius: '25%', border: '2px solid #c69f42', width: '200%', maxWidth: '30px' }}></img> : <img src={game.homeTeamlogo} style={{ width: '200%', maxWidth: '30px' }}></img>}</Col>
                        </Row>
                    </Col>
                )
            })
        )
    }

    const renderHomeRecent = () => {
        let homeTeamGames = pastGames.filter((game) => game.home_team === gameData.home_team || game.away_team === gameData.home_team).sort((a, b) => moment(a.commence_time).isBefore(moment(b.commence_time)) ? 1 : -1)

        return (
            homeTeamGames.map((game) => {
                return (
                    <Col xs={2} style={{ padding: 0 }}>
                        <Row>
                            <Col style={{ padding: 0}}>{game.away_team === gameData.home_team && game.awayScore > game.homeScore ? <img src={game.awayTeamlogo} style={{ borderRadius: '25%', border: '2px solid #c69f42', width: '200%', maxWidth: '30px' }}></img> : <img src={game.awayTeamlogo} style={{ width: '200%', maxWidth: '30px' }}></img>}</Col>
                            <Col style={{ padding: 0 }}>{game.home_team === gameData.home_team ? 'vs' : '@'}</Col>
                            <Col style={{ padding: 0 }}>{game.home_team === gameData.home_team && game.awayScore < game.homeScore ? <img src={game.homeTeamlogo} style={{ borderRadius: '25%', border: '2px solid #c69f42', width: '200%', maxWidth: '30px' }}></img> : <img src={game.homeTeamlogo} style={{ width: '200%', maxWidth: '30px' }}></img>}</Col>
                        </Row>
                    </Col>
                )
            })
        )
    }



    // Destructure home and away team stats
    const { home_team, away_team, homeTeamStats, homeTeamAbbr, awayTeamAbbr, awayTeamStats, commence_time, location, homeTeamIndex, awayTeamIndex, homeTeamlogo, awayTeamlogo } = gameData;
    const rows = []; // Create an array to hold the table rows
    for (let key in statLabels) {
        if (key === 'seasonWinLoss') {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                let homeArr = homeTeamStats[key].split('-')
                let homeWins = homeArr[0]
                let awayArr = awayTeamStats[key].split('-')
                let awayWins = awayArr[0]
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        <td>{homeWins > awayWins ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}</td>
                    </tr>
                );
            }
        } else if (key === 'homeWinLoss') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                let homeArr = homeTeamStats['homeWinLoss'].split('-')
                let homeWins = homeArr[0]
                let awayArr = awayTeamStats['awayWinLoss'].split('-')
                let awayWins = awayArr[0]
                rows.push(
                    <tr key="homeWinLoss">
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        {/* This last cell will be shared with the awayWinLoss row */}
                        <td>
                            {homeTeamStats[key]}
                        </td>
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2" id="sharedHomeWinLossCell">{homeWins > awayWins ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}</td>
                    </tr>
                );
            }
        } else if (key === 'awayWinLoss') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="awayWinLoss" style={{ borderBottomWidth: '10px' }}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                    </tr>
                );
            }
        } else if (key === 'pace' || key === 'walkToStrikeoutRatio' || key === 'touchBackPercentage') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="pace" style={{ borderBottomWidth: '10px' }}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}
                    </tr>
                );
            }
        } else if (key === 'fieldGoalMakesperAttempts' || key === 'freeThrowsMadeperAttemps') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="stringValues">
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        {parseInt(homeTeamStats[key]) > parseInt(awayTeamStats[key]) ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}
                    </tr>
                );
            }
        } else if (key === 'interceptions' || key === 'giveaways') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="reverse-compare">
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        {homeTeamStats[key] < awayTeamStats[key] ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}
                    </tr>
                );
            }
        } else {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        {<td >{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {<td>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo}></img>{away_team}</td>}
                    </tr>
                );
            }
        }

    }

    // Function to render team stats table
    const renderStatsTable = (homeStats, awayStats) => {
        return (
            <Table bordered variant='dark'>
                <thead>
                    <tr>
                        <th style={{}}>Stat</th>
                        <th style={{}}>{awayTeamAbbr}</th>
                        <th style={{}}>{homeTeamAbbr}</th>
                        <th style={{}}>Edge</th>
                    </tr>
                </thead>
                <tbody>
                    {rows ? rows : <></>}
                </tbody>


            </Table>
        );
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Card style={{ backgroundColor: '#0A0A0B', color: 'white' }}>
                <Card.Body >
                    <p><strong>Start Time:</strong> {new Date(commence_time).toLocaleString()}</p>
                    <Row>
                        <Col style={{ fontSize: '1.5rem' }}>
                            <Row>
                                <Col>
                                    <img style={{ width: '200%', maxWidth: '60px' }} src={awayTeamlogo}></img>
                                    {away_team}

                                </Col></Row>
                            <Row><Col style={{ fontSize: '1.5rem' }}>{`${gameData.away_team.split(" ")[gameData.away_team.split(" ").length-1]} Recent Games`}</Col></Row>
                            <Row>
                                <Col>
                                    <Row style={{ display: 'flex', justifyContent: 'space-around' }}>{renderAwayRecent()}</Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>BB INDEX</Col>
                                <Col>{awayTeamIndex.toFixed(2).padEnd(4, '0')}</Col>
                            </Row>
                        </Col>
                        <Col style={{alignContent: 'center'}} xs={1}>
                            VS
                        </Col>
                        <Col style={{ fontSize: '1.5rem' }}>
                            <Row>
                                <Col>
                                    <img style={{ width: '200%', maxWidth: '60px' }} src={homeTeamlogo}></img>
                                    {home_team}
                                </Col>
                            </Row>
                            <Row><Col>{`${gameData.home_team.split(" ")[gameData.home_team.split(" ").length-1]} Recent Games`}</Col></Row>
                            <Row>
                                <Col>
                                    <Row style={{ display: 'flex', justifyContent: 'space-around' }}>{renderHomeRecent()}</Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>BB INDEX</Col>
                                <Col>{homeTeamIndex.toFixed(2).padEnd(4, '0')}</Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Col>
                            <Card style={{ backgroundColor: '#0A0A0B', color: 'white' }}>
                                <Card.Body>
                                    <h5>Team Stats Comparison</h5>
                                    {renderStatsTable(homeTeamStats, awayTeamStats)}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Link to={"/"}>
                                <Button style={{ backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                                    Back to Landing Page
                                </Button>
                            </Link>

                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MatchupDetails;
