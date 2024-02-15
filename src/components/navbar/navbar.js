import { Navbar, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from "react-bootstrap"
import {useState, useEffect} from 'react'

const NavBar = (props) => {

    const [dropdownTitle, setddTitle] = useState("Select Sportsbook")
    const [dropdownBG, setddBG] = useState('#527595')
    const [dropdownFont, setddFont] = useState('#eef3f3')
    const handleClick = (event) => {
        props.setSportsBook(event.target.id)
        setddTitle(event.target.textContent)
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
    <Navbar fixed="top">
        <Container fluid>
                <Col style={{display: "flex", justifyContent: "flex-start" }} >
                    <Row style={{alignItems: "center"}} >
                        <Col>
                            <Dropdown>
                                <DropdownToggle id="sportbookDropdown" style={{backgroundColor: dropdownBG, borderColor: dropdownBG, color: dropdownFont}}>
                                    {dropdownTitle}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem id="draftkings" onClick={handleClick}>DraftKings</DropdownItem>
                                    <DropdownItem id="betmgm" onClick={handleClick}>Bet MGM</DropdownItem>
                                    <DropdownItem id="fanduel" onClick={handleClick}>Fan Duel</DropdownItem>
                                    <DropdownItem id="williamhill_us" onClick={handleClick}>Caesars</DropdownItem>
                                    <DropdownItem id="betrivers" onClick={handleClick}>BetRivers</DropdownItem>
                                    <DropdownItem id="unibet_us" onClick={handleClick}>Unibet</DropdownItem>
                                    <DropdownItem id="betonlineag" onClick={handleClick}>BetOnline.ag</DropdownItem>
                                    <DropdownItem id="lowvig" onClick={handleClick}>LowVig.ag</DropdownItem>
                                    <DropdownItem id="mybookieag" onClick={handleClick}>MyBookie.ag</DropdownItem>
                                    <DropdownItem id="wynnbet" onClick={handleClick}>WynnBet</DropdownItem>
                                    <DropdownItem id="bovada" onClick={handleClick}>Bovada</DropdownItem>
                                    <DropdownItem id="betus" onClick={handleClick}>BetUS</DropdownItem>
                                    <DropdownItem id="superbook" onClick={handleClick}>SuperBook</DropdownItem>
                                    <DropdownItem id="pointsbetus" onClick={handleClick}>PointsBet (US)</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col>info</Col>
                    </Row>
                </Col>
                <Col style={{display: "flex", justifyContent: "center" }} >
                    Site Title
                </Col>
                <Col style={{display: "flex", justifyContent: "flex-end" }} >
                    <Row style={{alignItems: "center"}} >
                        <Col>sign up</Col>
                        <Col>login</Col>
                    </Row>
                </Col>
        </Container>
    </Navbar>
    )

}

export default NavBar