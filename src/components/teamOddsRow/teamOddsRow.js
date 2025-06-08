import { Row, Col, Container } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';

const TeamOddsRow = ({ backgroundColor, gameData, total, homeAway }) => {

  const renderTeamInfo = () => {
    return (
      <Col xs={7} style={{ letterSpacing: '.5px', alignContent: 'center', padding: '.5rem', fontSize: '.75rem', textAlign: 'left' }}>
        {gameData && homeAway === 'home' ? `${gameData.homeTeamDetails.abbreviation} ${gameData.homeTeamDetails.teamName}` : `${gameData.awayTeamDetails.abbreviation} ${gameData.awayTeamDetails.teamName}`}
        {gameData.predictedWinner === homeAway && <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${((homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)` }}>▲</sup>}
      </Col>
    )
  };
  return (
    <div>
      {<Container style={{backgroundColor: `${backgroundColor && gameData.predictedWinner === homeAway ? backgroundColor : ''}`}}>
        <Row style={{ color: '#FFFFFF', alignItems: 'center', fontSize: '.7rem', paddingLeft: 0, paddingRight: 0 }}>
          <Col style={{ padding: 0, textAlign: 'center' }} xs={1}>
            {<img src={homeAway === 'home' ? gameData.homeTeamDetails.logo : gameData.awayTeamDetails.logo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' /> }

          </Col>
          {renderTeamInfo()}
          <Col xs={4} style={{ padding: 5 }}>
            <Row style={{ padding: 5, display: 'flex', justifyContent: 'flex-end' }}>
              {(((gameData.homeScore || gameData.homeScore === 0) && (gameData.awayScore || gameData.awayScore === 0))) &&
                <Col style={{ textAlign: 'left', padding: 0 }}>
                  {homeAway === 'home' ? gameData.homeScore : gameData.awayScore}
                </Col>
              }
              {
                <Col xs={8} style={{ textAlign: 'right', paddingLeft: 0, paddingRight: 0 }}>
                  <OddsDisplayBox homeAway={homeAway} gameData={gameData} market='h2h' total={total} />
                </Col>
              }
            </Row>
          </Col>

        </Row>

      </Container>
      }
    </div>

  );
};


export default TeamOddsRow;
