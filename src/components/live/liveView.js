import { useRef, useState, useEffect } from 'react';
import { Col, Row, Container, Card } from 'react-bootstrap';
import { calculateProfitFromUSOdds, getDifferenceInMinutes, isSameDay, formatMinutesToHoursAndMinutes } from '../../utils/constants';
import MatchupCard from '../matchupCard/matchupCard';
import { useSelector } from 'react-redux';
import CurvedGauge from '../curvedGauge/curvedGauge';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';

const LiveView = ({ base }) => {
    const { games, pastGames } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const chartContainerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });
    const [value, setValue] = useState(0);
    const [todayWins, setTodayWins] = useState([]);
    const [todayLosses, setTodayLosses] = useState([]);

    useEffect(() => {
        if (chartContainerRef.current) {
            const { width, height } = chartContainerRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, [chartContainerRef.current]);
    useEffect(() => {
        let gamesFilter = games.filter((game) =>
            game.timeRemaining
            && (game.predictedWinner === 'home'
                ? game.homeScore > game.awayScore
                : game.awayScore > game.homeScore))


        let pastGamesFilter = pastGames.filter((game) =>
            isSameDay(new Date(), new Date(game.commence_time))
            && (game.predictionCorrect))


        setTodayWins(pastGamesFilter);
        setTodayLosses(pastGames.filter((game) =>
            isSameDay(new Date(), new Date(game.commence_time))
            && (!game.predictionCorrect)))
        if (gamesFilter.length !== 0 && pastGamesFilter.length !== 0 || games.filter((game) => game.timeRemaining).length > 0) {
            setValue((gamesFilter.length + pastGamesFilter.length) / (games.filter((game) => game.timeRemaining).length + pastGames.filter((game) => isSameDay(new Date(), new Date(game.commence_time))).length))
        } else {
            setValue(0);
        }
    }, [games, pastGames]);
    return (
        <Container fluid>
            <Row>
                <Col xl={3}>
                    <Card style={{ backgroundColor: '#545454', borderColor: '#575757', overflowY: 'scroll', maxHeight: '35vh', scrollbarWidth: 'thin' }}>
                        <Card.Body>
                            <h4 style={{ color: '#fff' }}>Starting Soon</h4>
                            {games.filter((game) => {
                                return !game.timeRemaining && getDifferenceInMinutes(new Date(), new Date(game.commence_time)) < 180 && getDifferenceInMinutes(new Date(), new Date(game.commence_time)) > 0;
                            }).sort((a, b) => {
                                return new Date(a.commence_time) - new Date(b.commence_time)
                             }).map((game, idx) => {
                                return (
                                    <Row style={{ color: '#ffffff', textAlign: 'right' }}>
                                        <Col xs={2} style={{ padding: 0, letterSpacing: '.1rem', fontSize: '.85rem' }}>
                                            {game.predictedWinner === 'away' && <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${((game.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)` }}>▲</sup>}
                                            {`${game.awayTeamDetails.abbreviation}`}
                                            {<img src={game.awayTeamDetails.logo} style={{ width: '1.2rem', maxWidth: '30px' }} alt='Team Logo' />}
                                        </Col>
                                        <Col xs={1} style={{ padding: 0, textAlign: 'center' }}>@</Col>
                                        <Col xs={2} style={{ padding: 0, textAlign: 'left', letterSpacing: '.1rem', fontSize: '.85rem' }}>
                                            {<img src={game.homeTeamDetails.logo} style={{ width: '1.2rem', maxWidth: '30px' }} alt='Team Logo' />}
                                            {`${game.homeTeamDetails.abbreviation}`}
                                            {game.predictedWinner === 'home' && <sup style={{ marginLeft: '.2rem', fontSize: '.6rem', color: `hsl(${((game.homeTeamScaledIndex) / 45) * 120}, 100%, 50%)` }}>▲</sup>}

                                        </Col>
                                        {/* Dynamic dots filler */}
                                        <Col className="px-1 text-nowrap" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '100%',
                                                textAlign: 'center',
                                                letterSpacing: '.25rem'
                                            }}>
                                                .................................................................................................
                                            </span>
                                        </Col>
                                        <Col xs={'auto'} style={{ padding: 0, marginLeft: 'auto' }}>{formatMinutesToHoursAndMinutes(getDifferenceInMinutes(new Date(), new Date(game.commence_time)).toFixed(0))}</Col>
                                    </Row>
                                )
                            })}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757' }}>
                        <Card.Body>
                            <Row>
                                {games.filter((game) => game.timeRemaining).sort((a, b) => {
                                    return new Date(a.commence_time) - new Date(b.commence_time)
                                }).map((game) => {
                                    return (
                                        <Col style={{ padding: 0, margin: '.5em 0' }}>
                                            <MatchupCard
                                                gameData={game}
                                            />
                                        </Col>

                                    )
                                })}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card style={{ backgroundColor: '#2a2a2a', borderColor: '#575757' }} >
                        <Row>
                            <Col>
                                <Card.Header style={{ color: '#fff', textAlign: 'center' }}>
                                    <h3>{`Live Prediction Accuracy ${todayWins.length > 0 || todayLosses.length > 0 || games.filter((game) => game.timeRemaining).length > 0 ? `${(value * 100).toFixed(1)}%` : `N/A`}`}</h3>
                                </Card.Header>
                            </Col>
                        </Row>
                        <Row>
                            <Card.Body >
                                <div style={{ width: '100%', height: '100%' }} ref={chartContainerRef}>
                                    <CurvedGauge value={value} dimensions={dimensions} />
                                </div>
                            </Card.Body>
                        </Row>
                        <Row>

                            <Card.Footer style={{ color: '#fff', textAlign: 'center' }}>
                                <Row>
                                    <h5>Today's Wins: {todayWins.length}</h5>
                                </Row>
                                <Row>
                                    <Col>
                                        { }
                                        Biggest Win: {todayWins.length > 0 ? todayWins.sort((a, b) => {
                                            const aBook = a.bookmakers.find(b => b.key === sportsbook);
                                            const aMarket = aBook?.markets.find(m => m.key === 'h2h');
                                            const aTeam = a.predictedWinner === 'home' ? a.home_team : a.away_team;
                                            const aPrice = aMarket?.outcomes.find(o => o.name === aTeam)?.price ?? 0;

                                            const bBook = b.bookmakers.find(b => b.key === sportsbook);
                                            const bMarket = bBook?.markets.find(m => m.key === 'h2h');
                                            const bTeam = b.predictedWinner === 'home' ? b.home_team : b.away_team;
                                            const bPrice = bMarket?.outcomes.find(o => o.name === bTeam)?.price ?? 0;
                                            return bPrice - aPrice; // descending
                                        }).map((game, idx) => {
                                            if (idx < 1) {
                                                return (
                                                    <>
                                                        <img src={game.predictedWinner === 'home' ? game.homeTeamlogo : game.awayTeamlogo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' />   <OddsDisplayBox key={game.id} homeAway={game.predictedWinner} gameData={game} market='h2h' total={game.total} />
                                                    </>
                                                )
                                            }

                                        }) : 'N/A'}
                                    </Col>
                                    <Col>
                                        Profit: {todayWins.length > 0 ? (todayWins.reduce((total, game) => {
                                            let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook);
                                            let market = bookmaker?.markets.find((market) => market.key === 'h2h');
                                            let outcome = market?.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team));
                                            return (total + calculateProfitFromUSOdds(outcome.price, 1));
                                        }, 0) - todayLosses.length).toFixed(2) : 'N/A'}
                                    </Col>
                                    <Col>
                                        Worst Loss: {todayLosses.length > 0 ? todayLosses.sort((a, b) => {
                                            const aBook = a.bookmakers.find(b => b.key === sportsbook);
                                            const aMarket = aBook?.markets.find(m => m.key === 'h2h');
                                            const aTeam = a.predictedWinner === 'home' ? a.home_team : a.away_team;
                                            const aPrice = aMarket?.outcomes.find(o => o.name === aTeam)?.price ?? 0;

                                            const bBook = b.bookmakers.find(b => b.key === sportsbook);
                                            const bMarket = bBook?.markets.find(m => m.key === 'h2h');
                                            const bTeam = b.predictedWinner === 'home' ? b.home_team : b.away_team;
                                            const bPrice = bMarket?.outcomes.find(o => o.name === bTeam)?.price ?? 0;
                                            return aPrice - bPrice; // descending
                                        }).map((game, idx) => {
                                            if (idx < 1) {
                                                return (
                                                    <>
                                                        <img src={game.predictedWinner === 'home' ? game.homeTeamlogo : game.awayTeamlogo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' />   <OddsDisplayBox key={game.id} homeAway={game.predictedWinner} gameData={game} market='h2h' total={game.total} />
                                                    </>
                                                )
                                            }

                                        }) : 'N/A'}
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Row>

                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default LiveView;