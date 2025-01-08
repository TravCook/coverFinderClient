import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import moment from 'moment';
import { Link } from 'react-router';

const MatchupCard = ({ gameData, bestBets, setBestBets, bankroll, sportsbook, betType, valueBets, todaysGames, final }) => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  useEffect(() => {
    if (gameData?.home_team && gameData?.away_team) {
      fetchTeamData(gameData.home_team, setHomeTeam);
      fetchTeamData(gameData.away_team, setAwayTeam);
    }
  }, [gameData]);

  const fetchTeamData = async (teamName, setTeam) => {
    try {
      const response = await fetch('http://3.137.71.56:3001/api/teams/search', {
        method: 'POST',
        body: JSON.stringify({ searchTeam: teamName, sport: gameData.sport }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      const data = await response.json();
      setTeam(data || null);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const formatGameTime = () => {
    const gameTime = moment(gameData.commence_time).utc().local();
    return moment(gameData.commence_time).isSame(moment(), 'day')
      ? `${gameTime.format('h:MMa')}`
      : gameTime.format('MMM/DD @ h:MMa');
  };

  const winPercent = gameData.winPercent === 0 ? `${(gameData.winPercent * 100).toFixed(2)}%` : gameData.winPercent ? `${(gameData.winPercent * 100).toFixed(2)}%` : 'Loading...';
  const backgroundColor = gameData.predictionCorrect ? 'rgba(6, 64, 43, .7)' : 'rgba(77, 0, 0, .7)';
  return (
    <div style={styles.card}>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col xs={7} style={styles.timeColumn}>
          {gameData.timeRemaining ? gameData.timeRemaining : formatGameTime()}
        </Col>
        <Col xs={3} style={styles.winPercentColumn}>
          {winPercent}
        </Col>
        <Col xs={2} style={{ textAlign: 'right', padding: 0 }}>
          <Link to={`/matchup/${gameData.id}`}>
            <Button variant="outline-light" style={styles.linkButton}>More</Button>
          </Link>
        </Col>
      </Row>
      {awayTeam && homeTeam && final ?
        <>
          {awayTeam && (
            <TeamOddsRow
              teamIndex={gameData.awayTeamIndex}
              team={awayTeam}
              oppTeam={homeTeam}
              gameData={gameData}
              sportsbook={sportsbook}
              total="Over"
              past="true"
              market="h2h"
              score={gameData.awayScore}
              oppteamIndex={gameData.homeTeamIndex}
              betType={betType}
              bankroll={bankroll}
              valueBets={valueBets}
              todaysGames={todaysGames}
              backgroundColor={backgroundColor}
            />
          )}
          {homeTeam && (
            <TeamOddsRow
              teamIndex={gameData.homeTeamIndex}
              team={homeTeam}
              oppTeam={awayTeam}
              gameData={gameData}
              sportsbook={sportsbook}
              total="Under"
              past="true"
              market="h2h"
              score={gameData.homeScore}
              oppteamIndex={gameData.awayTeamIndex}
              betType={betType}
              bankroll={bankroll}
              valueBets={valueBets}
              todaysGames={todaysGames}
              backgroundColor={backgroundColor}
            />
          )}
        </> :
        homeTeam && awayTeam ?
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
          
        </>: <></>}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#303036',
    color: '#D4D2D5',
    fontSize: '.8rem',
    borderRadius: '.5em',
    marginTop: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    maxHeight: '8rem',
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  timeColumn: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  winPercentColumn: {
    fontSize: '.9rem',
  },
  teamColumn: {
    fontWeight: 'bold',
    paddingTop: '10px',
    textAlign: 'center',
  },
  linkButton: {
    padding: 0,
    marginRight: '5px',
    backgroundColor: '#4E4E50',
    borderColor: '#4E4E50',
    fontSize: '.8rem',
    paddingLeft: '7px',
    paddingRight: '7px',
  }
};

export default MatchupCard;
