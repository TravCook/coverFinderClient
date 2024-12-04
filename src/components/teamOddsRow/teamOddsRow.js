import { Col, Row } from 'react-bootstrap'
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox'

const TeamOddsRow = (props) => {
    return(
        props.past ? 
        <Row style={{marginTop: 5, alignItems: 'center'}}>
            <Col xs={1}>
            <img src={props.team.logo} style={{width: '20px'}} alt='Team Logo' />
            </Col>
            <Col xs={7} style={{alignContent: 'center'}}>
                {props.team ? `${props.team.abbreviation} ${props.team.teamName}` : null}
                <sup style={{marginLeft: 5}}>{props.teamIndex}</sup>
            </Col>
            <Col xs={3} style={{ fontSize: 'medium', borderStyle: 'solid', textAlign: 'center' }}> 
                {props.score}
            </Col>
        </Row>
        :
        <Row style={{marginTop: 5, alignItems: 'center'}}>
        <Col xs={1}>
        <img src={props.team.logo} style={{width: '20px'}} alt='Team Logo' />
        </Col>
        <Col xs={7} style={{alignContent: 'center'}}>
            {props.team ? `${props.team.abbreviation} ${props.team.teamName}` : null}
            <sup style={{marginLeft: 5}}>{props.teamIndex}</sup>
        </Col>
        <OddsDisplayBox teamIndex={props.teamIndex}key={`${props.team.espnDisplayName} h2h`} team={props.team} oppTeam={props.oppTeam} gameData={props.gameData} sportsbook={props.sportsbook} market='h2h' total={props.total}  />
    </Row>
    )
}

export default TeamOddsRow