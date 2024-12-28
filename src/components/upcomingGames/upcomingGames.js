import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import moment from 'moment';

const UpcomingGames = ({ bankroll, sportsBook, setPageSelect, games, betAmount }) => {
  const sports = [
    { name: "americanfootball_nfl", espnSport: 'Football', league: 'NFL', startMonth: 9, endMonth: 2, multiYear: true, statYear: 2024 },
    { name: "americanfootball_ncaaf", espnSport: 'Football', league: 'NCAAF', startMonth: 9, endMonth: 1, multiYear: true, statYear: 2024 },
    { name: "basketball_nba", espnSport: 'Basketball', league: 'NBA', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2024 },
    { name: "icehockey_nhl", espnSport: 'Hockey', league: 'NHL', startMonth: 10, endMonth: 4, multiYear: true, statYear: 2025, prevstatYear: 2024 },
    { name: "baseball_mlb", espnSport: 'Baseball', league: 'MLB', startMonth: 3, endMonth: 10, multiYear: false, statYear: 2024 },
  ];

  const handleClick = (event) => {
    setPageSelect(event.target.id);
  };



  const filterAndMapGames = (condition) => {
    return games?.filter(condition).map((game) => (
      <MatchupCard key={game.id} bankroll={bankroll} gameData={game} sportsbook={sportsBook} />
    ));
  };

  const renderSportRow = (sport, filterCondition, title, buttonText = 'see more') => {
    const filteredGames = games.filter((game) => game.sport_title === sport.league)
      .filter(filterCondition);
    if (filteredGames.length === 0) return null;

    return (
      <Row>
        <Col>{`Upcoming ${sport.league} Games`}</Col>
        <Col xs={4} style={{ textAlign: 'right' }}>
          <Button id={sport.espnSport} style={{ backgroundColor: '#0A0A0B', borderColor: '#0A0A0B' }} onClick={handleClick}>
            {buttonText}
          </Button>
        </Col>
        <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
          {filterAndMapGames((game) => filteredGames.includes(game))}
        </Row>
      </Row>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          {/* High Win Chance Section */}
          <Row>
            <Col>High Win Chance</Col>
          </Row>
          <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
            {filterAndMapGames((game) => game.winPercent >= 0.60 && moment(game.commence_time).local().isBefore(moment().add(1, 'days')))}
          </Row>

          {/* High Stat Disparity Section */}
          <Row>
            <Col>High Stat Disparity</Col>
          </Row>
          <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
            {filterAndMapGames((game) => Math.abs(game.homeTeamIndex - game.awayTeamIndex) > .5 && moment(game.commence_time).local().isBefore(moment().add(1, 'days')))}
          </Row>

          {/* Close Games Section */}
          <Row>
            <Col>Close Games</Col>
          </Row>
          <Row style={{ overflowX: 'scroll', flexWrap: 'nowrap', scrollbarWidth: 'thin' }}>
            {filterAndMapGames((game) => Math.abs(game.homeTeamIndex - game.awayTeamIndex) < .2 && moment(game.commence_time).local().isBefore(moment().add(1, 'days')))}
          </Row>

          {/* Upcoming Sports */}
          {sports.map((sport) => {
            const currentMonth = moment().format('M');
            const isInSeason = sport.multiYear
              ? currentMonth > sport.startMonth || currentMonth < sport.endMonth
              : currentMonth > sport.startMonth && currentMonth < sport.endMonth;

            if (!isInSeason) return null;

            return renderSportRow(sport, (game) => moment(game.commence_time).local().isBefore(moment().add(6, 'days')), sport.league);
          })}
        </Col>

        {/* <Col xs={12} md={3}>
          <Row>
            <Col style={{ textAlign: 'center' }}>
              Parlay Picker
            </Col>
            <Row>
              PARLAY PICKER MODULE WHEN MADE
            </Row>
          </Row>
        </Col> */}
      </Row>
    </Container>
  );
};

export default UpcomingGames;
