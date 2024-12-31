import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import moment from 'moment';
import { Link } from 'react-router';

const MatchupCard = ({ gameData, bestBets, setBestBets, bankroll, sportsbook, betType, valueBets, todaysGames }) => {
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
      ? `${gameTime.format('h:MMa')}`
      : gameTime.format('MMM/DD @ h:MMa');
  };

  const winPercent = gameData.winPercent === 0 ? `${(gameData.winPercent * 100).toFixed(2)}%` : gameData.winPercent ? `${(gameData.winPercent * 100).toFixed(2)}%` : 'Loading...';

  return (
    <div style={styles.card}>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col style={styles.timeColumn}>
          {formatGameTime()}
        </Col>
        <Col xs={3} style={styles.winPercentColumn}>
          {winPercent}
        </Col>
        <Col style={{textAlign: 'right', padding: 0}}>
        <Link to={`/matchup/${gameData.id}`}>
            <Button variant="outline-light" style={{ backgroundColor: '#0A0A0B', borderColor: '#0A0A0B' }}>
              See stats
            </Button>
          </Link>
        </Col>
      </Row>
      {awayTeam && (
        <>
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
            valueBets={valueBets}
            todaysGames={todaysGames}
            betType={betType}
            total="Over"
          />
        </>
      )}
      {homeTeam && (
        <>
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
            betType={betType}
            valueBets={valueBets}
            todaysGames={todaysGames}
            total="Under"
          />
        </>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#303036',
    color: '#D4D2D5',
    fontSize: '14px',
    width: '22rem',
    borderRadius: '.5em',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  timeColumn: {
    textAlign: 'center',
    borderStyle: 'solid',
    borderTopStyle: 'none',
    borderLeftStyle: 'none',
    borderRadius: '.25em',
    padding: '.5rem',
  },
  winPercentColumn: {
    textAlign: 'center',
    padding: '0px',
    fontWeight: 'bold',
    fontSize: '16px',
    paddingTop: '0.5rem',
  },
  rowHeader: {
    display: 'flex',
    textAlign: 'right',
    justifyContent: 'right',
    padding: '0.5rem 0',
    fontSize: '12px',
    color: '#A4A6A8',
    fontWeight: 'bold',
  }
};

export default MatchupCard;
