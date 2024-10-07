import { useEffect, useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import TeamOddsRow from '../teamOddsRow/teamOddsRow'
import moment from 'moment'


const MatchupCard = (props) => {
    const [homeTeam, setHomeTeam] = useState()
    const [awayTeam, setAwayTeam] = useState()
    const homeTeamGet = () => {
        fetch('http://localhost:3001/api/teams/search', {
            method: 'POST',
            body: JSON.stringify({
                searchTeam: props.gameData.home_team
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => res.json()).then((data) => {
            data ? setHomeTeam(data) : setHomeTeam(null)
        })
    }
    const awayTeamGet = () => {
        fetch('http://localhost:3001/api/teams/search', {
            method: 'POST',
            body: JSON.stringify({
                searchTeam: props.gameData.away_team
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => res.json()).then((data) => {
            data ? setAwayTeam(data) : setAwayTeam(null)
        })
    }

    useEffect(() => {
        if (props.gameData.home_team && props.gameData.away_team) {
            awayTeamGet()
            homeTeamGet()
        }
    }, [])
    return (
        <Container style={{ width: '25rem', height: '8rem', fontSize: 'medium', marginBottom: '2rem', backgroundColor: '#303036', color: '#D4D2D5', paddingRight: '15px', borderRadius: '.5em' }}>
            <Row>
                <Col xs={8} style={{ textAlign: 'center', borderStyle: 'solid', borderTopStyle: 'none', marginLeft: 'auto', marginRight: 'auto', borderRadius: '.25em' }}>
                    {moment(props.gameData.commence_time).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? `Today @ ${moment(props.gameData.commence_time).utc().local().format('h:MMa')}` : moment(props.gameData.commence_time).utc().local().format('MMM/DD/YYYY @ h:MMa')}
                </Col>
            </Row>
            {/* <Row style={{ fontSize: 'x-small', justifyContent: 'right', textAlign: 'center' }}>
                <Col xs={2}>
                    Money
                </Col>
                <Col xs={2}>
                    Spreads
                </Col>
                <Col xs={2}>
                    Totals
                </Col>
            </Row> */}
            {awayTeam ? <TeamOddsRow  teamIndex={props.gameData.awayTeamIndex} team={awayTeam} oppTeam={homeTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Over'} /> : <></>}
            {homeTeam ? <TeamOddsRow  teamIndex={props.gameData.homeTeamIndex} team={homeTeam} oppTeam={awayTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Under'} /> : <></>}
        </Container>
    )
}

export default MatchupCard