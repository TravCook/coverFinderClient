import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { isSameDay } from '../../utils/constants';
import RecentGames from '../recentGames/recentGames';
import { generalStats, offenseStats, defenseStats, passingStats, receivingStats, rushingStats, kickingStats, returningStats, penaltyStats, battingStats, pitchingStats, fieldingStats } from '../../utils/constants'

const MatchupDetails = () => {
    const { id } = useParams(); // Get the matchup ID from the URL
    const [gameData, setGameData] = useState(null);
    const [selectedSection, setSelectedSection] = useState(generalStats); // Default section
    const [statHeaderSport, setStatSport] = useState(['General', 'Offense', 'Defense'])
    const { pastGames } = useSelector((state) => state.games)

    const formatGameTime = (time) => {
        const gameTime = new Date(time);
        return isSameDay(time, new Date())
          ? gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour12: true });
      };

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/api/odds/${id}`) // Use the appropriate endpoint for detailed data
            .then((res) => res.json())
            .then((data) => {
                setGameData(data)
                if (data.sport === 'basketball') {
                    setStatSport(['General', 'Offense', 'Defense'])
                } else if (data.sport === 'football') {
                    setStatSport(['General', 'Passing', 'Rushing', 'Receiving', 'Defense', 'Kicking', 'Returning'])
                }
                else if (data.sport === 'baseball') {
                    setStatSport(['General', 'Batting', 'Pitching', 'Fielding'])
                }
                else if (data.sport === 'hockey') {
                    setStatSport(['General', 'Offense', 'Defense', 'Penalty'])
                }

            });



    }, [id]);

    if (!gameData) {
        return <div>Loading...</div>;
    }


    // Destructure home and away team stats
    const { home_team, away_team, homeTeamStats, homeTeamAbbr, awayTeamAbbr, awayTeamStats, commence_time, homeTeamIndex, awayTeamIndex, homeTeamlogo, awayTeamlogo } = gameData;
    const rows = []; // Create an array to hold the table rows
    for (let key in selectedSection) {
        if (key === 'seasonWinLoss') {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = selectedSection[key] || key;
                let homeArr = homeTeamStats[key].split('-')
                let homeWins = homeArr[0]
                let awayArr = awayTeamStats[key].split('-')
                let awayWins = awayArr[0]
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                        <td>{homeWins > awayWins ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo} alt='home team logo'></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo} alt='away team logo'></img>{away_team}</td>}</td>
                    </tr>
                );
            }
        } else if (key === 'homeWinLoss') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = selectedSection[key] || key;
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
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2" id="sharedHomeWinLossCell">{parseInt(homeWins) >= parseInt(awayWins) ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} alt='home team logo' src={homeTeamlogo}></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo} alt='away team logo'></img>{away_team}</td>}</td>
                    </tr>
                );
            }
        } else if (key === 'awayWinLoss') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = selectedSection[key] || key;
                rows.push(
                    <tr key="awayWinLoss">
                        <td>{label}</td>
                        <td>{awayTeamStats[key]}</td>
                        <td>{homeTeamStats[key]}</td>
                    </tr>
                );
            }
        } else if (key === 'USFBgiveaways' || 
                key === 'USFBtotalPenyards' || 
                key === 'USFBaveragePenYardsPerGame' || 
                key === 'BSKBturnoversPerGame' || 
                key === 'BSKBoffensiveTurnovers') {
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = selectedSection[key] || key;
                rows.push(
                    <tr key={key}>
                    <td>{label}</td>
                    {<td >{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                    {<td>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                    {homeTeamStats[key] < awayTeamStats[key] ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo} alt='home team logo'></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo} alt='away team logo'></img>{away_team}</td>}
                </tr>
                );
            }
        }
        else {
            // Make sure the key exists in both homeStats and awayStats
            if (homeTeamStats.hasOwnProperty(key) && awayTeamStats.hasOwnProperty(key)) {
                const label = selectedSection[key] || key;
                rows.push(
                    <tr key={key}>
                        <td>{label}</td>
                        {<td >{awayTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {<td>{homeTeamStats[key].toFixed(2).padEnd(4, '0')}</td>}
                        {homeTeamStats[key] > awayTeamStats[key] ? <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={homeTeamlogo} alt='home team logo'></img>{home_team}</td> : <td style={{ textAlign: 'left' }}><img style={{ width: '200%', maxWidth: '30px' }} src={awayTeamlogo} alt='away team logo'></img>{away_team}</td>}
                    </tr>
                );
            }
        }

    }

    // Function to render team stats table
    const renderStatsTable = (homeStats, awayStats) => {
        return (
            <Card style={{ background: 'linear-gradient(90deg, rgba(44,44,44,1) 0%, rgba(94,94,94,1) 50%, rgba(44,44,44,1) 100%)', borderColor: '#575757' }}>
                <Card.Header className="d-flex justify-content-evenly align-items-center">
                    {statHeaderSport ? statHeaderSport.map((header) => {
                        switch (header) {
                            case 'General':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(generalStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Offense':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(offenseStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Defense':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(defenseStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Passing':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(passingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Receiving':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(receivingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Rushing':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(rushingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Kicking':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(kickingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Returning':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(returningStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Penalty':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(penaltyStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Batting':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(battingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Pitching':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(pitchingStats)}
                                    >
                                        {header}
                                    </Button>
                                )
                            case 'Fielding':
                                return (

                                    <Button
                                        style={{ cursor: 'pointer',  fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                                        onClick={() => setSelectedSection(fieldingStats)}
                                    >
                                        {header}
                                    </Button>
                                )

                        }


                    }) : <></>}
                </Card.Header>
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
            </Card>

        );
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Card style={{ backgroundColor: '#0A0A0B', color: 'white' }}>
                <Card.Body >

                    <Row>
                        <Col style={{ fontSize: '1.5rem' }}>
                            <Row>
                                <Col>
                                    <img style={{ width: '200%', maxWidth: '60px' }} src={awayTeamlogo} alt='away team logo'></img>
                                    {away_team}

                                </Col>
                            </Row>
                            <Row>
                                <Col>{awayTeamIndex > homeTeamIndex ? <span>BBI: {awayTeamIndex.toFixed(2).padEnd(4, '0')}<sup style={{color: 'rgba(0, 255, 0, .4)'}}>▲</sup></span> : <span>BBI: {awayTeamIndex.toFixed(2).padEnd(4, '0')}</span>}</Col>
                            </Row>
                            <Row><Col style={{ fontSize: '1.5rem' }}>{`Recent Games`}</Col></Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <RecentGames team={gameData.away_team} />
                                    </Row>
                                </Col>
                            </Row>

                        </Col>
                        <Col style={{ fontSize: '1.5rem' }} xs={2}>
                        <p>{formatGameTime(gameData.commence_time)}</p>
                        </Col>
                        <Col style={{ fontSize: '1.5rem' }}>
                            <Row>
                                <Col>
                                    <img style={{ width: '200%', maxWidth: '60px' }} src={homeTeamlogo} alt='home team logo'></img>
                                    {home_team}
                                </Col>
                            </Row>
                            <Row>
                                <Col>{homeTeamIndex > awayTeamIndex ? <span>BBI: {homeTeamIndex.toFixed(2).padEnd(4, '0')}<sup style={{color: 'rgba(0, 255, 0, .4)'}}>▲</sup></span> : <span>BBI: {homeTeamIndex.toFixed(2).padEnd(4, '0')}</span>}</Col>
                            </Row>
                            <Row><Col>{`Recent Games`}</Col></Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <RecentGames team={gameData.home_team} />
                                    </Row>
                                </Col>
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
