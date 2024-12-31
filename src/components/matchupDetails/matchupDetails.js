import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Table } from 'react-bootstrap';

const MatchupDetails = (props) => {
    const { id } = useParams(); // Get the matchup ID from the URL
    const [gameData, setGameData] = useState(null);

    const statLabels = {
        'seasonWinLoss': 'Season Win-Loss',
        'homeWinLoss': 'Home Win-Loss',
        'awayWinLoss': 'Away Win-Loss',
        'pointDiff': 'Point Differential',
        'pointsPerGame': 'Points Per Game',
        'turnoverDiff': 'Turnover Differential',
        'totalPointsPerGame': 'Points Per Game',
        'yardsPerCompletion': 'Yards Per Completion',
        'yardsPerRushAttempt': 'Yards Per Rush Attempt',
        'thirdDownConvRate': 'Third Down Conversion Percentage',
        'redZoneEfficiency': 'Red Zone Efficiency Percentage',
        'sackRate': 'Sack Rate', //CHECK THIS IN DB
        'completionPercentage': 'Completion Percentage',
        'rushingYardsPerGame': 'Rushing Yards Per Game',
        'yardsAllowedPerGame': 'Yards Allowed Per Game',
        'avgTimeofPossession': 'Average Time of Possession (seconds)',
        'penaltyYardsPerGame': 'Total Penalty Yards',
        'powerPlayPct': 'Power Play Percentage',
        'penKillPct': 'Penalty Kill Percentage',
        'avgShots': 'Average Shots',
        'savePct': 'Save Percentage',
        'avgGoals': 'Average Goals',
        'faceoffsWon': 'Faceoffs Won',
        'avgGoalsAgainst': 'Goals Against Average',
        'shootingPct': 'Shooting Percentage',
        'blockedShots': 'Blocked Shots',
        'giveaways': 'Giveaways',
        'takeaways': 'Takeaways',
        'onBasePct': 'On-Base Percentage',
        'slugAvg': 'Slugging Percentage',
        'ERA': 'Earned Run Average',
        'strikeoutToWalkRatio': 'Strikeout to Walk Ratio',
        'fieldingPct': 'Fielding Percentage',
        'stolenBasePct': 'Stolen Base Percentage',
        'errors': 'Fielding Errors',
        'qualityStarts': 'Quality Starts',
        'homeRuns': 'Home Runs',
        'effectiveFGPct': 'Effective Field Goal Percentage',
        'turnoverRatio': 'Turnover Ratio',
        'threePointFieldGoalPct': '3-Point Field Goal Percentage',
        'avgOffensiveRebounds': 'Average Offensive Rebounds',
        'freeThrowPct': 'Free Throw Percentage',
        'assistTurnoverRatio': 'Assist to Turnover Ratio',
        'pointsInPaint': 'Points in Paint',
        'avgDefensiveRebounds': 'Average Defensive Rebounds',
        'paceFactor': 'Pace Factor'
    };

    // Fetch the detailed game data based on the ID
    useEffect(() => {
        fetch(`http://localhost:3001/api/odds/${id}`) // Use the appropriate endpoint for detailed data
            .then((res) => res.json())
            .then((data) => setGameData(data));
    }, [id]);

    if (!gameData) {
        return <div>Loading...</div>;
    }

    // Destructure home and away team stats
    const { home_team, away_team, homeTeamStats, awayTeamStats, commence_time, location, homeTeamIndex, awayTeamIndex } = gameData;
    const rows = []; // Create an array to hold the table rows

    for (let key in homeTeamStats) {
        console.log(key)
        if (key === 'seasonWinLoss') {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        {awayTeamStats[key] > homeTeamStats[key] ? <td style={{ backgroundColor: '#497e3e' }}>{awayTeamStats[key]}</td> : <td style={{ backgroundColor: '#803c3c' }}>{awayTeamStats[key]}</td>}
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{ backgroundColor: '#497e3e' }}>{homeTeamStats[key]}</td> : <td style={{ backgroundColor: '#803c3c' }}>{homeTeamStats[key]}</td>}
                    </tr>
                );
            }
        } else if (key === 'homeWinLoss') {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        <td >{awayTeamStats[key]}</td>
                        {homeTeamStats[key] > awayTeamStats['awayWinLoss'] ? <td style={{ backgroundColor: '#497e3e' }}>{homeTeamStats[key]}</td> : <td style={{ backgroundColor: '#803c3c' }}>{homeTeamStats[key]}</td>}
                    </tr>
                );
            }
        } else if (key === 'awayWinLoss') {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = statLabels[key] || key;
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        {awayTeamStats[key] > homeTeamStats['homeWinLoss'] ? <td style={{ backgroundColor: '#497e3e' }}>{awayTeamStats[key]}</td> : <td style={{ backgroundColor: '#803c3c' }}>{awayTeamStats[key]}</td>}
                        {<td>{homeTeamStats[key]}</td>}
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
                        {awayTeamStats[key] > homeTeamStats[key] ? <td style={{ backgroundColor: '#497e3e' }}>{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td> : <td style={{ backgroundColor: '#803c3c' }}>{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{ backgroundColor: '#497e3e' }}>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td> : <td style={{ backgroundColor: '#803c3c' }}>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                    </tr>
                );
            }
        }

    }

    // Function to render team stats table
    const renderStatsTable = (homeStats, awayStats) => {
        return (
            <Table bordered variant='dark'>
                <thead >
                    <tr>
                        <th>Stat</th>
                        <th>{away_team}<sup>{awayTeamIndex.toFixed(2).padEnd(4, '0')}</sup></th>
                        <th>{home_team}<sup>{homeTeamIndex.toFixed(2).padEnd(4, '0')}</sup></th>
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
                    <Row className="my-4">
                        <Col md={12}>
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
                                <Button variant="primary">
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
