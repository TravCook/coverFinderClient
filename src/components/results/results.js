import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Button, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import PastGamesDisplay from '../pastGames/pastGames.js';
import { sports, isSameDay, formatDate } from '../../utils/constants.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const Results = () => {
      document.title = 'Results'
    const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
    const { games, pastGames } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    const [chartData, setChartData] = useState([]);
    const [leagueData, setLeagueData] = useState([])
    const [selectedLeague, setSelectedLeague] = useState('americanfootball_nfl')
    const leagueKeys = [
        'americanfootball_nfl', 'americanfootball_ncaaf', 'basketball_nba',
        'basketball_wncaab', 'basketball_ncaab', 'icehockey_nhl', 'baseball_mlb'
    ];
    const timePeriods = ['day', 'week', 'month', 'year'];
    
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('day'); // Default to 'day'
    // Custom Tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, winPercentage } = payload[0].payload;  // Access the data of the active point
            return (
                <div style={{ backgroundColor: '#303036', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#d4d2d5' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Date: {date}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>Win Percentage: {winPercentage.toFixed(2)}%</p>
                </div>
            );
        }

        return null;
    };

    // Helper function to get the year and week number
    function getYearWeek(date) {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + 1) / 7);
        return { year: date.getFullYear(), week };
    }

    const processData = (games, timeUnit) => {
        const groupedData = {};

        // Process each game
        games.forEach((game) => {
            const date = new Date(game.commence_time);
            let timeKey;

            switch (timeUnit) {
                case "week":
                    const yearWeek = getYearWeek(date);
                    timeKey = `${yearWeek.year}-W${yearWeek.week}`; // Format as year-week
                    break;
                case "month":
                    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    timeKey = yearMonth; // Format as year-month
                    break;
                case "year":
                    timeKey = `${date.getFullYear()}`; // Use just the year
                    break;
                case "day":
                default:
                    timeKey = date.toLocaleDateString(); // Default to day (format as YYYY-MM-DD)
                    break;
            }

            const correctPrediction = game.predictionCorrect ? 1 : 0;

            if (!groupedData[timeKey]) {
                groupedData[timeKey] = { totalGames: 0, correctPredictions: 0 };
            }

            groupedData[timeKey].totalGames += 1;
            groupedData[timeKey].correctPredictions += correctPrediction;
        });

        // Convert to an array of objects suitable for Recharts
        const chartData = Object.keys(groupedData).map((key) => ({
            timeKey: key,
            winPercentage: (groupedData[key].correctPredictions / groupedData[key].totalGames) * 100,
        }));

        // Sort by timeKey (the sorting will depend on the timeUnit)
        chartData.sort((a, b) => {
            if (timeUnit === "week") {
                const [yearA, weekA] = a.timeKey.split('-W').map(Number);
                const [yearB, weekB] = b.timeKey.split('-W').map(Number);
                return yearA === yearB ? weekA - weekB : yearA - yearB;
            } else if (timeUnit === "month") {
                const [yearA, monthA] = a.timeKey.split('-').map(Number);
                const [yearB, monthB] = b.timeKey.split('-').map(Number);
                return yearA === yearB ? monthA - monthB : yearA - yearB;
            } else if (timeUnit === "year") {
                return a.timeKey - b.timeKey;
            } else { // day or default sorting
                return new Date(a.timeKey) - new Date(b.timeKey);
            }
        });

        return chartData;
    };



    const processLeagueData = (games, timeUnit) => {
        const leagueData = {};

        // Initialize the leagueData structure with empty objects for each league
        leagueKeys.forEach((league) => {
            leagueData[league] = {};
        });

        // Process each game
        games.forEach((game) => {
            const date = new Date(game.commence_time);
            let timeKey;

            const correctPrediction = game.predictionCorrect ? 1 : 0;
            const league = game.sport_key;

            // Only process the games for the defined leagues
            if (leagueKeys.includes(league)) {
                // Dynamically create the timeKey based on the selected timeUnit
                switch (timeUnit) {
                    case "week":
                        const { year, week } = getYearWeek(date);
                        timeKey = `${year}-W${week}`; // Format as year-week
                        break;
                    case "month":
                        timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format as year-month
                        break;
                    case "year":
                        timeKey = `${date.getFullYear()}`; // Just the year
                        break;
                    case "day":
                    default:
                        timeKey = date.toLocaleDateString(); // Default to day (format as YYYY-MM-DD)
                        break;
                }

                // Initialize the leagueData structure for the timeKey if it doesn't exist
                if (!leagueData[league][timeKey]) {
                    leagueData[league][timeKey] = { totalGames: 0, correctPredictions: 0 };
                }

                // Increment the total games and correct predictions
                leagueData[league][timeKey].totalGames += 1;
                leagueData[league][timeKey].correctPredictions += correctPrediction;
            }
        });

        // Convert the leagueData into a format suitable for Recharts
        const formattedData = {};

        Object.keys(leagueData).forEach((league) => {
            const timeData = leagueData[league];

            // Only add leagues with at least one game
            const leagueChartData = Object.keys(timeData).map((time) => ({
                timeKey: time,
                winPercentage: (timeData[time].correctPredictions / timeData[time].totalGames) * 100,
            }));

            // If the league has data, add it to the formatted data
            if (leagueChartData.length > 0) {
                // Sort the league chart data based on the timeUnit
                leagueChartData.sort((a, b) => {
                    if (timeUnit === "week") {
                        const [yearA, weekA] = a.timeKey.split('-W').map(Number);
                        const [yearB, weekB] = b.timeKey.split('-W').map(Number);
                        return yearA === yearB ? weekA - weekB : yearA - yearB;
                    } else if (timeUnit === "month") {
                        const [yearA, monthA] = a.timeKey.split('-').map(Number);
                        const [yearB, monthB] = b.timeKey.split('-').map(Number);
                        return yearA === yearB ? monthA - monthB : yearA - yearB;
                    } else if (timeUnit === "year") {
                        return a.timeKey - b.timeKey;
                    } else { // day or default sorting
                        return new Date(a.timeKey) - new Date(b.timeKey);
                    }
                });

                // Add the formatted data for the league
                formattedData[league] = leagueChartData;
            }
        });

        return formattedData;
    };



    useEffect(() => {
        const data = processData(pastGames, selectedTimePeriod);  // Assuming pastGames is your data
        setChartData(data);
        const leagueData = processLeagueData(pastGames, selectedTimePeriod)
        setLeagueData(leagueData)
    }, [pastGames, selectedTimePeriod]);

    console.log(chartData)

    return (
        <Container fluid>
            <Row>                {/* Dropdown for Time Period */}
                <Col xs={6} md={3}>
                    <Dropdown>
                        <DropdownToggle variant="success" id="dropdown-basic">
                            {selectedTimePeriod.charAt(0).toUpperCase() + selectedTimePeriod.slice(1)} {/* Capitalize first letter */}
                        </DropdownToggle>
                        <DropdownMenu>
                            {timePeriods.map((period) => (
                                <DropdownItem key={period} onClick={() => setSelectedTimePeriod(period)}>
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </Col></Row>
            <Row style={{ height: '42vh' }}>
                <Row>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>Overall</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>NFL</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData[selectedLeague]}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>NCAAF</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['americanfootball_ncaaf']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>NHL</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['icehockey_nhl']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>

                </Row>
                <Row>

                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>NBA</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['basketball_nba']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>NCAAB</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['basketball_ncaab']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>WNCAAB</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['basketball_wncaab']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>
                                <span>MLB</span>
                            </Col>
                        </Row>

                        {/* Graph Row */}
                        <Row>
                            <Col>
                                <ResponsiveContainer width="100%" height={175}>
                                    <LineChart data={leagueData['baseball_mlb']}>
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} interval={0} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="winPercentage" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>

                    </Col>

                </Row>

            </Row>
            <Row>
                <Col>
                    <PastGamesDisplay timePeriod={selectedTimePeriod} />
                </Col>
            </Row>
        </Container>
    )
}

export default Results
