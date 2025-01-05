import { Container, Row, Col, Button, Card, Collapse } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketball, faBaseball, faFootball, faHockeyPuck } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { Link } from 'react-router';

const UpcomingGames = ({ bankroll, sportsBook, setPageSelect, games, betType, valueBets, todaysGames }) => {
  const sports = [
    { name: "americanfootball_nfl", espnSport: 'Football', league: 'NFL', startMonth: 9, endMonth: 2, multiYear: true, statYear: 2024 },
    { name: "americanfootball_ncaaf", espnSport: 'Football', league: 'NCAAF', startMonth: 9, endMonth: 1, multiYear: true, statYear: 2024 },
    { name: "basketball_nba", espnSport: 'Basketball', league: 'NBA', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2024 },
    { name: "icehockey_nhl", espnSport: 'Hockey', league: 'NHL', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, prevstatYear: 2024 },
    { name: "baseball_mlb", espnSport: 'Baseball', league: 'MLB', startMonth: 3, endMonth: 10, multiYear: false, statYear: 2024 },
  ];

  const [upcomingGames, setUpcomingGames] = useState()
  // Helper function to fetch team data
  const fetchTeamData = () => {
    fetch('http://localhost:3001/api/odds/upcomingGames', {
      method: 'GET',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((res) => res.json())
      .then((data) => setUpcomingGames(data));
  };

  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setPageSelect(event.target.id);
  };

  const filterAndMapGames = (condition) => {
    return games?.filter(condition).map((game) => (
      <MatchupCard valueBets={valueBets} todaysGames={todaysGames} betType={betType} key={game.id} bankroll={bankroll} gameData={game} sportsbook={sportsBook} />
    ));
  };

  const handleSportSelect = (e) => {
    console.log(e.target.id)
  }

  const renderSportCard = (sport, filterCondition, title, buttonText = 'more') => {
    const filteredGames = games.filter((game) => game.sport_title === sport.league)
      .filter(filterCondition);
    if (filteredGames.length === 0) return null;

    const renderNextGames = () => {
      if (sport.league === 'NFL' && upcomingGames) {
        return (
          upcomingGames.nextNFLGames.map((game, idx) => {
            if (idx < 3) {
              return (
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ padding: 0 }}><img src={game.awayTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                    <Col xs={2} style={{ padding: 0 }}>vs</Col>
                    <Col style={{ padding: 0 }}><img src={game.homeTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                  </Row>
                </Col>
              )
            }
          })
        )

      } else if (sport.league === 'NCAAF' && upcomingGames) {
        return (
          upcomingGames.nextNCAAFGames.map((game, idx) => {
            if (idx < 3) {
              return (
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ padding: 0 }}><img src={game.awayTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                    <Col xs={2} style={{ padding: 0 }}>vs</Col>
                    <Col style={{ padding: 0 }}><img src={game.homeTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                  </Row>
                </Col>
              )
            }
          })
        )

      } else if (sport.league === 'NBA' && upcomingGames) {
        return (
          upcomingGames.nextNBAGames.map((game, idx) => {
            if (idx < 3) {
              return (
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ padding: 0 }}><img src={game.awayTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                    <Col xs={2} style={{ padding: 0 }}>vs</Col>
                    <Col style={{ padding: 0 }}><img src={game.homeTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                  </Row>
                </Col>
              )
            }
          })
        )

      } else if (sport.league === 'NHL' && upcomingGames) {
        return (
          upcomingGames.nextNHLGames.map((game, idx) => {
            if (idx < 3) {
              return (
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ padding: 0 }}><img src={game.awayTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                    <Col xs={2} style={{ padding: 0 }}>vs</Col>
                    <Col style={{ padding: 0 }}><img src={game.homeTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                  </Row>
                </Col>
              )
            }
          })
        )

      } else if (sport.league === 'MLB' && upcomingGames) {
        return (
          upcomingGames.nextMLBGames.map((game, idx) => {
            if (idx < 3) {
              return (
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ padding: 0 }}><img src={game.awayTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                    <Col xs={2} style={{ padding: 0 }}>vs</Col>
                    <Col style={{ padding: 0 }}><img src={game.homeTeamLogo} style={{ width: '20px' }} alt='Team Logo' /></Col>
                  </Row>
                </Col>
              )
            }
          })
        )

      }
    }

    const renderTitleRow = () => {
      if (sport.league === 'NFL' && upcomingGames) {
        return (
          <Row>
            <Col xs={2} ><FontAwesomeIcon style={{ marginLeft: 5 }} icon={faFootball} /> </Col>
            <Col style={{textAlign: 'left'}}>{sport.league}</Col>
            
          </Row>
        )

      } else if (sport.league === 'NCAAF' && upcomingGames) {
        return (
          <Row>
            <Col xs={2}><FontAwesomeIcon style={{ marginLeft: 5 }} icon={faFootball} /></Col>
            <Col style={{textAlign: 'left'}}>{sport.league}</Col>
          </Row>
        )

      } else if (sport.league === 'NBA' && upcomingGames) {
        return (
          <Row>
            <Col xs={2}><FontAwesomeIcon style={{ marginLeft: 5 }} icon={faBasketball} /></Col>
            <Col style={{textAlign: 'left'}}>{sport.league}</Col>
          </Row>
        )

      } else if (sport.league === 'NHL' && upcomingGames) {
        return (
          <Row>
            <Col xs={2}><FontAwesomeIcon style={{ marginLeft: 5 }} icon={faHockeyPuck} /></Col>
            <Col style={{textAlign: 'left'}}>{sport.league}</Col>
          </Row>
        )

      } else if (sport.league === 'MLB' && upcomingGames) {
        return (
          <Row>
            <Col xs={2}><FontAwesomeIcon style={{ marginLeft: 5 }} icon={faBaseball} /></Col>
            <Col style={{textAlign: 'left'}}>{sport.league} </Col>
          </Row>
        )

      }
    }


    return (
      <Col className="mb-4">
        <Card style={{ cursor: 'pointer', backgroundColor: '#2c2c2c', color: '#D4D2D5' }} onClick={handleClick}>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}>{renderTitleRow()} </Card.Title>
            <Row>
              {renderNextGames(filteredGames)}
            </Row>
            <Col style={{ padding: '.5em' }}>
              <Row >
                <Col style={{ alignContent: 'center' }} >
                  <Card.Text>
                    {filteredGames.length} upcoming games
                  </Card.Text>
                </Col>
                <Col xs={4}>
                <Link to={`/sport/${sport.league}`}>
                <Button id={sport.name} variant="outline-light" style={{ backgroundColor: '#0A0A0B', borderColor: '#0A0A0B' }} onClick={handleSportSelect}>
                    {buttonText}
                  </Button>
                </Link>

                </Col>

              </Row>
            </Col>

          </Card.Body>
        </Card>
      </Col>
    );
  };


  useEffect(() => {
    fetchTeamData(games)
  }, [games])

    const [selectedSection, setSelectedSection] = useState('todaysGames'); // Default section
  
    const handleSectionClick = (section) => {
      setSelectedSection(section);
    };

    
  const renderContent = () => {
    switch (selectedSection) {
      case 'todaysGames':
        return (
          <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {games.filter((game) =>
              moment(game.commence_time).local().isSame(moment().local(), 'day')
            ).length > 0
              ? filterAndMapGames((game) => moment(game.commence_time).local().isSame(moment().local(), 'day'))
              : filterAndMapGames((game) => moment(game.commence_time).local().isSame(moment().add('1', 'days').local(), 'day'))
            }
          </Row>
        );
      case 'highStatDisparity':
        return (
          <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {filterAndMapGames((game) =>
              Math.abs(game.homeTeamIndex - game.awayTeamIndex) > 0.5 && moment(game.commence_time).local().isSame(moment().local(), 'day')
            )}
          </Row>
        );
      case 'closeCalls':
        return (
          <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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
      <Col xs={10}>
      <Card style={{ background: 'linear-gradient(90deg, rgba(44,44,44,1) 0%, rgba(94,94,94,1) 50%, rgba(44,44,44,1) 100%)', borderColor: '#575757' }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span
            style={{ color: 'whitesmoke', cursor: 'pointer' }}
            onClick={() => handleSectionClick('todaysGames')}
          >
            {games.filter((game) =>
              moment(game.commence_time).local().isSame(moment().local(), 'day')
            ).length > 0 ? `Today's Games` : `Tomorrow's Games`}
          </span>
          <span
            style={{ color: 'whitesmoke', cursor: 'pointer' }}
            onClick={() => handleSectionClick('highStatDisparity')}
          >
            High Stat Disparity
          </span>
          <span
            style={{ color: 'whitesmoke', cursor: 'pointer' }}
            onClick={() => handleSectionClick('closeCalls')}
          >
            Close Calls
          </span>
        </Card.Header>
        <Card.Body>
          {renderContent()}
        </Card.Body>
      </Card>
    </Col>
        <Col>
          {/* Upcoming Sports */}
          {sports.map((sport) => {
            const currentMonth = moment().format('M');
            const isInSeason =
              sport.multiYear
                ? currentMonth >= sport.startMonth || currentMonth <= sport.endMonth
                : currentMonth >= sport.startMonth && currentMonth <= sport.endMonth;

            // Only render sports that are in season
            if (!isInSeason) return null;

            return (
              <Row key={sport.name}>
                {/* Render each sport in a column */}
                <Col xs={12}>
                  <div className="sport-section">
                    {/* <h3>{sport.league} Upcoming Games</h3> */}
                    {renderSportCard(sport, (game) => moment(game.commence_time).local().isBefore(moment().add(6, 'days')), sport.league)}
                  </div>
                </Col>
              </Row>
            );
          })}
        </Col>

      </Row>
    </Container>
  );
};

export default UpcomingGames;
