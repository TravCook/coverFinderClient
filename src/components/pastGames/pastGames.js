import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Button, DropdownToggle, DropdownMenu } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import { sports, isSameDay, formatDate } from '../../utils/constants.js';
import { useSelector } from 'react-redux';

const PastGamesDisplay = () => {
    const [filteredGames, setFilteredGames] = useState([])  // Initialize as an empty array
    const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
    const { games, pastGames } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    const todaysGames = games.filter((game) => isSameDay(game.commence_time, new Date()))
    const [currentPage, setCurrentPage] = useState(0)

    const calculateDecimalOdds = (moneylineOdds) => {
        return moneylineOdds > 0 ? (moneylineOdds / 100) + 1 : (100 / -moneylineOdds) + 1;
    };

    const calculateKellyCriterion = (decimalOdds, impliedProb) => {
        return (decimalOdds * impliedProb - (1 - impliedProb)) / (decimalOdds - 1);
    };

    // Group games by their commence_time date
    useEffect(() => {
        const groupedGames = pastGames.filter((game) => game.homeTeamIndex != game.awayTeamIndex)
            .reduce((groups, game) => {
                const formattedDate = formatDate(game.commence_time)
                if (!groups[formattedDate]) {
                    groups[formattedDate] = []
                }
                groups[formattedDate].push(game)
                return groups
            }, {})

        // Convert grouped games into an array of date-based pages
        const groupedGamesArray = Object.entries(groupedGames).map(([date, games]) => ({
            date,
            games
        }))

        setFilteredGames(groupedGamesArray) // Set the filtered grouped games
    }, [pastGames])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const renderProfit = (type) => {
        let profit = 0
        let loss = 0
        let correctGames = []
        let incorrectGames = []
        let decimalOdds
        let betAmount
        currentGames.map((game) => {
            game.bookmakers.map((bookmaker) => {
                if (bookmaker.key === sportsbook) {
                    bookmaker.markets.map((market) => {
                        if (market.key === 'h2h') {
                            market.outcomes.map((outcome) => {
                                if (outcome.name === game.home_team && game.homeTeamIndex > game.awayTeamIndex && game.homeScore > game.awayScore && game.predictionCorrect) {
                                    correctGames.push(outcome)
                                } else if (outcome.name === game.away_team && game.awayTeamIndex > game.homeTeamIndex && game.awayScore > game.homeScore && game.predictionCorrect) {
                                    correctGames.push(outcome)
                                } else if (outcome.name === game.home_team && game.homeTeamIndex > game.awayTeamIndex && game.awayScore > game.homeScore) {
                                    incorrectGames.push(outcome)
                                } else if (outcome.name === game.away_team && game.awayTeamIndex > game.homeTeamIndex && game.homeScore > game.awayScore) {
                                    incorrectGames.push(outcome)
                                }
                            })
                        }
                    })
                }
            })
        })
        incorrectGames.map((game) => {
            decimalOdds = (calculateDecimalOdds(game.price))
            if (type === 'proportional') {
                betAmount = bankroll ? (bankroll / currentGames.length) : 5
            } else if (type === 'value') {
                betAmount = bankroll ? (bankroll / currentGames.length) : 5;
            } else if (type === 'kelley') {
                betAmount = bankroll ? (calculateKellyCriterion(decimalOdds, game.impliedProb) * bankroll) : (calculateKellyCriterion(decimalOdds, game.impliedProb) * 5)
            }
            loss = loss + betAmount
        })
        correctGames.map((game) => {
            decimalOdds = (calculateDecimalOdds(game.price))
            if (type === 'proportional') {
                betAmount = bankroll ? (bankroll / currentGames.length) : 5
            } else if (type === 'value') {
                betAmount = bankroll ? (bankroll / currentGames.length) : 5;
            } else if (type === 'kelley') {
                betAmount = bankroll ? (calculateKellyCriterion(decimalOdds, game.impliedProb) * bankroll) : (calculateKellyCriterion(decimalOdds, game.impliedProb) * 5)
            }
            profit = profit + ((betAmount * decimalOdds) - betAmount)
        })
        if (type === 'proportional') {
            return (profit - loss).toFixed(2)
        } else if (type === 'value') {
            return (profit - loss).toFixed(2)
        } else if (type === 'kelley') {
            return (profit - loss).toFixed(2)
        }
    }


    const currentGames = filteredGames[currentPage] ? filteredGames[currentPage].games : []

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Row style={{ fontSize: '.80rem' }}>
                        <Col>
                            {pastGames ? `Ovr Win Rate: ${((pastGames.filter((game) => game.homeTeamIndex != game.awayTeamIndex).filter((game) => game.predictionCorrect).length / pastGames.filter((game) => game.homeTeamIndex != game.awayTeamIndex).length) * 100).toFixed(2)}%` : <> </>}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Day Win Rate: ${((currentGames.filter((game) => game.predictionCorrect).length / currentGames.length) * 100).toFixed(2)}%` : <> </>}
                        </Col>
                        <Col>
                            {`Correct Games: ${currentGames.filter((game) => game.predictionCorrect).length}`}
                        </Col>
                        <Col>
                            {`Total Games: ${currentGames.length}`}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Prop Profit: $${renderProfit('proportional')}` : <> </>}
                        </Col>
                        <Col>
                            <Dropdown align="end">
                                <DropdownToggle
                                    style={{
                                        fontSize: '.75rem',
                                        backgroundColor: 'rgb(198 159 66)',
                                        borderColor: 'rgb(198 159 66)',
                                        color: '#121212',
                                    }}
                                >
                                    Winrates
                                </DropdownToggle>
                                <DropdownMenu style={{ padding: 5, backgroundColor: '#303036', textAlign: 'right', color: 'white' }}>
                                    {currentGames && sports.map((sport) => {
                                        // Filter current games for the sport's league
                                        const sportGames = currentGames.filter((game) => game.sport_title.toLowerCase() === sport.league.toLowerCase());

                                        if (sportGames.length === 0) return null;

                                        // Calculate the win rate for the league
                                        const totalGames = sportGames.length;
                                        const correctGames = sportGames.filter((game) => game.predictionCorrect).length;
                                        const winRate = ((correctGames / totalGames) * 100).toFixed(2); // Win rate in percentage

                                        return (
                                            <Row key={sport.league}>
                                                <Col>{sport.league.toUpperCase()}</Col>
                                                <Col>{winRate}%</Col>
                                            </Row>
                                        );
                                    })}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Games List */}
            <Row >
                <Col xs={12} md={6}>
                    <Row style={{ height: '54rem', overflow: 'scroll' }}>
                        {currentGames.filter((game) => game.predictionCorrect === true).map((game) => (
                            <Col xs={12} xl={6}>
                                <MatchupCard final={true} bankroll={bankroll} betType={betType} todaysGames={todaysGames} key={game.id} gameData={game} sportsbook={sportsbook} />
                            </Col>

                        ))}
                    </Row>

                </Col>
                <Col xs={12} md={6}>
                    <Row style={{ height: '54rem', overflow: 'scroll' }}>
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
    )
}

export default PastGamesDisplay
