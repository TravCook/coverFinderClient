import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball, faBaseball, faFootball, faHockeyPuck } from '@fortawesome/free-solid-svg-icons';
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

  const [upcomingGames, setUpcomingGames] = useState();
  const [selectedSection, setSelectedSection] = useState('todaysGames'); // Default section

  useEffect(() => {
    fetchUpcomingGames();
  }, []);

  const fetchUpcomingGames = async () => {
    try {
      const response = await fetch('http://3.137.71.56:3001/api/odds/upcomingGames');
      const data = await response.json();
      setUpcomingGames(data);
    } catch (error) {
      console.error('Error fetching upcoming games:', error);
    }
  };

  const filterAndMapGames = (condition) => {
    return games?.filter(condition).map((game) => (
      <Col xs={12 } sm={6} xl={3}>
        <MatchupCard key={game.id} valueBets={valueBets} todaysGames={todaysGames} betType={betType} bankroll={bankroll} gameData={game} sportsbook={sportsBook} />
      </Col>
    ));
  };

  const handleSportSelect = (e) => {
    setPageSelect(e.target.id);
  };

  const renderSportCard = (sport, filterCondition) => {
    const filteredGames = games.filter((game) => game.sport_title === sport.league).filter(filterCondition);
    if (filteredGames.length === 0) return null;

    const renderNextGames = () => {
      const leagueGameMap = {
        NFL: upcomingGames?.nextNFLGames,
        NCAAF: upcomingGames?.nextNCAAFGames,
        NBA: upcomingGames?.nextNBAGames,
        NHL: upcomingGames?.nextNHLGames,
        MLB: upcomingGames?.nextMLBGames
      };
    };

    const renderTitleRow = () => {
      const sportIcons = {
        NFL: faFootball,
        NCAAF: faFootball,
        NBA: faBasketball,
        NHL: faHockeyPuck,
        MLB: faBaseball
      };
      return (
        <Row style={{display: 'flex', alignItems: 'center'  }}>
          {/* <Col  style={{fontSize: '1.6rem', paddingLeft: 5, paddingRight: 5 }}><FontAwesomeIcon icon={sportIcons[sport.league]} /></Col> */}
          <Col style={{fontSize: '.8rem', padding: 5}}>{sport.league}</Col>
          <Col style={{textAlign: 'right'}} >
            <Link to={`/sport/${sport.league}`}>
              <Button id={sport.name} variant="outline-light" style={{ fontSize: '.8rem',backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                {filteredGames.length} Games
              </Button>
            </Link>
          </Col>
        </Row>
      );
    };

    return (
      <Col xs={12} className="mb-4">
        <Card style={{ backgroundColor: '#2c2c2c', color: '#D4D2D5' }} onClick={handleSportSelect}>
            <div style={{ textAlign: 'center'}}>{renderTitleRow()}</div>
        </Card>
      </Col>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'todaysGames':
        return (
          <Row className="g-3">
            {games.filter((game) =>
              moment(game.commence_time).local().isSame(moment().local(), 'day')
            ).length > 0
              ? filterAndMapGames((game) => moment(game.commence_time).local().isSame(moment().local(), 'day'))
              : filterAndMapGames((game) => moment(game.commence_time).local().isSame(moment().add(1, 'days').local(), 'day'))
            }
          </Row>
        );
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
        {sports.map((sport) => {
          const currentMonth = moment().format('M');
          const isInSeason =
            sport.multiYear
              ? currentMonth >= sport.startMonth || currentMonth <= sport.endMonth
              : currentMonth >= sport.startMonth && currentMonth <= sport.endMonth;
              let largeSplit = 12/sports.filter((sport)=>sport.multiYear
              ? currentMonth >= sport.startMonth || currentMonth <= sport.endMonth
              : currentMonth >= sport.startMonth && currentMonth <= sport.endMonth).length
          if (!isInSeason) return null;

          return (
            <Col xs={6} sm={3} lg={largeSplit}>
              <div className="sport-section">
                {renderSportCard(sport, (game) => moment(game.commence_time).local().isBefore(moment().add(30, 'days')), sport.league)}
              </div>
            </Col>
          );
        })}
      </Row>
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
