import { useEffect, useState } from 'react';
import MatchupCard from '../../../matchupCard/matchupCard.jsx';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { isSameDay } from '../../../../utils/constants.js';

const UpcomingGamesBySport = () => {
    const { games, sports } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const [todayGames, setTodayGames] = useState([]);

    useEffect(() => {
        // Filter games that match today's date and the current sport league
        const tempTodayGames = games?.filter((game) => {

            if (game?.bookmakers?.find(b => b.key === sportsbook) && !game.complete) {
                return true
            }
            return null
        })
        // .filter((game) => {

        //     return isSameDay(game.commence_time, new Date())
        // });
        setTodayGames(tempTodayGames);
    }, [games, sports, sportsbook]);
    return (
        <div style={{ width: '97%' }}>
            {sports?.filter((sport) => {
                let sportGames = todayGames.filter((game) => game.sport_key === sport.name)
                return sportGames.length > 0
            }).sort((a, b) => a.startMonth - b.startMonth).map((sport) => {
                let sportNameArr = sport.name.split('_')
                let leagueName = sportNameArr[1]

                return (
                    <div className='bg-secondary flex flex-col my-2 rounded'>
                        <div className='flex justify-between items-center p-2'>
                            <h4 style={{ color: 'whitesmoke', textAlign: 'center' }}>{leagueName.toUpperCase()} Games</h4>
                            <Link to={`/sport/${sport.name}`}>
                                <button id={sport.name} className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton">
                                    More
                                </button>
                            </Link>

                        </div>

                        <div className='flex flex-wrap flex-row justify-around'>
                            {todayGames.filter((game) => game.sport_key === sport.name)
                                .sort((a, b) => {
                                    const dateA = new Date(a.commence_time).getTime();
                                    const dateB = new Date(b.commence_time).getTime();
                                    if (dateA === dateB) {
                                        return b.winPercent - a.winPercent;
                                    }
                                    return dateA - dateB;
                                }).slice(0, 10)
                                .map((game, idx) => {
                                    return (
                                        <div className='mx-2'>
                                            <MatchupCard
                                                key={game.id}
                                                todaysGames={todayGames}
                                                gameData={game}
                                            />
                                        </div>

                                    );
                                })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpcomingGamesBySport;