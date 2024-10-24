import { Col, Row } from 'react-bootstrap'
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox'

const TeamOddsRow = (props) => {

    return(
        <Row style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Col xs={1}>
            <img src={props.team.logo} style={{width: '25px'}} alt='Team Logo' />
            </Col>
            <Col xs={6} style={{alignContent: 'center'}}>
                {props.team ? `${props.team.abbreviation} ${props.team.teamName}` : null}
            </Col>
            <Col xs={2} style={{textAlign: 'center'}}>
                {props.teamIndex}
            </Col>
            <OddsDisplayBox teamIndex={props.teamIndex}key={`${props.team.espnDisplayName} h2h`} team={props.team} oppTeam={props.oppTeam} gameData={props.gameData} sportsbook={props.sportsbook} market='h2h' total={props.total}  />
            
            {/* <OddsDisplayBox key={`${props.team.espnDisplayName} totals`} team={props.team} oppTeam={props.oppTeam} gameData={props.gameData} sportsbook={props.sportsbook} market='totals' total={props.total}  /> */}

        </Row>
    )
}

export default TeamOddsRow