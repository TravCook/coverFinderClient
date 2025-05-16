import { Navbar, Container, Row, Col, Button, Modal, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, FormControl, NavbarBrand } from "react-bootstrap"
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setBankroll, setBetType, setSportsbook, setStarredGames } from '../../redux/user/actions/userActions';
import { isSameDay, combinedCondition, valueBetConditionCheck } from '../../utils/constants'

const NavBar = () => {
    const dispatch = useDispatch()
    const { games, valueGames, sports, pastGames } = useSelector((state) => state.games);
    const { bankroll, sportsbook, starredGames } = useSelector((state) => state.user);
    const [dropdownTitle, setDropdownTitle] = useState("Select Sportsbook");
    const [dropdownBG, setDropdownBG] = useState('#527595');
    const [dropdownFont, setDropdownFont] = useState('#eef3f3');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    // Set the default sportsbook if props.sportsBook is not provided
    // const sportsbook = sportsBook || 'fanduel'; // Default to 'fanduel' if not passed

    const handleDropDownClick = (event) => {
        dispatch(setSportsbook(event.target.id));
        setDropdownTitle(event.target.textContent);
    };

    const handleSubmit = (event) => {
        dispatch(setBankroll(event.target.value));
    };

    const handleFormChange = (event) => {
        let id = event.target.id
        let betTypeSplit = id.split(" ")
        dispatch(setBetType(betTypeSplit[0]))
    }

    const handleModalClose = () => setShowModal(false); // Close modal
    const handleModalShow = () => setShowModal(true); // Show modal

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


    const handleAutoStar = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        tomorrow.setHours(0, 0, 0, 0);  // Set time to midnight

        let updatedStarredGames = [...starredGames];
        games.filter((game) => {
            const bookmaker = game.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
            if (bookmaker) {
                const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');

                let outcome = marketData?.outcomes?.find(o => {
                    return o.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team)
                });

                if (outcome) {
                    let currentSport = sports.find(arraySport => arraySport.name === game.sport_key)
                    let sportSettings = currentSport.valueBetSettings.find((setting) => setting.bookmaker === sportsbook)
                    if (sportSettings !== undefined) {
                        let valueBetCheck = combinedCondition(game, outcome, sportSettings.settings.indexDiffSmallNum, sportSettings.settings.indexDiffRangeNum, sportSettings.settings.confidenceLowNum, sportSettings.settings.confidenceRangeNum)
                        if (valueBetCheck) {
                            return game
                        }
                    }

                }


            }
            return false;
        }).filter((game) => isSameDay(new Date(game.commence_time), today)).map((gameData) => {
            // Check if the game is already starred
            if (!starredGames.some((game) => game.id === gameData.id)) {
                // If not, create a new array with the new starred game
                updatedStarredGames.push(gameData)

                // Save the updated starred games to cookies
                localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));

                dispatch(setStarredGames(updatedStarredGames)); // Dispatch the updated array

            }
            return null
        })
        starredGames.map((gameData) => {
            if (!valueBetConditionCheck(sports, gameData, sportsbook, pastGames)) {
                updatedStarredGames = starredGames.filter((filterGame) => filterGame.id !== gameData.id);
                localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
                dispatch(setStarredGames(updatedStarredGames)); // Dispatch the filtered array

            }
            return null
        })



    }

    useEffect(() => {
        const { bg, font } = setDropdownStyles(sportsbook); // Use sportsbook instead of sportsBook
        setDropdownBG(bg);
        setDropdownFont(font);
        setDropdownTitle(sportsbook); // Update dropdown title with the new sportsbook name
    }, [sportsbook, games, bankroll, valueGames, sports]);  // Dependencies for dynamic updates

    return (
        <Navbar style={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
            <Container fluid>
                <Col xs={1} style={{ textAlign: 'left' }}>
                    <NavbarBrand style={{ color: '#E0E0E0' }} href="/" >
                        BETTOR
                    </NavbarBrand>
                </Col>
                <Col xs={1}>
                    {/* {`${valueWinPct}%`} */}
                </Col>
                <Col>
                    <Row style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        {/* <Col>{allTimeProfit.toFixed(2)}</Col>
                        <Col>{allTimeValueProfit.toFixed(2)}</Col> */}
                    </Row>
                </Col>
                <Col xs={1} className="mx-3">
                    <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outline-light"
                            style={{ fontSize: '.75rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}
                            onClick={handleAutoStar}>
                            Auto Star
                        </Button>
                    </Row>
                </Col>
                <Col xs={2} style={{ textAlign: 'right' }}>
                    <Button
                        variant="outline-light"
                        style={{ fontSize: '.75rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212', margin: 5 }}
                        onClick={handleModalShow} // Open modal on button click
                    >
                        Options
                    </Button>
                    <Button
                        variant="outline-light"
                        style={{ fontSize: '.75rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212', margin: 5 }}
                    >
                        Log In
                    </Button>

                    {/* Modal for Options */}
                    <Modal show={showModal} onHide={handleModalClose}>
                        <Modal.Body style={{ backgroundColor: '#303036' }}>
                            <Row style={{ marginBottom: 5 }}>
                                <Col>
                                    <Dropdown align='end'>
                                        <DropdownToggle
                                            id="sportbookDropdown"
                                            style={{
                                                backgroundColor: dropdownBG,
                                                borderColor: dropdownBG,
                                                color: dropdownFont,
                                            }}
                                        >
                                            {dropdownTitle}
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
                                <Col>
                                    <Dropdown align='end'>
                                        <DropdownToggle
                                            id="betTypeDropdown"
                                            style={{ backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}
                                        >
                                            Bet Type
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {['Kelley Criterion', 'Proportional Bet', 'Value Bet'].map((betType) => (
                                                <DropdownItem
                                                    key={betType}
                                                    id={betType}
                                                    onClick={handleFormChange}
                                                >
                                                    {betType}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
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
                            </Row>
                            <Row>

                            </Row>
                            <Row>

                            </Row>
                        </Modal.Body>
                        <Modal.Footer style={{ borderColor: '#303036', backgroundColor: '#303036' }}>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Container>
        </Navbar>
    );
};

export default NavBar;
