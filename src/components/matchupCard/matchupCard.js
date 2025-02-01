import { useEffect, useState } from 'react';
import { Button, Col, Row, Collapse, Container } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Filled star
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // Outlined s
import { Link } from 'react-router';
import { isSameDay } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setStarredGames } from '../../redux/user/actions/userActions';
import { allStatLabelsShort } from '../../utils/constants'

const MatchupCard = ({ gameData, sportsbook, final }) => {
  const dispatch = useDispatch()
  const { teams } = useSelector((state) => state.teams)
  const { pastGames } = useSelector((state) => state.games)
  const { starredGames } = useSelector((state) => state.user)
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [dbLeague, setdbLeague] = useState()
  const [isExpanded, setIsExpanded] = useState(false);
  const [awayStatIndex, setAwayStatIndex] = useState(0)
  const [homeStatIndex, setHomeStatIndex] = useState(0)

  const handleHomeStatIncrease = () => {
    setHomeStatIndex(homeStatIndex + 1)
  }

  const handleHomeStatDecrease = () => {
    setHomeStatIndex(homeStatIndex - 1)
  }

  const handleAwayStatIncrease = () => {
    setAwayStatIndex(awayStatIndex + 1)
  }

  const handleAwayStatDecrease = () => {
    setAwayStatIndex(awayStatIndex - 1)
  }


  const highestStat = (teamStats, oppStats, team, homeAway) => {
    let advStats = []
    for (const stat in teamStats) {
      if (stat === 'seasonWinLoss') {
        let splitArr = teamStats[stat].split("-")
        let oppSplitArr = oppStats[stat].split("-")
        let oppWins = oppSplitArr[0]
        let wins = splitArr[0]
        if (oppStats[stat] !== 0 && wins > oppWins) {
          advStats.push({
            stat: allStatLabelsShort[stat],
            adv: wins / oppWins,
            value: teamStats[stat],
            oppValue: oppStats[stat]
          })
        }
      } else if (stat === 'homeWinLoss' || stat === 'awayWinLoss') {
        if (stat === 'homeWinLoss' && team === gameData.home_team) {
          let splitArr = teamStats[stat].split("-")
          let oppSplitArr = oppStats['awayWinLoss'].split("-")
          let oppWins = parseInt(oppSplitArr[0])
          let wins = parseInt(splitArr[0])
          if (oppStats[stat] !== 0 && wins > oppWins) {
            advStats.push({
              stat: allStatLabelsShort[stat],
              adv: wins / oppWins,
              value: teamStats[stat],
              oppValue: oppStats['awayWinLoss']
            })
          }
        } else if (stat === 'awayWinLoss' && team === gameData.away_team) {
          let splitArr = teamStats[stat].split("-")
          let oppSplitArr = oppStats['homeWinLoss'].split("-")
          let oppWins = parseInt(oppSplitArr[0])
          let wins = parseInt(splitArr[0])
          if (oppStats[stat] !== 0 && wins > oppWins) {
            advStats.push({
              stat: allStatLabelsShort[stat],
              adv: wins / oppWins,
              value: teamStats[stat],
              oppValue: oppStats['homeWinLoss']
            })
          }
        }

      } else if (oppStats[stat] !== 0 && teamStats[stat] > oppStats[stat]) {
        advStats.push({
          stat: allStatLabelsShort[stat],
          adv: teamStats[stat] / oppStats[stat],
          value: teamStats[stat],
          oppValue: oppStats[stat]
        })
      }
    }
    let sortedStatArr = advStats.sort((a, b) => b.adv - a.adv)
    if (sortedStatArr.length > 0) {
      return (
        <>
          {homeAway === 'home' ?
            <>
              <Row style={{ textAlign: 'center' }}>
                <Col xs={3} style={{ padding: 0 }}>
                  {<Button style={{ padding: 0, }} onClick={handleHomeStatDecrease} disabled={homeStatIndex === 0}>←</Button>}
                </Col>
                <Col xs={6} style={{ padding: 0 }}>{sortedStatArr[homeStatIndex].stat}</Col>
                <Col xs={3} style={{ padding: 0 }}>
                  {<Button style={{ padding: 0 }} onClick={handleHomeStatIncrease} disabled={homeStatIndex >= advStats.length - 1}>→</Button>}
                </Col>
              </Row>
              <Row>
                <Col xs={8} style={{ textAlign: 'center', padding: 0 }}>
                  Amount
                </Col>
                <Col style={{ textAlign: 'center', padding: 0 }}>
                  Adv Δ
                </Col>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <Col style={{ padding: 0 }}>
                  {typeof sortedStatArr[homeStatIndex].value == 'number' ? sortedStatArr[homeStatIndex].value > 100 ? sortedStatArr[homeStatIndex].value.toFixed(0) : sortedStatArr[homeStatIndex].value.toFixed(2) : sortedStatArr[homeStatIndex].value}
                </Col>
                <Col style={{ padding: 0 }}>
                  {typeof sortedStatArr[homeStatIndex].oppValue === 'number' ? sortedStatArr[homeStatIndex].oppValue > 100 ? sortedStatArr[homeStatIndex].oppValue.toFixed(0) : sortedStatArr[homeStatIndex].oppValue.toFixed(2) : sortedStatArr[homeStatIndex].oppValue}
                </Col>
                <Col style={{ padding: 0 }}>
                  {`${((sortedStatArr[homeStatIndex].adv - 1) * 100).toFixed(1)}%`}
                </Col>
              </Row>
            </>
            :
            <>
              <Row style={{ textAlign: 'center' }}>
                <Col xs={3} style={{ padding: 0 }}>
                  {<Button style={{ padding: 0 }} onClick={handleAwayStatDecrease} disabled={awayStatIndex === 0}>←</Button>}
                </Col>
                <Col xs={6} style={{ padding: 0 }}>{sortedStatArr[awayStatIndex].stat}</Col>
                <Col xs={3} style={{ padding: 0 }}>
                  {<Button style={{ padding: 0 }} onClick={handleAwayStatIncrease} disabled={awayStatIndex >= advStats.length - 1}>→</Button>}
                </Col>
              </Row>
              <Row>
                <Col xs={8} style={{ textAlign: 'center', padding: 0 }}>
                  Amount
                </Col>
                <Col style={{ textAlign: 'center', padding: 0 }}>
                  Adv Δ
                </Col>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <Col style={{ padding: 0 }}>
                  {typeof sortedStatArr[awayStatIndex].value == 'number' ? sortedStatArr[awayStatIndex].value > 100 ? sortedStatArr[awayStatIndex].value.toFixed(0) : sortedStatArr[awayStatIndex].value.toFixed(2) : sortedStatArr[awayStatIndex].value}
                </Col>
                <Col style={{ padding: 0 }}>
                  {typeof sortedStatArr[awayStatIndex].oppValue === 'number' ? sortedStatArr[awayStatIndex].oppValue > 100 ? sortedStatArr[awayStatIndex].oppValue.toFixed(0) : sortedStatArr[awayStatIndex].oppValue.toFixed(2) : sortedStatArr[awayStatIndex].oppValue}
                </Col>
                <Col style={{ padding: 0 }}>
                  {`${((sortedStatArr[awayStatIndex].adv - 1) * 100).toFixed(1)}%`}
                </Col>
              </Row>
            </>}

        </>
      )
    } else {
    }
  }

  const getColorForIndex = (index) => {
    let hue = (index / 45) * 120; // Scale from 0 to 120 degrees
    return `hsl(${hue}, 100%, 50%)`; // Full saturation and lightness at 50%
  };


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
        if (gameData.id === 'd99ae74013917039a4d71c59e5a11d25') {
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
      ? final ? `Final` : gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : final ? `${gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit' })} Final` : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
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
        {!final ?
          <Col xs={2} style={{ textAlign: 'right' }}>
            <Button
              id={gameData.id}
              onClick={handleStarClick}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {starredGames.some((game) => game.id === gameData.id) ? (
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
              ) : (
                <FontAwesomeIcon icon={farStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
              )}
            </Button>
          </Col>
          : <></>}





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
        <Container>
          <Row style={{ borderBottom: '2px solid white', padding: 5 }}>
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
          <Row style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
            <Col xs={6}>
              <Row style={{ alignItems: 'center', textAlign: 'center' }}>
                <Col xs={4} style={{ padding: 5, textAlign: 'left' }}>
                  <img style={{ width: '100%', maxWidth: '1.5rem' }} src={gameData.awayTeamlogo} />

                </Col>
                <Col xs={6} style={{ boxShadow: `inset 0 0 13px ${getColorForIndex(gameData.awayTeamIndex)}`, borderRadius: '.5rem' }}>
                  {gameData.awayTeamIndex.toFixed(2).padEnd(4, '0')}
                </Col>
              </Row>

            </Col>

            <Col xs={6}>
              {gameData.homeTeamStats != 'no stat data' && gameData.awayTeamStats != 'no stat data' ? highestStat(gameData.awayTeamStats, gameData.homeTeamStats, gameData.away_team, 'away') : <></>}
            </Col>
          </Row>
          <Row style={{ borderBottom: '2px solid white', padding: 5 }}>
            <Col style={{ padding: 0 }}>
              {`${gameData.awayTeamAbbr} Last 5`}
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
          <Row style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
            <Col xs={6}>
              <Row style={{ alignItems: 'center', textAlign: 'center' }}>
                <Col xs={4} style={{ padding: 5, textAlign: 'left' }}>
                  <img style={{ width: '100%', maxWidth: '1.5rem' }} src={gameData.homeTeamlogo} />

                </Col>
                <Col xs={6} style={{ boxShadow: `inset 0 0 13px ${getColorForIndex(gameData.homeTeamIndex)}`, borderRadius: '.5rem' }}>
                  {gameData.homeTeamIndex.toFixed(2).padEnd(4, '0')}
                </Col>
              </Row>

            </Col>
            <Col>
              {gameData.homeTeamStats != 'no stat data' && gameData.awayTeamStats != 'no stat data' ? highestStat(gameData.homeTeamStats, gameData.awayTeamStats, gameData.home_team, 'home') : <></>}
            </Col>

          </Row>
          <Row style={{ padding: 5 }}>
            <Col style={{ padding: 0 }}>
              {`${gameData.homeTeamAbbr} Last 5`}
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
          <Row>
            <Col style={{ padding: 0, }}>
              <Link to={`/matchup/${gameData.id}`}>
                <Button variant="outline-light" style={styles.linkButton}>See Full Matchup</Button>
              </Link>
            </Col>
          </Row>
        </Container>
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
    backgroundColor: 'rgba(198, 159, 66, .6)',
    borderColor: 'rgba(198, 159, 66, .6)',
    // border: '2px solid rgba(198 159 66, .8)',
    // background: 'transparent',
    fontSize: '.8rem',
    width: '100%',
    padding: 0
  }
};

export default MatchupCard;
