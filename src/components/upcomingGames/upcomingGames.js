import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import MatchupCard from '../matchupCard/matchupCard.js';
import { useState, useRef } from 'react';
import { isSameDay, valueBetConditionCheck } from '../../utils/constants.js';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

const UpcomingGames = () => {
  document.title = 'Upcoming Games'
  const { games, sports, pastGames } = useSelector((state) => state.games);
  const { starredGames, sportsbook } = useSelector((state) => state.user);
  const divRefs = useRef([]);

  // Function to handle scrolling to a specific div
  const scrollToDiv = (index) => {
    if (divRefs.current[index]) {

      // Get the target div position
      const targetDiv = divRefs.current[index];
      const targetPosition = targetDiv.getBoundingClientRect().top + window.scrollY - (starredGames.length > 0 ? 325 : 125);

      // Scroll to the calculated position
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth', // Adds smooth scrolling
      });
    }
  };
  const filterAndMapGames = (sortType, league) => {
    if (league) {
      return games
        ?.filter((game) => game.sport_title === league.toUpperCase()) // Filter by sport league
        // .filter(condition) // Apply condition (e.g., today's games)
        .filter((game) => {
          if (game?.bookmakers?.find(b => b.key === sportsbook)) {
            return true
          }
        }).sort((a, b) => {
          const dateA = new Date(a.commence_time).getTime();
          const dateB = new Date(b.commence_time).getTime();
          if (dateA === dateB) {
            return b.winPercent - a.winPercent
          }
          return dateA - dateB
        }) // Sort by commence time
        .map((game, idx) => {
          if ((Math.ceil(games.filter((game) => game.sport_title === league.toUpperCase()).length / 6) * 6) < 15) {
            if (idx < (Math.ceil(games.filter((game) => game.sport_title === league.toUpperCase()).length / 6) * 6)) {
              return (
                <Col key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
                  <MatchupCard
                    todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
                    gameData={game}
                  />
                </Col>
              )
            }
          } else {
            if (idx < 15) {
              return (
                <Col key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
                  <MatchupCard
                    todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
                    gameData={game}
                  />
                </Col>
              )
            }
          }

        });
    } else if (sortType === 'bestValue') {
      return games.filter((game) => {
        if (game?.bookmakers?.find(b => b.key === sportsbook)) {
          return true
        }
      }).filter((game) => {
        return valueBetConditionCheck(sports, game, sportsbook, pastGames)
      }).filter((game) => isSameDay(game.commence_time, new Date()))
        .sort((a, b) => {
          let outcomeA
          let outcomeB
          const bookmakerA = a.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
          if (bookmakerA) {
            const marketData = bookmakerA?.markets?.find(m => m.key === 'h2h');

            outcomeA = marketData?.outcomes?.find(o => {
              return o.name === (a.predictedWinner === 'home' ? a.home_team : a.away_team)
            });


          }
          const bookmakerB = b.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
          if (bookmakerB) {
            const marketData = bookmakerB?.markets?.find(m => m.key === 'h2h');

            outcomeB = marketData?.outcomes?.find(o => {
              return o.name === (b.predictedWinner === 'home' ? b.home_team : b.away_team)
            });


          }


          return outcomeB.price - outcomeA.price
        }) // Sort by commence time
        .map((game, idx) => {
          if (idx < 6) {
            return (
              <Col key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
                <MatchupCard
                  gameData={game}
                />
              </Col>
            )
          }
        });
    } else if (sortType === 'liveNow') {
      return games.filter((game) => game.timeRemaining).sort((a, b) => {
        return a.commence_time - b.commence_time
      }).map((game) => {
        return (
          <Col key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
            <MatchupCard
              todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
              gameData={game}
            />
          </Col>
        )
      })
    }

  };

  const renderStarredGames = () => {
    if (starredGames) {
      return (
        <Row>
          <Row>
            <Col xs={12}>
            </Col>
          </Row>
          <Container fluid>
            <Row style={{ overflowX: 'scroll', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
              {starredGames.sort((a, b) => {
                // Step 1: Sort by date (commence_time)
                const dateA = new Date(a.commence_time);
                const dateB = new Date(b.commence_time);

                if (dateA !== dateB) {
                  return dateA - dateB; // Sort by date first (ascending)
                }

                // Step 2: Sort by index delta if the dates are the same
                const indexDeltaA = a.predictedWinner === 'home' ? a.homeTeamIndex - a.awayTeamIndex : a.awayTeamIndex - a.homeTeamIndex;
                const indexDeltaB = b.predictedWinner === 'home' ? b.homeTeamIndex - b.awayTeamIndex : b.awayTeamIndex - b.homeTeamIndex;

                if (indexDeltaA !== indexDeltaB) {
                  return indexDeltaB - indexDeltaA; // Sort by index delta if the dates are the same
                }

                // Step 3: If both date and index delta are equal, sort by predictionStrength
                return a.predictionStrength - b.predictionStrength;
              }).map((game) => (
                <Col key={`${game.id}`} style={{ paddingLeft: 5, paddingRight: 5 }}>
                  <MatchupCard
                    todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))}
                    gameData={game}
                    starred={true}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </Row>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'relative', top: 60 }}>
      {starredGames.length > 0 &&
        <Row className='sticky-top' style={{ margin: '0 0', top: 58 }}>
          <Col style={{ margin: '0 0', padding: 0 }}>
            <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757' }}>
              <Card.Body>
                {renderStarredGames()} {/* Starred games section */}
              </Card.Body>
            </Card>
          </Col>

        </Row>
      }
      <Row className='sticky-top' style={{ textAlign: 'center', top: (starredGames.length > 0 ? 227 : 58), backgroundColor: '#2A2A2A', borderColor: '#575757', width: '100%', margin: '0 auto', padding: '.5em 0' }}>
        {sports.filter((sport) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1 to make it 1-12
          // Assuming the sport object is already defined
          if (sport.multiYear) {
            // Multi-year sports (e.g., NFL, NBA, NHL, etc.)
            if ((currentMonth >= sport.startMonth && currentMonth <= 12) || (currentMonth >= 1 && currentMonth <= sport.endMonth)) {
              return true
            } else {
              return false
            }
          } else {
            // Single-year sports (e.g., MLB)
            if (currentMonth >= sport.startMonth && currentMonth <= sport.endMonth) {
              return true
            } else {
              return false
            }
          }
        }).map((sport) => {
          let sportNameArr = sport.name.split('_')
          let leagueName = sportNameArr[1]
          // Filter games that match today's date and the current sport league
          const todayGames = games?.filter((game) => {
            if (game?.bookmakers?.find(b => b.key === sportsbook)) {
              return true
            }
          }).filter((game) =>
            // isSameDay(game.commence_time, new Date()) &&
            game.sport_title.toLowerCase() === leagueName
          );

          // Only render the section if there are games for this sport
          if (todayGames.length === 0) return null;
          return (
            <Col xs={1} lg={1} style={{ padding: 0 }}>
              <Button
                style={{ cursor: 'pointer', fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212', padding: 3, width: '90%' }}
                onClick={() => scrollToDiv(sport.league)}
              >
                {
                  leagueName.toUpperCase()
                }
              </Button>
            </Col>
          )
        })}
      </Row>
      <Row style={{ width: '100%', margin: 'auto', backgroundColor: '#121212', display: 'flex', justifyContent: 'space-evenly' }}>
        <Col>
          <Row>
            {games.filter((game) => game.timeRemaining).length > 0 &&
              <Col xs={12}>
                <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757', margin: '.25em 0' }}>
                  <Card.Body>
                    <Row ref={(el) => (divRefs.current['liveNow'] = el)} style={{ display: 'flex', justifyContent: 'space-evenly' }} key={'Live Now'}>
                      <Row>
                        <span style={{ color: 'whitesmoke', textAlign: 'center', fontSize: '1.5rem' }}>Live Now</span>
                      </Row>
                      {filterAndMapGames('liveNow')}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>}
            {games.filter((game) => {
              return valueBetConditionCheck(sports, game, sportsbook, pastGames)
            }).filter((game) => isSameDay(game.commence_time, new Date())).length > 0 &&
              <Col xs={12}>
                <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757', margin: '1em 0' }}>
                  <Card.Body>
                    <Row ref={(el) => (divRefs.current['bestValue'] = el)} className="mb-3 pb-3" style={{ display: 'flex', justifyContent: 'space-evenly' }} key={'WIN CHANCE'}>
                      <Row>
                        <span style={{ color: 'whitesmoke' }}>BETTER BETS</span>
                      </Row>
                      {filterAndMapGames('bestValue')}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            }

            {sports?.filter((sport) => {
              const currentDate = new Date();
              const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1 to make it 1-12
              // Assuming the sport object is already defined
              if (sport.multiYear) {
                // Multi-year sports (e.g., NFL, NBA, NHL, etc.)
                if ((currentMonth >= sport.startMonth && currentMonth <= 12) || (currentMonth >= 1 && currentMonth <= sport.endMonth)) {
                  return true
                } else {
                  return false
                }
              } else {
                // Single-year sports (e.g., MLB)
                if (currentMonth >= sport.startMonth && currentMonth <= sport.endMonth) {
                  return true
                } else {
                  return false
                }
              }
            }).map((sport) => {
              let sportNameArr = sport.name.split('_')
              let leagueName = sportNameArr[1]
              // Filter games that match today's date and the current sport league
              const todayGames = games?.filter((game) => {
                if (game?.bookmakers?.find(b => b.key === sportsbook)) {
                  return true
                }
              }).filter((game) =>
                // isSameDay(game.commence_time, new Date()) &&
                game.sport_title.toLowerCase() === leagueName
              );

              // Only render the section if there are games for this sport
              if (todayGames.length === 0) return null;

              return (
                <Col xs={12}>
                  <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757', margin: '1em 0' }}>
                    <Card.Body>
                      <Row ref={(el) => (divRefs.current[sport.league] = el)} className="mb-3 pb-3" style={{ display: 'flex', justifyContent: 'space-evenly' }} key={sport.league}>
                        <Row>
                          <Col xs={6}>
                            <h4 style={{ color: 'whitesmoke' }}>{leagueName.toUpperCase()} Games</h4>
                          </Col>
                          <Col xs={6} style={{ textAlign: 'right' }}>
                            <Link to={`/sport/${leagueName}`}>
                              <Button id={sport.name} variant="outline-light" style={{ fontSize: '.8rem', backgroundColor: 'rgb(198 159 66)', borderColor: 'rgb(198 159 66)', color: '#121212' }}>
                                More
                              </Button>
                            </Link>
                          </Col>
                        </Row>
                        <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                          {filterAndMapGames(
                            (game) => isSameDay(game.commence_time, new Date()),
                            leagueName
                          )}
                        </Row>

                      </Row>
                    </Card.Body>
                  </Card>
                </Col>


              );
            })}
          </Row>

        </Col>
      </Row >
    </div >
  );
};

export default UpcomingGames;
