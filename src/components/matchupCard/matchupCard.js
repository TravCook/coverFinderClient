import { useEffect, useState } from 'react';
import { Button, Col, Row, Collapse } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Filled star
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // Outlined s
import { Link } from 'react-router';
import { isSameDay } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setStarredGames } from '../../redux/user/actions/userActions';

const MatchupCard = ({ gameData, sportsbook, final }) => {
  const dispatch = useDispatch()
  const { teams } = useSelector((state) => state.teams)
  const { pastGames } = useSelector((state) => state.games)
  const { starredGames } = useSelector((state) => state.user)
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [dbLeague, setdbLeague] = useState()
  const [isExpanded, setIsExpanded] = useState(false);



  const filterGamesBeforeCommenceTime = (games, gameData) => {
    const gameCommenceTime = new Date(gameData.commence_time); // Convert gameData commence time to Date
    return games.filter((game) => game.homeTeamIndex != game.awayTeamIndex).filter((game) => new Date(game.commence_time) < gameCommenceTime); // Filter games that occur before gameData commence time
  };

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

  const winrates = []

  const overAllWinrate = (() => {
    const filteredGames = filterGamesBeforeCommenceTime(pastGames, gameData);
    const correctPredictions = filteredGames.filter((game) => game.predictionCorrect);
    if (!isNaN(correctPredictions.length / filteredGames.length)) {
      winrates.push(correctPredictions.length / filteredGames.length)
    }
  })();

  const sportWinRate = (() => {
    const filteredGames = filterGamesBeforeCommenceTime(pastGames, gameData);
    const sportFilteredGames = filteredGames.filter((game) => game.sport === gameData.sport);
    const correctPredictions = sportFilteredGames.filter((game) => game.predictionCorrect);
    if (!isNaN(correctPredictions.length / sportFilteredGames.length)) {
      winrates.push(correctPredictions.length / sportFilteredGames.length)
    }
  })();

  const homeTeamWinrate = (() => {
    const filteredGames = filterGamesBeforeCommenceTime(pastGames, gameData);
    const homeOrAwayFilteredGames = filteredGames.filter(
      (game) => game.home_team === gameData.home_team || game.away_team === gameData.home_team
    );
    const correctPredictions = homeOrAwayFilteredGames.filter((game) => game.predictionCorrect);
    if (!isNaN(correctPredictions.length / homeOrAwayFilteredGames.length)) {
      winrates.push(correctPredictions.length / homeOrAwayFilteredGames.length)
    }
  })();

  const awayTeamWinrate = (() => {
    const filteredGames = filterGamesBeforeCommenceTime(pastGames, gameData);
    const homeOrAwayFilteredGames = filteredGames.filter(
      (game) => game.home_team === gameData.away_team || game.away_team === gameData.away_team
    );

    const correctPredictions = homeOrAwayFilteredGames.filter((game) => game.predictionCorrect);
    if (!isNaN(correctPredictions.length / homeOrAwayFilteredGames.length)) {
      winrates.push(correctPredictions.length / homeOrAwayFilteredGames.length)
    }
  })();

  useEffect(() => {
    // Ensure the league is set correctly
    if (gameData?.sport_title) {
      if (gameData.sport_title === 'NCAAB') {
        setdbLeague('mens-college-basketball');
      } else if (gameData.sport_title === 'NFL') {
        setdbLeague('nfl')
      } else if (gameData.sport_title === 'NBA') {
        setdbLeague('nba')
      } else if (gameData.sport_title === 'NHL') {
        setdbLeague('nhl')
      } else if (gameData.sport_title === 'MLB') {
        setdbLeague('mlb')
      } else if (gameData.sport_title === 'NCAAF') {
        setdbLeague('college-football')
      } else if (gameData.sport_title === 'WNCAAB') {
        setdbLeague('womens-college-basketball')
      }

    }
  }, [gameData?.sport_title]); // Only run when gameData.league changes

  useEffect(() => {
    if (gameData?.home_team && gameData?.away_team && teams && dbLeague) {
      if (gameData?.sport && teams[gameData.sport]) {
        if (gameData.id === 'fe6606736a4fb10d975e371d8784f5b4') {
          console.log(teams[gameData.sport]?.find((team) => team.league === dbLeague && gameData?.away_team === team.espnDisplayName))
        }
        const homeTeam = teams[gameData.sport]?.find((team) => team.league === dbLeague && gameData?.home_team === team.espnDisplayName);
        const awayTeam = teams[gameData.sport]?.find((team) => team.league === dbLeague && gameData?.away_team === team.espnDisplayName);

        if (homeTeam && awayTeam) {
          setHomeTeam(homeTeam);
          setAwayTeam(awayTeam);
          // Continue processing with homeTeam and awayTeam
        } else {
          console.error('Home or Away team not found');
        }
      } else {
        console.error('Invalid sport or teams data is missing for the specified sport');
      }

      // Only update state if teams are found
    }
  }, [gameData, teams, dbLeague]);



  const formatGameTime = () => {
    const gameTime = new Date(gameData.commence_time);
    return isSameDay(gameData.commence_time, new Date())
      ? gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const winPercent = gameData?.winPercent === 0 ? `${(gameData?.winPercent * 100).toFixed(2)}%` : gameData?.winPercent ? `${(gameData?.winPercent * 100).toFixed(2)}%` : 'Loading';
  let backgroundColor
  if (final) {
    backgroundColor = gameData?.predictionCorrect ? 'rgba(6, 64, 43, .7)' : 'rgba(77, 0, 0, .7)';
  }

  return (
    <div style={styles.card}>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col style={styles.timeColumn}>
          {gameData.timeRemaining ? gameData.timeRemaining : formatGameTime()}
        </Col>
        <Col style={{ textAlign: 'right' }}>
          {!final ?
            <Button
              id={gameData.id}
              onClick={handleStarClick}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {starredGames.some((game) => game.id === gameData.id) ? (
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold', fontSize: '1.5rem' }} />
              ) : (
                <FontAwesomeIcon icon={farStar} style={{ color: 'gold', fontSize: '1.5rem' }} />
              )}
            </Button>
            : <span></span>}

        </Col>
        <Col xs={2} style={{ textAlign: 'right', padding: 0, margin: 0 }}>
          <Link to={`/matchup/${gameData.id}`}>
            <Button variant="outline-light" style={styles.linkButton}>More</Button>
          </Link>
        </Col>



      </Row>
      {homeTeam && awayTeam ?
        <>
          <TeamOddsRow
            teamIndex={gameData.awayTeamIndex}
            team={awayTeam}
            oppTeam={homeTeam}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.awayScore}
            oppteamIndex={gameData.homeTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
          />
          <TeamOddsRow
            teamIndex={gameData.homeTeamIndex}
            team={homeTeam}
            oppTeam={awayTeam}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.homeScore}
            oppteamIndex={gameData.awayTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
          />
        </>
        : <></>}

      <Collapse in={isExpanded}>
        <div>
          <Row>
            <Col style={styles.winPercentColumn}>
              <Row>
                <Col style={{ fontSize: '.8rem' }}>Winrate</Col>
              </Row>
              <Row>
                <Col style={{ fontSize: '.8rem' }}>{`${((winrates.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / winrates.length) * 100).toFixed(2).padEnd(4, '0')}%`}</Col>
              </Row>

            </Col>
            <Col style={styles.winPercentColumn}>
              <Row>
                <Col style={{ fontSize: '.8rem', padding: 0 }}>Confidence</Col>
              </Row>
              <Row>
                <Col style={{ fontSize: '.8rem' }}>{winPercent}</Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingLeft: 5, paddingRight: 5 }}>
            <Col xs={1} style={{ padding: 0 }}>
              <img style={{ width: '1.5rem' }} src={gameData.awayTeamlogo} />

            </Col>
            <Col>
              BBI: {gameData.awayTeamIndex.toFixed(2).padEnd(4, '0')}
            </Col>
            <Col style={{ textAlign: 'center' }}>
              <Row>
                {pastGames.filter((game) => game.home_team === gameData.away_team || game.away_team === gameData.away_team).map((game, idx) => {
                  if (idx < 5) {
                    if (game.home_team === gameData.away_team && game.winner === 'home') {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(0, 255, 0, .2)' }}>W</Col>
                      )
                    } else if (game.away_team === gameData.away_team && game.winner === 'away') {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(0, 255, 0, .2)' }}>W</Col>
                      )
                    } else {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(255, 0, 0, .2)' }}>L</Col>
                      )
                    }
                  }
                })}
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingLeft: 5, paddingRight: 5 }}>
            <Col xs={1} style={{ padding: 0 }}>
              <img style={{ width: '1.5rem' }} src={gameData.homeTeamlogo} />

            </Col>
            <Col>
              BBI: {gameData.homeTeamIndex.toFixed(2).padEnd(4, '0')}
            </Col>
            <Col style={{ textAlign: 'center' }}>
              <Row>
                {pastGames.filter((game) => game.home_team === gameData.home_team || game.away_team === gameData.home_team).map((game, idx) => {
                  if (idx < 5) {
                    if (game.home_team === gameData.home_team && game.winner === 'home') {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(0, 255, 0, .2)' }}>W</Col>
                      )
                    } else if (game.away_team === gameData.home_team && game.winner === 'away') {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(0, 255, 0, .2)' }}>W</Col>
                      )
                    } else {
                      return (
                        <Col style={{ padding: 0, borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', backgroundColor: 'rgba(255, 0, 0, .2)' }}>L</Col>
                      )
                    }
                  }
                })}
              </Row>
            </Col>
          </Row>
        </div>
      </Collapse>
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
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  timeColumn: {
    textAlign: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: '.84rem',
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
