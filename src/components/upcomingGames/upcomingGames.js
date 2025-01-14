import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import { useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { sports } from '../../utils/constants.js';
import { useSelector } from 'react-redux';

const UpcomingGames = () => {
  const games = useSelector((state) => state.games.games);
  const [selectedSection, setSelectedSection] = useState('todaysGames'); // Default section

  const filterAndMapGames = (condition, league) => {
    return games
      ?.filter((game) => game.sport_title === league.toUpperCase()) // Filter by sport league
      .filter(condition) // Apply condition (e.g., today's games)
      .sort((a,b) => moment(a.commence_time).isBefore(moment(b.commence_time)) ? -1 : 1)
      .map((game) => (
        <Col xs={12} sm={6} xl={3} key={`${game.id}`}>
          <MatchupCard
            todaysGames={games.filter((game)=> moment(game.commence_time).isSame(moment(), 'day'))}
            gameData={game}
          />
        </Col>
      ));
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'todaysGames':
        // Check if there are games for today
        const todayGames = games?.filter((game) =>
          moment(game.commence_time).local().isSame(moment().local(), 'day')
        );
  
        // If there are no games for today, render tomorrow's games instead
        if (todayGames.length === 0) {
          return (
            <>
              {sports?.map((sport) => {
                // Filter games that match tomorrow's date and the current sport league
                const tomorrowGames = games?.filter((game) =>
                  moment(game.commence_time).local().isSame(moment().add(1, 'days').local(), 'day') &&
                  game.sport_title.toLowerCase() === sport.league.toLowerCase()
                );
  
                // Only render the section if there are games for this sport
                if (tomorrowGames.length === 0) return null;
  
                return (
                  <Row className="mb-3 pb-3" style={{borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)'}} key={sport.league}>
                    <Col xs={6}>
                      <h4 style={{ color: 'whitesmoke' }}>{sport.league.toUpperCase()} Games</h4>
                    </Col>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      <Link to={`/sport/${sport.league}`}>
                        <Button id={sport.name} variant="outline-light" style={{ fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                          More
                        </Button>
                      </Link>
                    </Col>
                    {filterAndMapGames(
                      (game) => moment(game.commence_time).local().isSame(moment().add(1, 'days').local(), 'day'),
                      sport.league
                    )}
                  </Row>
                );
              })}
            </>
          );
        } else {
          return (
            <>
              {sports?.map((sport) => {
                // Filter games that match today's date and the current sport league
                const todayGames = games?.filter((game) =>
                  moment(game.commence_time).local().isSame(moment().local(), 'day') &&
                  game.sport_title.toLowerCase() === sport.league.toLowerCase()
                );
  
                // Only render the section if there are games for this sport
                if (todayGames.length === 0) return null;
  
                return (
                  <Row className="mb-3 pb-3" style={{borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)'}} key={sport.league}>
                    <Col xs={6}>
                      <h4 style={{ color: 'whitesmoke' }}>{sport.league.toUpperCase()} Games</h4>
                    </Col>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      <Link to={`/sport/${sport.league}`}>
                        <Button id={sport.name} variant="outline-light" style={{ fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                          More
                        </Button>
                      </Link>
                    </Col>
                    {filterAndMapGames(
                      (game) => moment(game.commence_time).local().isSame(moment().local(), 'day'),
                      sport.league
                    )}
                  </Row>
                );
              })}
            </>
          );
        }
  
      case 'highStatDisparity':
        return (
          <Row className="g-3">
            {filterAndMapGames((game) =>
              Math.abs(game.homeTeamIndex - game.awayTeamIndex) > 0.5 && moment(game.commence_time).local().isSame(moment().local(), 'day')
            )}
          </Row>
        );
  
      case 'closeCalls':
        return (
          <Row className="g-3">
            {filterAndMapGames((game) =>
              Math.abs(game.homeTeamIndex - game.awayTeamIndex) < 0.2 && moment(game.commence_time).local().isSame(moment().local(), 'day')
            )}
          </Row>
        );
  
      default:
        return null;
    }
  };
  

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Card style={{ background: 'linear-gradient(90deg, rgba(44,44,44,1) 0%, rgba(94,94,94,1) 50%, rgba(44,44,44,1) 100%)', borderColor: '#575757' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span
                style={{ color: 'whitesmoke', cursor: 'pointer' }}
                onClick={() => setSelectedSection('todaysGames')}
              >
                {games.filter((game) =>
                  moment(game.commence_time).local().isSame(moment().local(), 'day')
                ).length > 0 ? `Today's Games` : `Tomorrow's Games`}
              </span>
              <span
                style={{ color: 'whitesmoke', cursor: 'pointer' }}
                onClick={() => setSelectedSection('highStatDisparity')}
              >
                High Stat Disparity
              </span>
              <span
                style={{ color: 'whitesmoke', cursor: 'pointer' }}
                onClick={() => setSelectedSection('closeCalls')}
              >
                Close Calls
              </span>
            </Card.Header>
            <Card.Body>{renderContent()}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpcomingGames;
