import { useState } from 'react';
import { Button, Col, Row, Collapse, Container } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Filled star
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // Outlined s
import { Link } from 'react-router';
import { isSameDay } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setStarredGames } from '../../redux/user/actions/userActions';
import MatchupCardExtend from '../matchupCardExtend/matchupCardExtend';

const MatchupCard = ({ gameData, final, starred }) => {
  const dispatch = useDispatch()
  const { starredGames } = useSelector((state) => state.user)
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandSection, setExpandSection] = useState('Betting')
  const { sportsbook } = useSelector((state) => state.user);

  const handleStarClick = (event) => {
    // Check if the game is already starred
    if (!starredGames.some((game) => game.id === gameData.id)) {
      // If not, create a new array with the new starred game
      const updatedStarredGames = [...starredGames, gameData];

      // Save the updated starred games to cookies
      localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));

      dispatch(setStarredGames(updatedStarredGames)); // Dispatch the updated array

    } else {
      // If already starred, filter out the game and update the state
      const updatedStarredGames = starredGames.filter((game) => game.id !== gameData.id);
      localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
      dispatch(setStarredGames(updatedStarredGames)); // Dispatch the filtered array
    }
  };

  const formatGameTime = () => {
    const gameTime = new Date(gameData.commence_time);
    return isSameDay(gameData.commence_time, new Date())
      ? final ? `Final` : gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : final ? `${gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit' })} Final` : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  let backgroundColor
  if (final) {
    backgroundColor = gameData?.predictionCorrect ? 'rgba(6, 64, 43, .7)' : 'rgba(77, 0, 0, .7)';
  }
  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <Container style={{
      width: '18rem',
      backgroundColor: '#545454',
      color: '#d1d0cd',
      fontSize: '.8rem',
      borderRadius: '.5em',
      // margin: '.5rem auto',
      border: '.1em solid #858585',
      padding: '.2em .7em',
    }}>
      <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Col style={styles.timeColumn}>
          {gameData.timeRemaining ? gameData.timeRemaining : formatGameTime()}
        </Col>

        {!final ?
          <Col xs={1} style={{ padding: 0 }}>
            <Button
              id={gameData.id}
              onClick={handleStarClick}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: '.2rem', alignItems: 'center', display: 'flex', justifyContent: 'center', textAlign: 'center' }}
            >
              {starredGames.some((game) => game.id === gameData.id) ? (
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
              ) : (
                <FontAwesomeIcon icon={farStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
              )}
            </Button>
          </Col>
          :
          <></>}





      </Row>
      {
        <>
          <TeamOddsRow
            teamIndex={gameData.awayTeamIndex}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.awayScore}
            oppteamIndex={gameData.homeTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
            predictedWinner={gameData.predictedWinner === 'away' ? true : false}
            homeAway={'away'}
            final={final}
          />
          <TeamOddsRow
            teamIndex={gameData.homeTeamIndex}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.homeScore}
            oppteamIndex={gameData.awayTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
            predictedWinner={gameData.predictedWinner === 'home' ? true : false}
            homeAway={'home'}
            final={final}
          />
        </>
      }
      {(!final && !starred) && <Row style={{ padding: '.5em' }}>
        <Col xs={12}>
          {(isExpanded ? <Button className='expandButton' style={buttonStyle} onClick={handleToggle}>Collapse</Button> : <Button style={buttonStyle} onClick={handleToggle}>Details</Button>)}
        </Col>

      </Row>}
      {<Collapse in={isExpanded}>
        <Container>
          <Row>
            <Col style={{ padding: 0, textAlign: 'center' }}>
              <Button style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }} onClick={(() => setExpandSection('Stats'))}>Stats</Button>
            </Col>
            <Col style={{ padding: 0, textAlign: 'center' }}>
              <Button style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }} onClick={(() => setExpandSection('Betting'))}>Betting</Button>
            </Col>
            <Col style={{ padding: 0, textAlign: 'center' }}>
              <Button style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }} onClick={(() => setExpandSection('Recent'))}>Recent</Button>
            </Col>
          </Row>
          <MatchupCardExtend expandSection={expandSection} gameData={gameData} />
          <Row>
            <Col style={{ padding: 0, }}>
              <Link to={`/matchup/${gameData.id}`}>
                <Button variant="outline-light" style={styles.linkButton}>See Full Matchup</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Collapse>}
    </Container>
  );
};

const styles = {
  card: {
    backgroundColor: '#303036',
    color: '#D4D2D5',
    fontSize: '.8rem',
    borderRadius: '.5em',
    margin: '.3rem auto',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  timeColumn: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: '.7rem',
    paddingLeft: 5,
    paddingRight: 5,
    color: '#FFFFFF'
  },
  winPercentColumn: {
    fontSize: '.9rem',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center'
  },
  teamColumn: {
    fontWeight: 'bold',
    paddingTop: '10px',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: 'rgba(198, 159, 66, .6)',
    borderColor: 'rgba(198, 159, 66, .6)',
    fontSize: '.8rem',
    width: '100%',
    padding: 0
  }
};

const buttonStyle = {
  backgroundColor: 'rgb(104, 104, 117, .4)',  // Green-ish background, adjust as needed
  color: '#D4D2D5',             // Light text color
  border: 'none',               // No border
  borderRadius: '5px',          // Slightly rounded corners
  fontSize: '.8rem',            // Font size that is consistent with the card text
  transition: 'all 0.2s ease',  // Smooth transition for hover effect
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
  width: '100%'
};



export default MatchupCard;
