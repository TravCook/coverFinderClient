import { Navbar, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from "react-bootstrap"
import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faFootballBall, faBasketballBall, faBaseballBall, faHockeyPuck} from '@fortawesome/free-solid-svg-icons'

const NavBar = (props) => {

    const [dropdownTitle, setddTitle] = useState("Select Sportsbook")
    const [dropdownBG, setddBG] = useState('#527595')
    const [dropdownFont, setddFont] = useState('#eef3f3')
    const handleDropDownClick = (event) => {
        props.setSportsBook(event.target.id)
        setddTitle(event.target.textContent)
   }
   const handleNavClick =  (event) => {
    props.setPageSelect(event.target.textContent)
}

    useEffect(() => {
         switch(props.sportsBook){
        case 'draftkings':
            setddBG('#61b510')
            setddFont('#eef3f3')
            setddTitle('DraftKings')
        break;
        case 'betmgm':
            setddBG('#dbc172')
            setddFont('#2b3143')
            setddTitle('Bet MGM')
        break;
        case 'fanduel':
            setddBG('#0070eb')
            setddFont('#eef3f3')
            setddTitle('Fan Duel')
        break;
        case 'williamhill_us':
            setddBG('#223c2e')
            setddFont('#eef3f3')
            setddTitle('Caesars')
        break;
        case 'betrivers':
            setddBG('#1a365d')
            setddFont('#eef3f3')
            setddTitle('BetRivers')
        break;
        case 'unibet_us':
            setddBG('#147b45')
            setddFont('#eef3f3')
            setddTitle('Unibet')
        break;
        case 'betonlineag':
            setddBG('#2d2e2c')
            setddFont('#eef3f3')
            setddTitle('BetOnline.ag')
        break;
        case 'lowvig':
            setddBG('#01153d')
            setddFont('#eef3f3')
            setddTitle('LowVig.ag')
        break;
        case 'mybookieag':
            setddBG('#ff8300')
            setddFont('#eef3f3')
            setddTitle('MyBookie.ag')
        break;
        case 'wynnbet':
            setddBG('#ff8300')
            setddFont('#eef3f3')
            setddTitle('WynnBet')
        break;
        case 'bovada':
            setddBG('#cc0000')
            setddFont('#eef3f3')
            setddTitle('Bovada')
        break;
        case 'betus':
            setddBG('#223e71')
            setddFont('#eef3f3')
            setddTitle('BetUS')
        break;
        case 'superbook':
            setddBG('#e5b724')
            setddFont('#eef3f3')
            setddTitle('SuperBook')
        break;
        case 'pointsbetus':
            setddBG('#ed1b42')
            setddFont('#eef3f3')
            setddTitle('PointsBet (US)')
        break;
    }
    }, [props.sportsBook])

    return(
    <Navbar>
        <Container fluid>
                <Col xs={1} style={{display: "flex", justifyContent: "center" }} >
                    BETTOR
                </Col>
                <Col xs={1} style={{display: "flex", justifyContent: "flex-start" }} >
                    <Row style={{alignItems: "center"}} >
                        <Col>
                            <Dropdown>
                                <DropdownToggle id="sportbookDropdown" style={{backgroundColor: dropdownBG, borderColor: dropdownBG, color: dropdownFont}}>
                                    {dropdownTitle}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem id="draftkings" onClick={handleDropDownClick}>DraftKings</DropdownItem>
                                    <DropdownItem id="betmgm" onClick={handleDropDownClick}>Bet MGM</DropdownItem>
                                    <DropdownItem id="fanduel" onClick={handleDropDownClick}>Fan Duel</DropdownItem>
                                    <DropdownItem id="williamhill_us" onClick={handleDropDownClick}>Caesars</DropdownItem>
                                    <DropdownItem id="betrivers" onClick={handleDropDownClick}>BetRivers</DropdownItem>
                                    <DropdownItem id="unibet_us" onClick={handleDropDownClick}>Unibet</DropdownItem>
                                    <DropdownItem id="betonlineag" onClick={handleDropDownClick}>BetOnline.ag</DropdownItem>
                                    <DropdownItem id="lowvig" onClick={handleDropDownClick}>LowVig.ag</DropdownItem>
                                    <DropdownItem id="mybookieag" onClick={handleDropDownClick}>MyBookie.ag</DropdownItem>
                                    <DropdownItem id="wynnbet" onClick={handleDropDownClick}>WynnBet</DropdownItem>
                                    <DropdownItem id="bovada" onClick={handleDropDownClick}>Bovada</DropdownItem>
                                    <DropdownItem id="betus" onClick={handleDropDownClick}>BetUS</DropdownItem>
                                    <DropdownItem id="superbook" onClick={handleDropDownClick}>SuperBook</DropdownItem>
                                    <DropdownItem id="pointsbetus" onClick={handleDropDownClick}>PointsBet (US)</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
                {/* TODO: TURN THESE BUTTONS INTO A FILTER MENU */}
                <Col xs={9} style={{display: "flex", justifyContent: "space-around"}} >
                    <Row style={{alignItems: "center"}} >
                        <Col>
                            <Button onClick={handleNavClick} style={{fontSize: 'x-small'}}>
                                <Row>
                                    <Col xs={1} style={{padding: 4}}>
                                        <FontAwesomeIcon icon={faHome} />
                                    </Col>
                                    <Col xs={10} style={{alignContent: 'center'}}>
                                        Home
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleNavClick} style={{fontSize: 'x-small'}}>
                            <Row>
                                    <Col xs={1} style={{padding: 5}}>
                                        <FontAwesomeIcon icon={faFootballBall} />
                                    </Col>
                                    <Col xs={10} style={{alignContent: 'center'}}>
                                        Football
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleNavClick} style={{fontSize: 'x-small'}}>
                            <Row>
                                    <Col xs={1} style={{padding: 5}}>
                                        <FontAwesomeIcon icon={faBaseballBall} />
                                    </Col>
                                    <Col xs={10} style={{alignContent: 'center'}}>
                                        Baseball
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleNavClick} style={{fontSize: 'x-small'}} >
                            <Row>
                                    <Col xs={1} style={{padding: 5}}>
                                        <FontAwesomeIcon icon={faHockeyPuck} />
                                    </Col>
                                    <Col xs={10} style={{alignContent: 'center'}}>
                                        Hockey
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleNavClick} style={{fontSize: 'x-small'}}>
                            <Row>
                                    <Col xs={1} style={{padding: 5}}>
                                        <FontAwesomeIcon icon={faBasketballBall} />
                                    </Col>
                                    <Col xs={10} style={{alignContent: 'center'}}>
                                        Basketball
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={1} style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button>
                        Login
                    </Button>
                </Col>
        </Container>
    </Navbar>
    )

}

export default NavBar