import { useRef, useState, useEffect } from 'react';
import { calculateProfitFromUSOdds, getDifferenceInMinutes, isSameDay, formatMinutesToHoursAndMinutes } from '../../utils/constants.js';
import MatchupCard from '../matchupCard/matchupCard.jsx';
import { useSelector } from 'react-redux';
import CurvedGauge from '../dataVisComponents/curvedGauge/curvedGauge.jsx';
import OddsDisplayBox from '../matchupCard/oddsDisplayBox/oddsDisplayBox.jsx';
import PastGamesDisplay from '../pastGames/pastGames.jsx';

const LiveView = ({ base }) => {
    const { games, pastGames } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const chartContainerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });
    const [value, setValue] = useState(0);
    const [todayWins, setTodayWins] = useState([]);
    const [todayLosses, setTodayLosses] = useState([]);
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day


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

        let tieFilter = games.filter((game) =>
            game.timeRemaining
            && (game.homeScore === game.awayScore))

        let pastGamesFilter = pastGames.filter((game) =>
            isSameDay(new Date(), new Date(game.commence_time))
            && (game.predictionCorrect))


        setTodayWins(pastGamesFilter);
        setTodayLosses(pastGames.filter((game) =>
            isSameDay(new Date(), new Date(game.commence_time))
            && (!game.predictionCorrect)))
        if (gamesFilter.length !== 0 || pastGamesFilter.length !== 0 || games.filter((game) => game.timeRemaining).length > 0) {
            setValue((gamesFilter.length + pastGamesFilter.length + (tieFilter.length * .5)) / (games.filter((game) => game.timeRemaining).length + pastGames.filter((game) => isSameDay(new Date(), new Date(game.commence_time))).length))
        } else {
            setValue(0);
        }
    }, [games, pastGames]);


    return (
        <div style={{ width: '99.1vw' }}>
            <div >
                <div >
                    <div className='flex flex-row justify-around'>
                        <div className=' bg-secondary my-4 rounded px-4' style={{ width: '15%' }} >
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <h4 className="text-white mb-2">Starting Soon</h4>

                                            {games
                                                .filter((game) => {
                                                    const diff = getDifferenceInMinutes(new Date(), new Date(game.commence_time));
                                                    return !game.timeRemaining && diff < 180 && diff > 0;
                                                })
                                                .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time))
                                                .map((game, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-row items-center"
                                                    >
                                                        <div className='flex flex-row items-center ' style={{ width: '50%' }}>
                                                            {/* Away Team */}
                                                            <div className="flex flex-row items-center justify-between" style={{ width: '45%' }}>
                                                                <div>
                                                                    <span>{game.awayTeamDetails.abbreviation}</span>
                                                                </div>
                                                                <div>
                                                                    <img
                                                                        src={game.awayTeamDetails.lightLogo}
                                                                        className="max-w-5"
                                                                        alt="Away Logo"
                                                                    />
                                                                </div>


                                                            </div>

                                                            {/* @ Symbol */}
                                                            <div className="text-center text-white">@</div>

                                                            {/* Home Team */}
                                                            <div className="flex flex-row items-center justify-between" style={{ width: '45%' }}>
                                                                <img
                                                                    src={game.homeTeamDetails.lightLogo}
                                                                    className="max-w-5"
                                                                    alt="Home Logo"
                                                                />
                                                                <span>{game.homeTeamDetails.abbreviation}</span>

                                                            </div>
                                                        </div>


                                                        {/* Dotted Divider */}
                                                        <div className="overflow-hidden whitespace-nowrap"  style={{ width: '30%' }}>
                                                            <span className="inline-block w-full text-center tracking-widest text-white">
                                                                .................................................................................................
                                                            </span>
                                                        </div>

                                                        {/* Time */}
                                                        <div className="text-right text-sm whitespace-nowrap text-text text-center" style={{ width: '20%' }}>
                                                            {formatMinutesToHoursAndMinutes(
                                                                getDifferenceInMinutes(new Date(), new Date(game.commence_time)).toFixed(0)
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className='bg-primary rounded my-4' >
                                        <div style={{ color: '#fff', textAlign: 'center' }}>
                                            <h3>{`Live Accuracy ${todayWins.length > 0 || todayLosses.length > 0 || games.filter((game) => game.timeRemaining).length > 0 ? `${(value * 100).toFixed(1)}%` : `N/A`}`}</h3>
                                        </div>
                                        <div>
                                            <div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <h5>Today's Wins: {todayWins.length}</h5>
                                                </div>
                                                <div className='flex flex-row items-center justify-evenly'>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div>
                                                            <div style={{ padding: 0, textAlign: 'center' }}>Best Win</div>
                                                        </div>
                                                        {todayWins.length > 0 ? todayWins.sort((a, b) => {
                                                            const aBook = a.bookmakers.find(b => b.key === sportsbook);
                                                            const aMarket = aBook?.markets.find(m => m.key === 'h2h');
                                                            const aTeam = a.predictedWinner === 'home' ? a.homeTeamDetails.espnDisplayName : a.awayTeamDetails.espnDisplayName;
                                                            const aPrice = aMarket?.outcomes.find(o => o.name === aTeam)?.price ?? 0;

                                                            const bBook = b.bookmakers.find(b => b.key === sportsbook);
                                                            const bMarket = bBook?.markets.find(m => m.key === 'h2h');
                                                            const bTeam = b.predictedWinner === 'home' ? b.homeTeamDetails.espnDisplayName : b.awayTeamDetails.espnDisplayName;
                                                            const bPrice = bMarket?.outcomes.find(o => o.name === bTeam)?.price ?? 0;
                                                            return bPrice - aPrice; // descending
                                                        }).map((game, idx) => {
                                                            if (idx < 1) {
                                                                return (
                                                                    <div className='flex flex-row items-center'>
                                                                        <div>
                                                                            <img src={game.predictedWinner === 'home' ? game.homeTeamDetails.darkLogo : game.awayTeamDetails.darkLogo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' />
                                                                        </div>
                                                                        <div>
                                                                            <OddsDisplayBox key={game.id} homeAway={game.predictedWinner} gameData={game} market='h2h' total={game.total} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }

                                                        }) : 'N/A'}
                                                    </div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div>
                                                            <div style={{ padding: 0, textAlign: 'center' }}>
                                                                Profit
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ padding: 0, textAlign: 'center' }}>
                                                                {todayWins.length > 0 ? (todayWins.reduce((total, game) => {
                                                                    let bookmaker = game.bookmakers.find((bookmaker) => bookmaker.key === sportsbook);
                                                                    let market = bookmaker?.markets.find((market) => market.key === 'h2h');
                                                                    let outcome = market?.outcomes.find((outcome) => outcome.name === (game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName));
                                                                    return (total + calculateProfitFromUSOdds(outcome.price, 1));
                                                                }, 0) - todayLosses.length).toFixed(2) : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div>
                                                            <div style={{ padding: 0, textAlign: 'center' }}>Worst Loss</div>
                                                        </div>
                                                        {todayLosses.length > 0 ? todayLosses.sort((a, b) => {
                                                            const aBook = a.bookmakers.find(b => b.key === sportsbook);
                                                            const aMarket = aBook?.markets.find(m => m.key === 'h2h');
                                                            const aTeam = a.predictedWinner === 'home' ? a.homeTeamDetails.teamName : a.awayTeamDetails.teamName;
                                                            const aPrice = aMarket?.outcomes.find(o => o.name === aTeam)?.price ?? 0;

                                                            const bBook = b.bookmakers.find(b => b.key === sportsbook);
                                                            const bMarket = bBook?.markets.find(m => m.key === 'h2h');
                                                            const bTeam = b.predictedWinner === 'home' ? b.homeTeamDetails.teamName : b.awayTeamDetails.teamName;
                                                            const bPrice = bMarket?.outcomes.find(o => o.name === bTeam)?.price ?? 0;
                                                            return aPrice - bPrice; // descending
                                                        }).map((game, idx) => {
                                                            if (idx < 1) {
                                                                return (
                                                                    <div className='flex flex-row items-center'>
                                                                        <div ><img src={game.predictedWinner === 'home' ? game.homeTeamDetails.darkLogo : game.awayTeamDetails.darkLogo} style={{ width: '1.5rem', maxWidth: '30px' }} alt='Team Logo' /></div>
                                                                        <div > <OddsDisplayBox key={game.id} homeAway={game.predictedWinner} gameData={game} market='h2h' total={game.total} /></div>
                                                                    </div>
                                                                )
                                                            }

                                                        }) : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className=' bg-secondary my-4 rounded' style={{ width: '75%' }}>
                            <div >
                                <div >
                                    <div className='flex flex-row flex-wrap justify-evenly p-4'>
                                        {games.filter((game) => game.timeRemaining).sort((a, b) => {
                                            return new Date(a.commence_time) - new Date(b.commence_time)
                                        }).map((game) => {
                                            return (
                                                <div>
                                                    <MatchupCard
                                                        key={game.id}
                                                        gameData={game}
                                                    />
                                                </div>

                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div >
                <PastGamesDisplay displayGames={pastGames.filter((game) => new Date(game.commence_time) > today)} />
            </div>

        </div>
    );
};

export default LiveView;