import { Row, Col, Button, Container } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TeamOddsRow = ({backgroundColor, isExpanded, setIsExpanded, final, score, team, teamIndex, oppTeam, oppteamIndex, gameData, total, }) => {
  const { sportsbook } = useSelector((state) => state.user);

  const renderTeamInfo = () => {
    if (final) {
      return (
        <Col xs={5} style={{ alignContent: 'center', padding: 5 }}>
          {team ? `${team.abbreviation} ${team.teamName}` : <></>}
          {teamIndex > oppteamIndex ? <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${(teamIndex / 45) * 120}, 100%, 50%)` }}>▲</sup> : <></>}
        </Col>
      );
    } else {
      return (
        <Col xs={6} style={{ alignContent: 'center', padding: 5 }}>
          {team ? `${team.abbreviation} ${team.teamName}` : <></>}
          {teamIndex > oppteamIndex ? <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${(teamIndex / 45) * 120}, 100%, 50%)` }}>▲</sup> : <></>}
        </Col>
      );
    }

  };
  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };
  return (
    <div>
      {<Container>
        <Row style={{ alignItems: 'center', fontSize: '.7rem', paddingLeft: 5, paddingRight: 5, backgroundColor: backgroundColor && teamIndex > oppteamIndex ? backgroundColor : '#303036' }}>
          <Col style={{ padding: 0, textAlign: 'center' }} xs={1}>
            <img src={team.logo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' />
          </Col>
          {renderTeamInfo()}
          <Col style={{ textAlign: 'right', padding: 5 }}>
            <Row style={{ padding: 5 }}>
              {score || score === 0 ?
                <Col style={{ textAlign: 'center', padding: 0 }}>
                  {score}
                </Col> :
                <Col xs={6}>
                  <span></span>
                </Col>
              }
              <Col xs={6} style={{ textAlign: 'right', paddingLeft: 5, paddingRight: 5 }}>
                <OddsDisplayBox teamIndex={teamIndex} key={`${team?.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />
              </Col>
            </Row>
          </Col>
          
        </Row>
        <Row>
        {gameData.home_team === team.espnDisplayName ? isExpanded ? <Button style={isExpanded ? buttonHoverStyle : buttonStyle} onClick={handleToggle}>Collapse</Button> : <Button style={isExpanded ? buttonHoverStyle : buttonStyle} onClick={handleToggle}>Details</Button> : <></>}
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
  padding: '8px 16px',          // Padding for better click area
  fontSize: '.9rem',            // Font size that is consistent with the card text
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
