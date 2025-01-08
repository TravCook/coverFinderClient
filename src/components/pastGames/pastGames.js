import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap'
import PastGameCard from '../pastGameCard/pastGameCard.js'
import moment from 'moment'
import MatchupCard from '../matchupCard/matchupCard.js'

const PastGamesDisplay = (props) => {
    const [filteredGames, setFilteredGames] = useState([])  // Initialize as an empty array
    const [searchFilter, setSearchFilter] = useState({
        startDate: '',
        endDate: '',
        league: '',
        teams: '',
        homeIndexRange: [0, 100],
        awayIndexRange: [0, 100],
        winPercentRange: [0, 100],
    })
    const [currentPage, setCurrentPage] = useState(0)

    // Function to calculate decimal odds from moneyline odds
    const calculateDecimalOdds = (moneylineOdds) => {
        return moneylineOdds > 0 ? (moneylineOdds / 100) + 1 : (100 / -moneylineOdds) + 1;
    };

    const calculateKellyCriterion = (decimalOdds, impliedProb) => {
        return (decimalOdds * impliedProb - (1 - impliedProb)) / (decimalOdds - 1);
      };

    // Group games by their commence_time date
    useEffect(() => {
        const groupedGames = props.games
            // .filter((game) => {
            //     const gameDate = moment.utc(game.commence_time)
            //     const isWithinDateRange =
            //         (!searchFilter.startDate || gameDate.isAfter(moment(searchFilter.startDate))) &&
            //         (!searchFilter.endDate || gameDate.isBefore(moment(searchFilter.endDate)))
            //     return isWithinDateRange
            // })
            .reduce((groups, game) => {
                const date = moment.utc(game.commence_time).local().format('YYYY-MM-DD') // Group by date
                if (!groups[date]) {
                    groups[date] = []
                }
                groups[date].push(game)
                return groups
            }, {})

        // Convert grouped games into an array of date-based pages
        const groupedGamesArray = Object.entries(groupedGames).map(([date, games]) => ({
            date,
            games
        }))

        setFilteredGames(groupedGamesArray) // Set the filtered grouped games
    }, [props.games, searchFilter])

    const handleDateChange = (e) => {
        const { name, value } = e.target
        setSearchFilter((prev) => ({
            ...prev,
            [name]: value
        }))
    }

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
                if (bookmaker.key === props.sportsBook) {
                    bookmaker.markets.map((market) => {
                        if (market.key === 'h2h') {
                            market.outcomes.map((outcome) => {
                                if (outcome.name === game.home_team && game.homeTeamIndex > game.awayTeamIndex && game.homeScore > game.awayScore && game.predictionCorrect) {
                                    correctGames.push(outcome)
                                } else if (outcome.name === game.away_team && game.awayTeamIndex > game.homeTeamIndex && game.awayScore > game.homeScore && game.predictionCorrect) {
                                    correctGames.push(outcome)
                                }else if(outcome.name === game.home_team && game.homeTeamIndex > game.awayTeamIndex && game.awayScore > game.homeScore) {
                                    incorrectGames.push(outcome)
                                }else if(outcome.name === game.away_team && game.awayTeamIndex > game.homeTeamIndex && game.homeScore > game.awayScore) {
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
                betAmount = (props.bankroll / currentGames.length)
            } else if (type === 'value') {
                betAmount = (props.bankroll / currentGames.length);
            } else if (type === 'kelley') {
                betAmount = (calculateKellyCriterion(decimalOdds, game.impliedProb) * props.bankroll)
            }
            loss = loss + betAmount
        })
        correctGames.map((game) => {
            decimalOdds = (calculateDecimalOdds(game.price))
            if (type === 'proportional') {
                betAmount = (props.bankroll / currentGames.length)
            } else if (type === 'value') {
                betAmount = (props.bankroll / currentGames.length);
            } else if (type === 'kelley') {
                betAmount = (calculateKellyCriterion(decimalOdds, game.impliedProb) * props.bankroll)
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
                    <Row>
                        <Col>
                            {props.games ? `Ovr Win Rate: ${((props.games.filter((game) => game.predictionCorrect).length / props.games.length) * 100).toFixed(2)}%` : <> </>}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Day Win Rate: ${((currentGames.filter((game) => game.predictionCorrect).length / currentGames.length) * 100).toFixed(2)}%` : <> </>}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Value Profit: $${renderProfit('value')}` : <> </>}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Prop Profit: $${renderProfit('proportional')}` : <> </>}
                        </Col>
                        <Col>
                            {currentGames.length > 0 ? `Kelley Profit: $${renderProfit('kelley')}` : <> </>}
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Games List */}
            <Row >
                <Col xs={12} md={6}>
                <Row style={{ height: '54rem', overflow: 'scroll' }}>
                {currentGames.filter((game)=> game.predictionCorrect === true).map((game) => (
                    <Col xs={12} xl={6}>
                     <MatchupCard final={true} bestBets={props.bestBets} setBestBets={props.setBestBets} bankroll={props.bankroll} betType={props.betType} valueBets={props.valueBets} todaysGames={props.todaysGames} key={game.id} gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} />
                    </Col>
                   
                ))}
                </Row>

                </Col>
                <Col  xs={12} md={6}>
                <Row style={{height: '54rem',  overflow: 'scroll' }}>
                {currentGames.filter((game)=> game.predictionCorrect === false).map((game) => (
                    <Col xs={12} xl={6}>
                    <MatchupCard final={true} bestBets={props.bestBets} setBestBets={props.setBestBets} bankroll={props.bankroll} betType={props.betType} valueBets={props.valueBets} todaysGames={props.todaysGames} key={game.id} gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} />
                    </Col>
                ))}
                </Row>

                </Col>
            </Row>

            {/* Pagination */}
            <Row>
                <Col>
                    <Button style={{backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'}} disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                </Col>
                <Col style={{textAlign: 'right'}}>
                    <Button style={{backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'}} disabled={currentPage >= filteredGames.length - 1} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default PastGamesDisplay
