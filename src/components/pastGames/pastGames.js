import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Button, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import { sports, isSameDay, formatDate } from '../../utils/constants.js';
import { useSelector } from 'react-redux';

const PastGamesDisplay = ({timePeriod}) => {
    const [filteredGames, setFilteredGames] = useState([]);  // Initialize as an empty array
    const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
    const { games, pastGames } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);
    const todaysGames = games.filter((game) => isSameDay(game.commence_time, new Date()));
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLeague, setSelectedLeague] = useState(''); // Default to no league


    const leagues = ['americanfootball_nfl', 'americanfootball_ncaaf', 'basketball_nba', 'basketball_wncaab', 'basketball_ncaab', 'icehockey_nhl', 'baseball_mlb', 'none'];

    // Function to format the date based on the selected time period
    const formatDateByPeriod = (date, period) => {
        const formattedDate = new Date(date);
        switch (period) {
            case 'week':
                // Get the start of the week (Monday)
                formattedDate.setDate(formattedDate.getDate() - formattedDate.getDay() + 1); // Adjust for Monday
                return formatDate(formattedDate);
            case 'month':
                return formattedDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            case 'year':
                return formattedDate.getFullYear().toString();
            case 'day':
            default:
                return formatDate(date);
        }
    };

    // Group games by their selected time period
    useEffect(() => {
        const groupedGames = pastGames.filter((game) => game.homeTeamIndex !== game.awayTeamIndex)
            .reduce((groups, game) => {
                const formattedDate = formatDateByPeriod(game.commence_time, timePeriod);

                if (!groups[formattedDate]) {
                    groups[formattedDate] = [];
                }
                if (!selectedLeague || game.sport_key === selectedLeague) {
                    groups[formattedDate].push(game);
                }

                return groups;
            }, {});

        // Convert grouped games into an array of date-based pages
        const groupedGamesArray = Object.entries(groupedGames).map(([date, games]) => ({
            date,
            games
        }));

        setFilteredGames(groupedGamesArray); // Set the filtered grouped games
    }, [pastGames, timePeriod, selectedLeague]); // Dependencies: when pastGames, timePeriod, or selectedLeague change

        // Calculate the win rate
        const calculateWinRate = (games) => {
            const totalGames = games.length;
            const correctGames = games.filter((game) => game.predictionCorrect === true).length;
            return totalGames > 0 ? (correctGames / totalGames) * 100 : 0; // Return 0 if no games
        };
    
        const currentGames = filteredGames[currentPage] ? filteredGames[currentPage].games : [];
        const winRate = calculateWinRate(currentGames);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <Container fluid>
            <Row>


                {/* Dropdown for League */}
                <Col xs={6} md={3}>
                    <Dropdown>
                        <DropdownToggle variant="success" id="dropdown-basic">
                            {selectedLeague ? selectedLeague : 'Select League'}
                        </DropdownToggle>
                        <DropdownMenu>
                            {leagues.map((league) => (
                                <DropdownItem key={league} onClick={() => setSelectedLeague(league === 'none' ? '' : league)}>
                                    {league.replace(/_/g, ' ').toUpperCase()}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </Col>

                {/* Win Rate Display */}
                <Col xs={12} md={3} className="d-flex align-items-center">
                    <span><strong>Win Rate: </strong>{winRate.toFixed(2)}%</span>
                </Col>
            </Row>

            {/* Games List */}
            <Row>
                <Col xs={12} md={6}>
                    <Row style={{ maxHeight: '27rem', overflow: 'scroll' }}>
                        {currentGames.filter((game) => game.predictionCorrect === true).map((game) => (
                            <Col xs={12} xl={6}>
                                <MatchupCard final={true} bankroll={bankroll} betType={betType} todaysGames={todaysGames} key={game.id} gameData={game} sportsbook={sportsbook} />
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col xs={12} md={6}>
                    <Row style={{ maxHeight: '27rem', overflow: 'scroll' }}>
                        {currentGames.filter((game) => game.predictionCorrect === false).map((game) => (
                            <Col xs={12} xl={6}>
                                <MatchupCard teams={teams[game.sport]} final={true} bankroll={bankroll} betType={betType} todaysGames={todaysGames} key={game.id} gameData={game} sportsbook={sportsbook} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* Pagination */}
            <Row>
                <Col>
                    <Button style={{ backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }} disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                    <Button style={{ backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }} disabled={currentPage >= filteredGames.length - 1} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default PastGamesDisplay;
