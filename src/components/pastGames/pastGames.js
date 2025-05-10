import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Button, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import { isSameDay, formatDate, combinedCondition } from '../../utils/constants.js';
import { useSelector } from 'react-redux';

const PastGamesDisplay = ({ timePeriod, displayGames }) => {
    const [filteredGames, setFilteredGames] = useState([]);  // Initialize as an empty array
    const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
    const { games, pastGames, sports } = useSelector((state) => state.games);
    const todaysGames = games.filter((game) => isSameDay(game.commence_time, new Date()));
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLeague, setSelectedLeague] = useState(''); // Default to no league
    const [sortByValue, setSortBy] = useState('')
    let totalValueGames


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
        const groupedGames = displayGames.filter((game) => game.homeTeamIndex !== game.awayTeamIndex)
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

    const calculateValueWinRate = (games) => {
        const totalGames = games.length;
        // &&  Math.abs(game.predictedWinner === 'home' ? game.homeTeamIndex - game.awayTeamIndex : game.awayTeamIndex - game.homeTeamIndex) >25
        // Filter games based on the sportsbook and the impliedProb condition
        const filteredGames = games.filter(game => {
            const bookmaker = game.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
            if (bookmaker) {
                const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');

                let outcome = marketData?.outcomes?.find(o => {
                    return o.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team)
                });

                if (outcome) {
                    let currentSport = sports?.find(arraySport => arraySport.name === game.sport_key)
                    let sportSettings = currentSport?.valueBetSettings.find((setting) => setting.bookmaker === sportsbook)
                    if (sportSettings !== undefined) {
                        // let valueBetCheck = combinedCondition(game, outcome, sportSettings.settings.indexDiffSmallNum, sportSettings.settings.indexDiffRangeNum, sportSettings.settings.confidenceLowNum, sportSettings.settings.confidenceRangeNum)
                        // if (valueBetCheck) {
                        //     return game
                        // }
                    }

                }


            }
            return false;

        });
        totalValueGames = filteredGames
        const correctGames = filteredGames.filter(game => game.predictionCorrect === true).length;
        return totalGames > 0 ? (correctGames / filteredGames.length) * 100 : 0; // Return 0 if no games match the filter
    }


    const currentGames = filteredGames[currentPage] ? filteredGames[currentPage].games : [];
    const winRate = calculateWinRate(currentGames);
    const valueWinRate = calculateValueWinRate(currentGames)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <Row style={{paddingLeft: '1em'}}>
            <Col xs={6}>
                <Row style={{ display: 'flex', justifyContent: 'space-around', maxHeight: 330, overflowY: 'scroll'}}>
                    {displayGames.filter((game) => game.predictionCorrect === true).map((game) => {
                        return (
                            
                            <MatchupCard gameData={game} final={true} />

                        )
                    })}
                </Row>
            </Col>
            <Col xs={6}>
                <Row style={{ display: 'flex', justifyContent: 'space-around', maxHeight: 330, overflowY: 'scroll'}}>
                    {displayGames.filter((game) => game.predictionCorrect === false).map((game) => {
                        return (
                            <MatchupCard gameData={game} final={true} />
                        )
                    })}
                </Row>
            </Col>


            {/* Games List
            <Row style={{maxHeight: '25rem'}}>
                <Col style={{width: '50%'}} >
                    <Row style={{ overflowY: 'scroll' }}>
                        {currentGames.sort((a, b) => {
                            switch (sortByValue) {
                                case 'Start Time':
                                    return new Date(b.commence_time) - new Date(a.commence_time)
                                case 'Win Chance':
                                    return b.winPercent - a.winPercent
                                case 'BBI Delta':
                                    return (Math.abs(b.homeTeamIndex - b.awayTeamIndex) - (Math.abs(a.homeTeamIndex - a.awayTeamIndex)))
                            }
                        }).filter((game) => game.predictionCorrect === true).map((game) => (
                            <Col style={{padding: 0, width: '50%'}}>
                                <MatchupCard final={true} bankroll={bankroll} betType={betType} todaysGames={todaysGames} key={game.id} gameData={game} sportsbook={sportsbook} />
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col style={{width: '50%'}}>
                    <Row style={{ overflowY: 'scroll' }}>
                        {currentGames.sort((a, b) => {
                            switch (sortByValue) {
                                case 'Start Time':
                                    return new Date(b.commence_time) - new Date(a.commence_time)
                                case 'Win Chance':
                                    return b.winPercent - a.winPercent
                                case 'BBI Delta':
                                    return (Math.abs(b.predictedWinner === 'home' ? b.homeTeamIndex - b.awayTeamIndex : b.awayTeamIndex - b.homeTeamIndex) - Math.abs(a.predictedWinner === 'home' ? a.homeTeamIndex - a.awayTeamIndex : a.awayTeamIndex - a.homeTeamIndex))
                            }
                        }).filter((game) => game.predictionCorrect === false).map((game) => (
                            <Col  style={{padding: 0, width: '50%'}}>
                                <MatchupCard final={true} bankroll={bankroll} betType={betType} todaysGames={todaysGames} key={game.id} gameData={game} sportsbook={sportsbook} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row> */}

        </Row>
    );
}

export default PastGamesDisplay;
