import { Navbar, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, FormControl, Form } from "react-bootstrap"
import { useState, useEffect } from 'react'
import moment from 'moment'

const NavBar = (props) => {
    const [dropdownTitle, setDropdownTitle] = useState("Select Sportsbook");
    const [dropdownBG, setDropdownBG] = useState('#527595');
    const [dropdownFont, setDropdownFont] = useState('#eef3f3');
    const [yDayBigWins, setYDayWins] = useState()
    const [yesterdaysGames, setYDayGames] = useState()
    const [bankroll, setBankroll] = useState('10'); // Default bankroll set to 10

    // Set the default sportsbook if props.sportsBook is not provided
    const sportsbook = props.sportsBook || 'fanduel'; // Default to 'fanduel' if not passed

    const handleDropDownClick = (event) => {
        props.setSportsBook(event.target.id);
        setDropdownTitle(event.target.textContent);
    };

    const handleSubmit = (event) => {
        setBankroll(event.target.value);
        props.setBankroll(event.target.value);
    };

    const handleFormChange = (event) => {
        let id = event.target.id
        let betType = event.target.id
        let betTypeSplit = id.split(" ")
        props.setbetType(betTypeSplit[0])
    }

    const yDayWinners = (pastGames, games) => {
        let yesterdaysGamesArray = [];
        let todaysGamesArray = []
        let valueArray = [];
        // Define your selected sportsbook here

        pastGames.map((game) => {
            // Check if the game occurred yesterday
            if (moment(game.commence_time).isSame(moment().local().subtract(1, 'days'), 'day')) {
                yesterdaysGamesArray.push(game);
            } else if (moment(game.commence_time).isSame(moment().local(), 'day')) {
                todaysGamesArray.push(game);
                game.bookmakers.map((bookmaker) => {
                    if (bookmaker.key === sportsbook) { // Use sportsbook here instead of props.sportsBook
                        bookmaker.markets.map((market) => {
                            market.outcomes.map((outcome) => {
                                if (game.homeTeamIndex > game.awayTeamIndex) {
                                    if (outcome.name === game.home_team && outcome.impliedProb < 65) {
                                        valueArray.push(outcome);
                                    }
                                } else if (game.awayTeamIndex > game.homeTeamIndex) {
                                    if (outcome.name === game.away_team && outcome.impliedProb < 65) {
                                        valueArray.push(outcome);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
        games.map((game) => {
            if (moment(game.commence_time).isSame(moment().local(), 'day')) {
                todaysGamesArray.push(game);
                game.bookmakers.map((bookmaker) => {
                    if (bookmaker.key === sportsbook) { // Use sportsbook here instead of props.sportsBook
                        bookmaker.markets.map((market) => {
                            market.outcomes.map((outcome) => {
                                if (game.homeTeamIndex > game.awayTeamIndex) {
                                    if (outcome.name === game.home_team && outcome.impliedProb < 65) {
                                        valueArray.push(outcome);
                                    }
                                } else if (game.awayTeamIndex > game.homeTeamIndex) {
                                    if (outcome.name === game.away_team && outcome.impliedProb < 65) {
                                        valueArray.push(outcome);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        })
        props.setValueBets(valueArray)
        props.setTodaysGames(todaysGamesArray)
        setYDayGames(yesterdaysGamesArray)
        let filteredGames = yesterdaysGamesArray.filter((game) => game.predictionCorrect === true);

        // Sort the filtered games based on the outcome for the winner and sportsbook
        let sortedGames = filteredGames.sort((a, b) => {
            // Function to get the outcome price for the winner from the selected sportsbook
            const getOutcomePrice = (game, sportsbook) => {
                let selectedBookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook);
                if (!selectedBookmaker) return null;
                let selectedMarket = selectedBookmaker.markets.find((market) => market.key === 'h2h'); // Assuming h2h market is used
                if (!selectedMarket) return null;
                let selectedOutcome = selectedMarket.outcomes.find((outcome) => {
                    if (game.winner === 'home' && outcome.name === game.home_team) {
                        return true;
                    } else if (game.winner === 'away' && outcome.name === game.away_team) {
                        return true;
                    }
                    return false;
                });
                return selectedOutcome ? selectedOutcome.price : null;
            };
            // Get the outcome prices for both games
            let priceA = getOutcomePrice(a, sportsbook);
            let priceB = getOutcomePrice(b, sportsbook);
            // Compare the prices to sort the games
            if (priceA === null) return 1; // If no outcome is found, place it after
            if (priceB === null) return -1; // If no outcome is found for b, place it after
            let decimalA = priceA > 0 ? (priceA / 100) + 1 : (100 / -priceA) + 1;
            let decimalB = priceB > 0 ? (priceB / 100) + 1 : (100 / -priceB) + 1;
            return decimalB - decimalA; // Sort in ascending order based on price
        });
        setYDayWins(sortedGames)
    };

    const setDropdownStyles = (sportsbook) => {
        const colors = {
            draftkings: { bg: '#61b510', font: '#eef3f3' },
            betmgm: { bg: '#dbc172', font: '#2b3143' },
            fanduel: { bg: '#0070eb', font: '#eef3f3' },
            williamhill_us: { bg: '#223c2e', font: '#eef3f3' },
            betrivers: { bg: '#1a365d', font: '#eef3f3' },
            unibet_us: { bg: '#147b45', font: '#eef3f3' },
            betonlineag: { bg: '#2d2e2c', font: '#eef3f3' },
            lowvig: { bg: '#01153d', font: '#eef3f3' },
            mybookieag: { bg: '#ff8300', font: '#eef3f3' },
            wynnbet: { bg: '#ff8300', font: '#eef3f3' },
            bovada: { bg: '#cc0000', font: '#eef3f3' },
            betus: { bg: '#223e71', font: '#eef3f3' },
            superbook: { bg: '#e5b724', font: '#eef3f3' },
            pointsbetus: { bg: '#ed1b42', font: '#eef3f3' }
        };
        return colors[sportsbook] || { bg: '#527595', font: '#eef3f3' };
    };

    const indexColors = [
        {
            key: 0,
            hexCode: "#f20707"
        },
        {
            key: 2,
            hexCode: "#f32b08"
        },
        {
            key: 3,
            hexCode: "#f33b09"
        },
        {
            key: 5,
            hexCode: "#f34e0a"
        },
        {
            key: 6,
            hexCode: "#f3600a"
        },
        {
            key: 8,
            "hexCode": "#f4750b"
        }, {
            key: 9,
            hexCode: "#f48a0b"
        },
        {
            key: 11,
            hexCode: "#f5a40c"
        },
        {
            key: 12,
            hexCode: "#f5be0d"
        },
        {
            key: 14,
            hexCode: "#f5d80e"
        },
        {
            key: 15,
            hexCode: "#f5f20e"
        },
        {
            key: 17,
            hexCode: "#f5df0e"
        },
        {
            key: 18,
            hexCode: "#f5cc0d"
        },
        {
            key: 20,
            hexCode: "#d2d50b"
        },
        {
            key: 21,
            hexCode: "#aede09"
        },
        {
            key: 23,
            hexCode: "#9ae308"
        },
        {
            key: 24,
            hexCode: "#77ec05"
        },
        {
            key: 26,
            hexCode: "#6bef04"
        },
        {
            key: 27,
            hexCode: "#59f403"
        },
        {
            key: 29,
            hexCode: "#47f802"
        },
        {
            key: 30,
            hexCode: "#2cff00"
        }
    ];

    // Function to get color based on the team index
    const getColor = (index) => {
        return indexColors.find(color => index <= color.key)?.hexCode || '#f20707';
    };

    const renderYesterdayWinsRow = () => {
        return (
            <Row>
                <Col xs={2}>Yesterday's Biggest Wins: </Col>
                {yDayBigWins && yDayBigWins.slice(0, 3).map((game, idx) => {

                    return game.bookmakers.map((bookmaker) => {
                        if (bookmaker.key === sportsbook) {
                            return bookmaker.markets.map((market) => {
                                return market.outcomes.map((outcome) => {

                                    if (game.winner === 'home' && outcome.name === game.home_team) {
                                        if (game.homeTeamIndex > game.awayTeamIndex) {
                                            let betSize = bankroll / yesterdaysGames.length
                                            let decimalOdds = outcome.price > 0
                                                ? (outcome.price + 100) / 100
                                                : ((100 / Math.abs(outcome.price)) + 1);

                                            return (

                                                <Col key={idx} sm={3}> {/* Adjust the layout for 3 columns */}
                                                    <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                        <Col style={{ padding: 0 }} xs={1}><img src={game.awayTeamlogo} style={{ width: '20px' }} alt='Team Logo' /></Col> {/* Away team */}
                                                        <Col style={{ padding: 0 }} xs={1}>vs</Col>
                                                        <Col style={{
                                                            padding: 0,
                                                            borderRadius: 15,
                                                            boxShadow: game.winner === 'away' ? '0px 0px 8px rgba(255, 215, 0, 0.6)' : 'none', // Soft glow
                                                        }} xs={1}><img src={game.homeTeamlogo} style={{ width: '20px' }} alt='Team Logo' /></Col> {/* Home team */}
                                                        <Col style={{ padding: 0, borderStyle: 'solid', boxShadow: `inset 0 0 20px ${getColor(game.homeTeamIndex)}`, textAlign: 'center' }} xs={2} >{outcome.price > 0 ? `+${outcome.price}` : outcome.price}</Col> {/* Odds */}
                                                        <Col style={{ textAlign: 'left', padding: 0 }} xs={2}>
                                                            {`$${betSize.toFixed(2)}`}
                                                        </Col>
                                                        <Col style={{ textAlign: 'left', padding: 0, borderRightStyle: 'solid' }} xs={2}>
                                                            {`$${((decimalOdds * betSize) - betSize).toFixed(2)}`}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            );
                                        }
                                    } else if (game.winner === 'away' && outcome.name === game.away_team) {
                                        if (game.awayTeamIndex > game.homeTeamIndex) {
                                            let betSize = bankroll / yesterdaysGames.length
                                            let decimalOdds = outcome.price > 0
                                                ? (outcome.price + 100) / 100
                                                : ((100 / Math.abs(outcome.price)) + 1);
                                            return (
                                                <Col key={idx} sm={3}> {/* Adjust the layout for 3 columns */}
                                                    <Row style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}>
                                                        <Col style={{
                                                            padding: 0,
                                                            borderRadius: 15,
                                                            boxShadow: game.winner === 'away' ? '0px 0px 8px rgba(255, 215, 0, 0.6)' : 'none', // Soft glow
                                                        }} xs={1}><img src={game.awayTeamlogo} style={{ width: '20px' }} alt='Team Logo' /></Col> {/* Away team */}
                                                        <Col style={{ padding: 0 }} xs={1}>vs</Col>
                                                        <Col style={{ padding: 0 }} xs={1}><img src={game.homeTeamlogo} style={{ width: '20px' }} alt='Team Logo' /></Col> {/* Home team */}
                                                        <Col style={{ padding: 0, borderStyle: 'solid', boxShadow: `inset 0 0 20px ${getColor(game.awayTeamIndex)}`, textAlign: 'center' }} xs={2}>{outcome.price > 0 ? `+${outcome.price}` : outcome.price}</Col> {/* Odds */}
                                                        <Col style={{ textAlign: 'left', padding: 0 }} xs={2}>
                                                            {`$${betSize.toFixed(2)}`}
                                                        </Col>
                                                        <Col style={{ textAlign: 'left', padding: 0, borderRightStyle: 'solid' }} xs={2}>
                                                            {`$${((decimalOdds * betSize) - betSize).toFixed(2)}`}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            );
                                        }
                                    }

                                });
                            });
                        }
                    });
                })}
            </Row>
        );
    };

    useEffect(() => {
        const { bg, font } = setDropdownStyles(sportsbook); // Use sportsbook instead of props.sportsBook
        setDropdownBG(bg);
        setDropdownFont(font);
        setDropdownTitle(sportsbook); // Update dropdown title with the new sportsbook name
        yDayWinners(props.pastGames, props.games);
    }, [sportsbook, props.games, props.pastGames, bankroll]);  // Dependencies for dynamic updates

    return (
        <Navbar sticky="top" style={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', marginBottom: 10 }}>
            <Container fluid>
                <Col xs={1} style={{ textAlign: 'left' }}>
                    BETTOR
                </Col>
                <Col>
                    {renderYesterdayWinsRow()}
                </Col>


                <Col xs={3} style={{ textAlign: 'right' }}>
                    <Row>
                        <Col>
                            <InputGroup>
                                <FormControl
                                    type="number"
                                    value={bankroll}
                                    onChange={handleSubmit}
                                    min="1"
                                    max="10000"
                                    step="1"
                                    placeholder="Enter Bankroll"
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Dropdown align='end'>
                                <DropdownToggle
                                    id="sportbookDropdown"
                                    style={{
                                        backgroundColor: dropdownBG,
                                        borderColor: dropdownBG,
                                        color: dropdownFont
                                    }}
                                >
                                    Bet Type
                                </DropdownToggle>
                                <DropdownMenu>
                                    {['Kelley Criterion', 'Proportional Bet', 'Value Bet'].map((sportsbook) => (
                                        <DropdownItem
                                            key={sportsbook}
                                            id={sportsbook}
                                            onClick={handleFormChange}
                                        >
                                            {sportsbook.charAt(0).toUpperCase() + sportsbook.slice(1).replace(/_/g, ' ')}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Dropdown align='end'>
                                <DropdownToggle
                                    id="sportbookDropdown"
                                    style={{
                                        backgroundColor: dropdownBG,
                                        borderColor: dropdownBG,
                                        color: dropdownFont
                                    }}
                                >
                                    Sportsbook
                                </DropdownToggle>
                                <DropdownMenu>
                                    {['draftkings', 'betmgm', 'fanduel', 'williamhill_us', 'betrivers', 'unibet_us', 'betonlineag', 'lowvig', 'mybookieag', 'wynnbet', 'bovada', 'betus', 'superbook', 'pointsbetus'].map((sportsbook) => (
                                        <DropdownItem
                                            key={sportsbook}
                                            id={sportsbook}
                                            onClick={handleDropDownClick}
                                        >
                                            {sportsbook.charAt(0).toUpperCase() + sportsbook.slice(1).replace(/_/g, ' ')}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Container>
        </Navbar>
    );
};

export default NavBar;
