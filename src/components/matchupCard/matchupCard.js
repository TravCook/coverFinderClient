import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import moment from 'moment';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const MatchupCard = ({ gameData, bestBets, setBestBets, bankroll, sportsbook, betType, valueBets, todaysGames, final }) => {
  const {teams} = useSelector((state)=>state.teams)
  const {pastGames} = useSelector((state)=>state.games)
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [dbLeague, setdbLeague] = useState()

  let overAllWinrate = pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game)=>game.predictionCorrect).length/pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).length
  let sportWinRate = pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.sport === gameData.sport).filter((game)=>game.predictionCorrect).length/pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.sport === gameData.sport).length
  let homeTeamWinrate = pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.home_team === gameData.home_team ||  game.away_team === gameData.home_team ).filter((game)=>game.predictionCorrect).length/pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.home_team === gameData.home_team ||  game.away_team === gameData.home_team ).length
  let awayTeamWinrate = pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.home_team === gameData.away_team ||  game.away_team === gameData.away_team ).filter((game)=>game.predictionCorrect).length/pastGames.filter((game)=> moment(game.commence_time).isBefore(moment(gameData.commence_time))).filter((game) => game.home_team === gameData.away_team ||  game.away_team === gameData.away_team ).length
  useEffect(() => {
    // Ensure the league is set correctly
    if (gameData?.sport_title) {
      if(gameData.sport_title === 'NCAAB'){
        setdbLeague('mens-college-basketball');
      }else if(gameData.sport_title === 'NFL'){
        setdbLeague('nfl')
      }else if(gameData.sport_title === 'NBA'){
        setdbLeague('nba')
      }else if(gameData.sport_title === 'NHL'){
        setdbLeague('nhl')
      }else if(gameData.sport_title === 'MLB'){
        setdbLeague('mlb')
      }else if(gameData.sport_title === 'NCAAF'){
        setdbLeague('college-football')
      }
      
    }
  }, [gameData?.league]); // Only run when gameData.league changes
  
  useEffect(() => {
    if (gameData?.home_team && gameData?.away_team && teams && dbLeague) {
      const homeTeam = teams[gameData?.sport].find((team) => team.league === dbLeague && gameData?.home_team === team.espnDisplayName);
      const awayTeam = teams[gameData?.sport].find((team) => team.league === dbLeague && gameData?.away_team === team.espnDisplayName);
      
      // Only update state if teams are found
      if (homeTeam) {
        setHomeTeam(homeTeam);
      } else {
        console.warn(`Home team not found: ${gameData.home_team}`);
      }
  
      if (awayTeam) {
        setAwayTeam(awayTeam);
      } else {
        console.warn(`Away team not found: ${gameData.away_team}`);
      }
    }
  }, [gameData, teams, dbLeague]);
  


  const formatGameTime = () => {
    const gameTime = new Date(gameData.commence_time);
    return moment(gameData.commence_time).isSame(moment(), 'day')
      ? gameTime.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true})
      : gameTime.toLocaleString('en-GB', {month: 'short', day: '2-digit',hour: '2-digit', minute: '2-digit', hour12: true});
  };

  const winPercent = gameData?.winPercent === 0 ? `${(gameData?.winPercent * 100).toFixed(2)}%` : gameData?.winPercent ? `${(gameData?.winPercent * 100).toFixed(2)}%` : 'Loading...';
  const backgroundColor = gameData?.predictionCorrect ? 'rgba(6, 64, 43, .7)' : 'rgba(77, 0, 0, .7)';
  return (
    <div style={styles.card}>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col xs={5} style={styles.timeColumn}>
          {gameData.timeRemaining ? gameData.timeRemaining : formatGameTime()}
        </Col>
        <Col xs={2} style={styles.winPercentColumn}>
        <Row>
        <Col>Winrate</Col>
        </Row>
        <Row>
          <Col>{`${(((overAllWinrate + sportWinRate + homeTeamWinrate + awayTeamWinrate)/4) * 100).toFixed(2).padEnd(4, '0')}%`}</Col>
        </Row>

        </Col>
        <Col xs={2} style={styles.winPercentColumn}>
        <Row>
        <Col style={{ padding: 0}}>Confidence</Col>
        </Row>
        <Row>
          <Col>{winPercent}</Col>
        </Row>
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
            score={gameData?.awayScore}
            market="h2h"
            bestBets={bestBets}
            setBestBets={setBestBets}
            bankroll={bankroll}
            winPercent={gameData?.winPercent}
            teamIndex={gameData?.awayTeamIndex}
            oppteamIndex={gameData?.homeTeamIndex}
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
            score={gameData?.homeScore}
            market="h2h"
            bestBets={bestBets}
            setBestBets={setBestBets}
            bankroll={bankroll}
            winPercent={gameData?.winPercent}
            teamIndex={gameData?.homeTeamIndex}
            oppteamIndex={gameData?.awayTeamIndex}
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
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    paddingLeft: 5,
    paddingRight: 5
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
