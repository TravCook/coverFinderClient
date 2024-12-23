import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import TeamOddsRow from '../teamOddsRow/teamOddsRow'
import moment from 'moment'

const PastGameCard = (props) => {
    const [homeTeam, setHomeTeam] = useState(null)
    const [awayTeam, setAwayTeam] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch team data based on the team's name
    const fetchTeamData = (teamName, setTeam) => {
        fetch('http://localhost:3001/api/teams/search', {
            method: 'POST',
            body: JSON.stringify({ searchTeam: teamName }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                setTeam(data)
            } else {
                setTeam(null)
            }
        })
        .catch((error) => {
            console.error('Error fetching team data:', error)
            setTeam(null)
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (props.gameData.home_team && props.gameData.away_team) {
            fetchTeamData(props.gameData.home_team, setHomeTeam)
            fetchTeamData(props.gameData.away_team, setAwayTeam)
        }
    }, [props.gameData])

    // Set background color based on prediction correctness
    const backgroundColor = props.gameData.predictionCorrect ? '#06402B' : '#4d0000'

    return (
        <div style={{backgroundColor, color: '#D4D2D5', borderRadius: '.5em', fontSize: '14px', marginTop: '10px', width: '19rem'}}>
            <Row>
                <Col style={{ textAlign: 'center', borderStyle: 'solid', borderTopStyle: 'none', borderRadius: '.25em'}}>
                    {moment(props.gameData.commence_time).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') 
                        ? `Today @ ${moment(props.gameData.commence_time).utc().local().format('h:MMa')}` 
                        : moment(props.gameData.commence_time).utc().local().format('MMM/DD @ h:MMa')}
                </Col>
                <Col style={{textAlign: 'center', padding: '0px'}}>
                    {props.gameData.winPercent ? `${(props.gameData.winPercent * 100).toFixed(2)}%` : 'Loading...'}
                </Col>
            </Row>

            {/* Conditional Rendering for Teams */}
            {loading ? (
                <Row>
                    <Col style={{ textAlign: 'center', fontSize: '12px' }}>
                        Loading teams...
                    </Col>
                </Row>
            ) : (
                <>
                    {awayTeam && (
                        <TeamOddsRow 
                            teamIndex={props.gameData.awayTeamIndex} 
                            team={awayTeam} 
                            oppTeam={homeTeam} 
                            gameData={props.gameData} 
                            sportsbook={props.sportsbook} 
                            total="Over" 
                            past="true" 
                            score={props.gameData.awayScore}
                        />
                    )}
                    {homeTeam && (
                        <TeamOddsRow 
                            teamIndex={props.gameData.homeTeamIndex} 
                            team={homeTeam} 
                            oppTeam={awayTeam} 
                            gameData={props.gameData} 
                            sportsbook={props.sportsbook} 
                            total="Under" 
                            past="true" 
                            score={props.gameData.homeScore}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default PastGameCard
