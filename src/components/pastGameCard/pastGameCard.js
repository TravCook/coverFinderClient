import { useEffect, useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import TeamOddsRow from '../teamOddsRow/teamOddsRow'
import moment from 'moment'


const PastGameCard = (props) => {
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

    let backgroundColor

    props.gameData.predictionCorrect ? backgroundColor = '#06402B' : backgroundColor = '#4d0000'

    return (
        <div style={{backgroundColor: backgroundColor, color: '#D4D2D5', borderRadius: '.5em', fontSize: '14px', marginTop: '10px', width: '19rem'}}>
            <Row>
                <Col style={{ textAlign: 'center', borderStyle: 'solid', borderTopStyle: 'none', borderRadius: '.25em'}}>
                    {moment(props.gameData.commence_time).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? `Today @ ${moment(props.gameData.commence_time).utc().local().format('h:MMa')}` : moment(props.gameData.commence_time).utc().local().format('MMM/DD @ h:MMa')}
                </Col>
                <Col style={{textAlign: 'center', padding: '0px'}}>
                    {props.gameData.winPercent ? `${(props.gameData.winPercent * 100).toFixed(2)}%` : `loading`}
                </Col>
            </Row>
            {awayTeam ? <TeamOddsRow  teamIndex={props.gameData.awayTeamIndex} team={awayTeam} oppTeam={homeTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Over'} past='true' score={props.gameData.awayScore}/> : <></>}
            {homeTeam ? <TeamOddsRow  teamIndex={props.gameData.homeTeamIndex} team={homeTeam} oppTeam={awayTeam} gameData={props.gameData} sportsbook={props.sportsbook} total={'Under'} past='true' score={props.gameData.homeScore} /> : <></>}
        </div>
    )
}

export default PastGameCard