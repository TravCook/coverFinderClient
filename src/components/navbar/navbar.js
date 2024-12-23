import { Navbar, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, FormControl } from "react-bootstrap"
import { useState, useEffect } from 'react'

const NavBar = (props) => {
    const [dropdownTitle, setDropdownTitle] = useState("Select Sportsbook")
    const [dropdownBG, setDropdownBG] = useState('#527595')
    const [dropdownFont, setDropdownFont] = useState('#eef3f3')
    const [bankroll, setBankroll] = useState('10') // Default bankroll set to 10

    const handleDropDownClick = (event) => {
        props.setSportsBook(event.target.id)
        setDropdownTitle(event.target.textContent)
    }

    const handleSubmit = (event) => {
        setBankroll(event.target.value)
        props.setBankroll(event.target.value)
    }

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
        }
        return colors[sportsbook] || { bg: '#527595', font: '#eef3f3' }
    }

    useEffect(() => {
        const { bg, font } = setDropdownStyles(props.sportsBook)
        setDropdownBG(bg)
        setDropdownFont(font)
        setDropdownTitle(props.sportsBook)
    }, [props.sportsBook])

    return (
        <Navbar>
            <Container fluid>
                <Col style={{ textAlign: 'left' }}>
                    BETTOR
                </Col>

                {/* Filter Menu Placeholder - Remove if unnecessary */}
                {/* <Col xs={9} style={{ display: "flex", justifyContent: "space-around" }}>
                    <Row style={{ alignItems: "center" }}>
                        <Col>...</Col>
                    </Row>
                </Col> */}

                <Col style={{ textAlign: 'right' }}>
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
                    </Row>
                </Col>
            </Container>
        </Navbar>
    )
}

export default NavBar
