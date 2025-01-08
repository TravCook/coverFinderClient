import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Table } from 'react-bootstrap';

const MatchupDetails = (props) => {
    const { id } = useParams(); // Get the matchup ID from the URL
    const [gameData, setGameData] = useState(null);

    const statLabels = {
        'seasonWinLoss': 'Season Win-Loss',
        'homeWinLoss': 'Home Win-Loss',
        'awayWinLoss': 'Away Win-Loss', // SAME FOR EVERY SPORT
        'pointDiff': 'Point Differential',
        'PointsTotal': 'Total Points',
        'pointsPergame': 'Points per Game',
        'effectiveFieldGoalPct': 'Effective FG %',
        'fieldGoalMakesperAttempts': 'FG Makes per Attempt',
        'freeThrowsMadeperAttemps': 'FT Makes per Attempt',
        'freeThrowPct': 'FT%',
        'threePointPct': '3Pt%',
        'trueShootingPct': 'True Shooting%',
        'pointsinPaint': 'Points in Paint',
        'pace': 'Pace',
        //OFFENSE
        'ReboundsTotal': 'Total Rebounds',
        'defensiveRebounds': 'Defensive Rebounds',
        'defensiveReboundsperGame': 'Defensive Rebounds per Game',
        'offensiveRebounds': 'Offensive Rebounds',
        'offensiveReboundsperGame': 'Offensive Rebounds per Game',
        'blocksTotal': 'Total blocks',
        'blocksPerGame': 'Blocks per Game',
        'steals': 'Total Steals',
        'stealsperGame': 'Steals per Game',
        'totalTurnovers': 'Total Turnovers',
        'averageTurnovers': 'Avg Turnover per game',
        'turnoverRatio': 'Turnover Ratio',
        'assisttoTurnoverRatio': 'Assist to Turnover Ratio',
        //DEFENSE

    };

    // Fetch the detailed game data based on the ID
    useEffect(() => {
        fetch(`http://3.137.71.56:3001/api/odds/${id}`) // Use the appropriate endpoint for detailed data
            .then((res) => res.json())
            .then((data) => setGameData(data));
    }, [id]);

    if (!gameData) {
        return <div>Loading...</div>;
    }

    // Destructure home and away team stats
    const { home_team, away_team, homeTeamStats, awayTeamStats, commence_time, location, homeTeamIndex, awayTeamIndex, homeTeamlogo, awayTeamlogo } = gameData;
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
                        <td>{homeWins > awayWins ? <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={homeTeamlogo}></img>{home_team}</td>: <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={awayTeamlogo}></img>{away_team}</td>}</td>
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
                        <td style={{verticalAlign: 'middle'}}rowSpan="2" id="sharedHomeWinLossCell">{homeWins > awayWins ? <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={homeTeamlogo}></img>{home_team}</td>: <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={awayTeamlogo}></img>{away_team}</td>}</td>
                    </tr>
                );
            }
        } else if (key === 'awayWinLoss') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="awayWinLoss" style={{borderBottomWidth: '10px'}}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                    </tr>
                );
            }
        } else if (key === 'pace') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key="pace" style={{borderBottomWidth: '10px'}}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={homeTeamlogo}></img>{home_team}</td> : <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={awayTeamlogo}></img>{away_team}</td>}
                    </tr>
                );
            }
        }else{
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                console.log(awayTeamStats[key])
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        {<td >{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {<td>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={homeTeamlogo}></img>{home_team}</td> : <td style={{textAlign: 'left'}}><img style={{width: '20%'}} src={awayTeamlogo}></img>{away_team}</td>}
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
                        <th style={{width: '11vw'}}>Stat</th>
                        <th style={{width: '11vw'}}>{away_team}<sup>{awayTeamIndex.toFixed(2).padEnd(4, '0')}</sup></th>
                        <th style={{width: '11vw'}}>{home_team}<sup>{homeTeamIndex.toFixed(2).padEnd(4, '0')}</sup></th>
                        <th style={{width: '10vw'}}>Edge</th>
                    </tr>
                </thead>
                <tbody>
                    {rows ? rows : <></>}
                </tbody>


            </Table>
        );
    };

    return (
        <div style={{ textAlign: 'center'}}>
            <Card className="my-4" style={{backgroundColor: '#0A0A0B', color: 'white'}}>
                <Card.Body >
                    <h1>{away_team} vs. {home_team}</h1>
                    <p><strong>Start Time:</strong> {new Date(commence_time).toLocaleString()}</p>
                    <Row className="my-4" style={{display: 'flex', justifyContent: 'center'}}>
                        <Col md={6}>
                            <Card style={{backgroundColor: '#0A0A0B', color: 'white'}}>
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
                                <Button style={{backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'}}>
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
