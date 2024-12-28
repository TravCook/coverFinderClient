import { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap'
import PastGameCard from '../pastGameCard/pastGameCard.js'
import moment from 'moment'

const PastGamesDisplay = (props) => {
    const [filteredGames, setFilteredGames] = useState([])
    const [searchFilter, setSearchFilter] = useState({
        startDate: '',
        endDate: '',
        league: '',
        teams: '',
        homeIndexRange: [0, 100],
        awayIndexRange: [0, 100],
        winPercentRange: [0, 100],
    })
    const [currentPage, setCurrentPage] = useState(1)
    const gamesPerPage = 10



    useEffect(() => {
        // Filter games based on the searchFilter
        const filtered = props.games.filter((game) => {
            const gameDate = moment.utc(game.commence_time)
            const isWithinDateRange = (!searchFilter.startDate || gameDate.isAfter(moment(searchFilter.startDate))) &&
                                      (!searchFilter.endDate || gameDate.isBefore(moment(searchFilter.endDate)))
            const isWithinHomeIndex = game.homeIndex >= searchFilter.homeIndexRange[0] && game.homeIndex <= searchFilter.homeIndexRange[1]
            const isWithinAwayIndex = game.awayIndex >= searchFilter.awayIndexRange[0] && game.awayIndex <= searchFilter.awayIndexRange[1]
            const isWithinWinPercentRange = game.winPercent >= searchFilter.winPercentRange[0] && game.winPercent <= searchFilter.winPercentRange[1]
            return isWithinDateRange && isWithinHomeIndex && isWithinAwayIndex && isWithinWinPercentRange
        })
        setFilteredGames(filtered)
    }, [searchFilter, props.games])

    // Pagination Logic
    // const lastIndex = currentPage * gamesPerPage
    // const firstIndex = lastIndex - gamesPerPage
    // const currentGames = filteredGames.slice(firstIndex, lastIndex)

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

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Row>
                        <Col><Form.Control type="date" name="startDate" value={searchFilter.startDate} onChange={handleDateChange} /></Col>
                        <Col><Form.Control type="date" name="endDate" value={searchFilter.endDate} onChange={handleDateChange} /></Col>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-league">
                                    {searchFilter.league || "Select League"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setSearchFilter({ ...searchFilter, league: 'NBA' })}>NBA</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSearchFilter({ ...searchFilter, league: 'NFL' })}>NFL</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSearchFilter({ ...searchFilter, league: 'MLB' })}>MLB</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col><Form.Control type="text" placeholder="Search teams" name="teams" value={searchFilter.teams} onChange={handleDateChange} /></Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        {props.games ? `${((props.games.filter((game) => game.predictionCorrect).length / props.games.length) * 100).toFixed(2)}%` : null}
                    </Row>
                </Col>
            </Row>

            {/* Games List */}
            <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {props.games.map((game) => (
                    <PastGameCard key={game.id} gameData={game} sportsbook={props.sportsBook} winRates={props.winRates} />
                ))}
            </Row>

            {/* Pagination */}
            <Row>
                <Col>
                    <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                </Col>
                <Col>
                    <Button disabled={currentPage * gamesPerPage >= filteredGames.length} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default PastGamesDisplay
