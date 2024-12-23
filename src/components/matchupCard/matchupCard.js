import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import moment from 'moment';

const MatchupCard = ({ gameData, bestBets, setBestBets, bankroll, sportsbook }) => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  // Helper function to fetch team data
  const fetchTeamData = (teamName, setTeam) => {
    fetch('http://localhost:3001/api/teams/search', {
      method: 'POST',
      body: JSON.stringify({ searchTeam: teamName }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((res) => res.json())
      .then((data) => setTeam(data || null));
  };

  useEffect(() => {
    if (gameData?.home_team && gameData?.away_team) {
      fetchTeamData(gameData.home_team, setHomeTeam);
      fetchTeamData(gameData.away_team, setAwayTeam);
    }
  }, [gameData]); // Dependency on gameData, re-run if it changes

  const formatGameTime = () => {
    const gameTime = moment(gameData.commence_time).utc().local();
    return moment(gameData.commence_time).isSame(moment(), 'day') 
      ? `Today @ ${gameTime.format('h:MMa')}` 
      : gameTime.format('MMM/DD @ h:MMa');
  };

  const winPercent = gameData.winPercent ? `${(gameData.winPercent * 100).toFixed(2)}%` : 'Loading...';

  return (
    <div style={{ backgroundColor: '#303036', color: '#D4D2D5', fontSize: '14px', width: '18rem', borderRight: 'solid', borderLeft: 'solid' }}>
      <Row>
        <Col style={{ textAlign: 'center', borderStyle: 'solid', borderTopStyle: 'none', borderLeftStyle: 'none', borderRadius: '.25em' }}>
          {formatGameTime()}
        </Col>
        <Col style={{ textAlign: 'center', padding: '0px'}}>
          {winPercent}
        </Col>
      </Row>
      {awayTeam && (
        <TeamOddsRow
          score={gameData.awayScore}
          market="h2h"
          bestBets={bestBets}
          setBestBets={setBestBets}
          bankroll={bankroll}
          winPercent={gameData.winPercent}
          teamIndex={gameData.awayTeamIndex}
          oppteamIndex={gameData.homeTeamIndex}
          team={awayTeam}
          oppTeam={homeTeam}
          gameData={gameData}
          sportsbook={sportsbook}
          total="Over"
        />
      )}
      {homeTeam && (
        <TeamOddsRow
          score={gameData.homeScore}
          market="h2h"
          bestBets={bestBets}
          setBestBets={setBestBets}
          bankroll={bankroll}
          winPercent={gameData.winPercent}
          teamIndex={gameData.homeTeamIndex}
          oppteamIndex={gameData.awayTeamIndex}
          team={homeTeam}
          oppTeam={awayTeam}
          gameData={gameData}
          sportsbook={sportsbook}
          total="Under"
        />
      )}
    </div>
  );
};

export default MatchupCard;
