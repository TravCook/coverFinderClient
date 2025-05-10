import { Row, Col, Container } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';

const TeamOddsRow = ({ backgroundColor, final, gameData, total, homeAway }) => {

  const renderTeamInfo = () => {
    return (
      <Col xs={7} style={{ letterSpacing: '.5px', alignContent: 'center', padding: '.5rem', fontSize: '1.1em' }}>
        {gameData && homeAway === 'home' ? `${gameData.homeTeamAbbr} ${gameData.homeTeamShort}` : `${gameData.awayTeamAbbr} ${gameData.awayTeamShort}`}
        {gameData.predictedWinner === homeAway && <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${((homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)` }}>▲</sup>}
      </Col>
    )
  };
  return (
    <div>
      {<Container style={{backgroundColor: `${backgroundColor && gameData.predictedWinner === homeAway ? backgroundColor : ''}`}}>
        <Row style={{ color: '#FFFFFF', alignItems: 'center', fontSize: '.7rem', paddingLeft: 0, paddingRight: 0 }}>
          <Col style={{ padding: 0, textAlign: 'center' }} xs={1}>
            {<img src={homeAway === 'home' ? gameData.homeTeamlogo : gameData.awayTeamlogo} style={{ width: '1.5rem', maxWidth: !final ? '30px' : '17px' }} alt='Team Logo' /> }

          </Col>
          {renderTeamInfo()}
          <Col xs={final ? 4 : 4} style={{ padding: 5 }}>
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

const buttonStyle = {
  backgroundColor: '#303036',  // Green-ish background, adjust as needed
  color: '#D4D2D5',             // Light text color
  border: 'none',               // No border
  borderRadius: '5px',          // Slightly rounded corners
  // padding: '8px 16px',          // Padding for better click area
  fontSize: '.8rem',            // Font size that is consistent with the card text
  transition: 'all 0.2s ease',  // Smooth transition for hover effect
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
};

// Hover effect
const buttonHoverStyle = {
  ...buttonStyle,
  backgroundColor: '#2A2A2A', // Darker shade of green for hover effect
  cursor: 'pointer',           // Cursor change to indicate interactivity
};

export default TeamOddsRow;
