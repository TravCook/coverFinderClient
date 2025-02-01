import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import { useState, } from 'react';
import { isSameDay } from '../../utils/constants.js';
import { Link } from 'react-router';
import { sports } from '../../utils/constants.js';
import { useSelector, useDispatch } from 'react-redux';

const UpcomingGames = () => {
    document.title = 'Upcoming Games'
  const games = useSelector((state) => state.games.games);
  const [selectedSection, setSelectedSection] = useState('todaysGames'); // Default section
  const starredGames = useSelector((state) => state.user.starredGames);


  const filterAndMapGames = (condition, league) => {
    return games
      ?.filter((game) => game.sport_title === league.toUpperCase()) // Filter by sport league
      .filter(condition) // Apply condition (e.g., today's games)
      .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)) // Sort by commence time
      .map((game) => (
        <Col xs={12} sm={4} lg={4} xl={2} key={`${game.id}`} style={{paddingLeft: 5, paddingRight: 5}}>
          <MatchupCard
            todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
            gameData={game}
          />
        </Col>
      ));
  };

  const renderStarredGames = () => {
    if (starredGames.length > 0) {
      return (
        <Row className="mb-3 pb-3" style={{ borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)' }}>
          <Col xs={12}>
            <h4 style={{ color: 'whitesmoke' }}>Starred Games</h4>
          </Col>
          {starredGames.sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)).map((game) => (
            <Col xs={12} sm={4} lg={4} xl={2} key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <MatchupCard
                todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
                gameData={game}
              />
            </Col>
          ))}
        </Row>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'todaysGames':
        // Check if there are games for today
        const todayGames = games?.filter((game) =>
          isSameDay(game.commence_time, new Date()) // Check if game is today
        );

        // If there are no games for today, render tomorrow's games instead
        if (todayGames.length === 0) {
          return (
            <>
              {sports?.map((sport) => {
                // Filter games that match tomorrow's date and the current sport league
                const tomorrowGames = games?.filter((game) =>
                  isSameDay(game.commence_time, new Date(new Date().setDate(new Date().getDate() + 1))) &&
                  game.sport_title.toLowerCase() === sport.league.toLowerCase()
                );

                // Only render the section if there are games for this sport
                if (tomorrowGames.length === 0) return null;

                return (
                  <Row className="mb-3 pb-3" style={{ borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)' }} key={sport.league}>
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
                      (game) => isSameDay(game.commence_time, new Date(new Date().setDate(new Date().getDate() + 1))),
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
                  isSameDay(game.commence_time, new Date()) &&
                  game.sport_title.toLowerCase() === sport.league.toLowerCase()
                );

                // Only render the section if there are games for this sport
                if (todayGames.length === 0) return null;

                return (
                  <Row className="mb-3 pb-3" style={{ borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)' }} key={sport.league}>
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
                      (game) => isSameDay(game.commence_time, new Date()),
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
          <>
            {sports?.map((sport) => {
              // Filter games that match today's date and the current sport league
              const todayGames = games?.filter((game) =>
                isSameDay(game.commence_time, new Date()) &&
                game.sport_title.toLowerCase() === sport.league.toLowerCase() &&
                Math.abs(game.homeTeamIndex - game.awayTeamIndex) > 20
              );

              // Only render the section if there are games for this sport
              if (todayGames.length === 0) return null;

              return (
                <Row className="mb-3 pb-3" style={{ borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)' }} key={sport.league}>
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
                    (game) => Math.abs(game.homeTeamIndex - game.awayTeamIndex) > 20 && isSameDay(game.commence_time, new Date()),
                    sport.league
                  )}
                </Row>
              );
            })}
          </>
        );

      case 'closeCalls':
        return (
          <>
            {sports?.map((sport) => {
              // Filter games that match today's date and the current sport league
              const todayGames = games?.filter((game) =>
                isSameDay(game.commence_time, new Date()) &&
                game.sport_title.toLowerCase() === sport.league.toLowerCase() &&
                Math.abs(game.homeTeamIndex - game.awayTeamIndex) < 5
              );

              // Only render the section if there are games for this sport
              if (todayGames.length === 0) return null;

              return (
                <Row className="mb-3 pb-3" style={{ borderBottom: 'solid 3px rgba(245, 245, 245, 0.5)' }} key={sport.league}>
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
                    (game) => Math.abs(game.homeTeamIndex - game.awayTeamIndex) < 5 && isSameDay(game.commence_time, new Date()),
                    sport.league
                  )}
                </Row>
              );
            })}
          </>
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
            <Card.Body>
              {renderStarredGames()} {/* Starred games section */}
              <Card.Header className="d-flex justify-content-evenly align-items-center">
                <Button
                  style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}
                  onClick={() => setSelectedSection('todaysGames')}
                >
                  {games.filter((game) =>
                    isSameDay(game.commence_time, new Date())
                  ).length > 0 ? `Today's Games` : `Tomorrow's Games`}
                </Button>
                <Button
                  style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                  onClick={() => setSelectedSection('highStatDisparity')}
                >
                  High Stat Disparity
                </Button>
                <Button
                  style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212'  }}
                  onClick={() => setSelectedSection('closeCalls')}
                >
                  Close Calls
                </Button>
              </Card.Header>
              {renderContent()} {/* Render the main content based on the selected section */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpcomingGames;
