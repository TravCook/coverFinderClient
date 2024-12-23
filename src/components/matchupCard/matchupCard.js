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
        <div style={{backgroundColor: '#303036', color: '#D4D2D5',  fontSize: '14px', width: '18rem', borderRight: 'solid', borderLeft: 'solid'}}>
            <Row>
                <Col style={{ textAlign: 'center', borderStyle: 'solid', borderTopStyle: 'none', borderLeftStyle: 'none', borderRadius: '.25em'}}>
                    {moment(props.gameData.commence_time).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? `Today @ ${moment(props.gameData.commence_time).utc().local().format('h:MMa')}` : moment(props.gameData.commence_time).utc().local().format('MMM/DD @ h:MMa')}
                </Col>
                <Col style={{textAlign: 'center', padding: '0px', fontSize: 'small'}}>
                    {props.gameData.winPercent ? `${(props.gameData.winPercent * 100).toFixed(2)}%` : `loading`}
                </Col>
            </Row>
            {awayTeam ? <TeamOddsRow market='h2h' bestBets={props.bestBets} setBestBets={props.setBestBets} bankroll={props.bankroll} winPercent={props.gameData.winPercent} teamIndex={props.gameData.awayTeamIndex} oppteamIndex={props.gameData.homeTeamIndex} team={awayTeam} oppTeam={homeTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Over'} /> : <></>}
            {homeTeam ? <TeamOddsRow market='h2h' bestBets={props.bestBets} setBestBets={props.setBestBets} bankroll={props.bankroll} winPercent={props.gameData.winPercent} teamIndex={props.gameData.homeTeamIndex} oppteamIndex={props.gameData.awayTeamIndex} team={homeTeam} oppTeam={awayTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Under'} /> : <></>}
        </div>
    )
}

export default MatchupCard