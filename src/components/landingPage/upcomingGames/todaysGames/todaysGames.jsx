import { isSameDay } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import MatchupCard from "../../../matchupCard/matchupCard";

const TodaysGames = () => {
    const { games } = useSelector((state) => state.games);
    const today = new Date();
    return (
        <div className='bg-secondary flex flex-col my-2 rounded w-[97%]'>
            <div className='flex justify-center items-center p-2'>
                <h4 style={{ color: 'whitesmoke', textAlign: 'center' }}>{`Today's Games (${games.filter((game) => isSameDay(new Date(game.commence_time), today)).length}) ${today.toLocaleDateString()}`}</h4>
            </div>
            <div className="flex flex-wrap flex-row justify-evenly">
                {games
                    .filter((game) => isSameDay(new Date(game.commence_time), today))
                    .sort((a, b) => {
                        const dateA = new Date(a.commence_time).getTime();
                        const dateB = new Date(b.commence_time).getTime();
                        if (dateA === dateB) {
                            return b.predictionConfidence - a.predictionConfidence;
                        }
                        return dateA - dateB;
                        return b.predictionConfidence - a.predictionConfidence
                        })
                    .map((game, idx) => (
                        <div className='my-2'>
                            <MatchupCard gameData={game} key={idx} />
                        </div>
                    ))
                }
            </div>


        </div>
    );
};

export default TodaysGames;