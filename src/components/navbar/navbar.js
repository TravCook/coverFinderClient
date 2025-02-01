import { Navbar, Container, Row, Col, Button, Modal, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, FormControl, NavbarBrand } from "react-bootstrap"
import { useState, useEffect } from 'react'
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setBankroll, setBetType, setSportsbook } from '../../redux/user/actions/userActions';
import { sports } from '../../utils/constants'

const NavBar = () => {
    const dispatch = useDispatch()
    const games = useSelector((state) => state.games.games);
    const { bankroll, sportsbook } = useSelector((state) => state.user);

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
        let betType = event.target.id
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

    const renderSportCard = (sport, filterCondition) => {
        const filteredGames = games.filter((game) => game.sport_title === sport.league.toUpperCase()).filter(filterCondition);
        if (filteredGames.length === 0) return null;

        return (
            <div style={{ color: '#D4D2D5' }}>
                <Link to={`/sport/${sport.league}`}>
                    <Button id={sport.name} variant="outline-light" style={{ fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                        {sport.league.toUpperCase()}
                    </Button>
                </Link>
            </div>
        );
    };

    useEffect(() => {
        const { bg, font } = setDropdownStyles(sportsbook); // Use sportsbook instead of sportsBook
        setDropdownBG(bg);
        setDropdownFont(font);
        setDropdownTitle(sportsbook); // Update dropdown title with the new sportsbook name
    }, [sportsbook, games, bankroll]);  // Dependencies for dynamic updates

    return (
        <Navbar sticky="top" style={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', marginBottom: 10 }}>
            <Container fluid>
                <Col xs={1} style={{ textAlign: 'left' }}>
                    <NavbarBrand style={{ color: '#E0E0E0' }} href="/" >
                        BETTOR
                    </NavbarBrand>
                </Col>
                <Col className="mx-3">
                    <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {sports.map((sport) => {
                            const currentMonth = new Date().getMonth() + 1;
                            const isInSeason =
                                sport.multiYear
                                    ? currentMonth >= sport.startMonth || currentMonth <= sport.endMonth
                                    : currentMonth >= sport.startMonth && currentMonth <= sport.endMonth;

                            // Filter the games for the sport to check if there is any game data
                            const filteredGames = games.filter((game) => game.sport_title === sport.league.toUpperCase());

                            // If the sport is in season and there are games for that sport, render the <Col>
                            if (!isInSeason || filteredGames.length === 0) return null;

                            return (
                                <Col xs="auto" className="mx-1" style={{ padding: 0, textAlign: 'center' }} key={sport.name}>
                                    <div className="sport-section">
                                        {renderSportCard(sport, (game) => {
                                            const gameDate = new Date(game.commence_time);
                                            const currentDate = new Date();
                                            const futureDate = new Date(currentDate);
                                            futureDate.setDate(currentDate.getDate() + 360);

                                            return gameDate < futureDate;
                                        }, sport.league)}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
                <Col xs={1} style={{ textAlign: 'right' }}>
                    <Button
                        variant="outline-light"
                        style={{ fontSize: '.75rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}
                        onClick={handleModalShow} // Open modal on button click
                    >
                        Options
                    </Button>

                    {/* Modal for Options */}
                    <Modal show={showModal} onHide={handleModalClose}>
                        <Modal.Body style={{ backgroundColor: '#303036'}}>
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
                                            {sportsbook}
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
                        <Modal.Footer style={{borderColor: '#303036', backgroundColor: '#303036'}}>
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
