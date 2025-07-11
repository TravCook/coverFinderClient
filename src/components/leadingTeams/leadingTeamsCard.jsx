import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LeadingTeamsCard = ({ team, sortedTeams }) => {
    const { pastGames } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const [pickedAsWinner, setPickedAsWinner] = useState([]);
    const [gamesUnderdog, setGamesUnderdog] = useState([]);
    const [gamesFavorite, setGamesFavorite] = useState([]);

    const today = new Date();
    const startOfSeason = new Date(today);
    startOfSeason.setDate(today.getDate() - 150);
    startOfSeason.setHours(0, 0, 0, 0);

    useEffect(() => {
        const tempPAW = pastGames
            .filter((game) => new Date(game.commence_time) > startOfSeason)
            .filter((game) => {
                const prediction =
                    game.predictedWinner === 'home'
                        ? game.homeTeamDetails.espnDisplayName
                        : game.awayTeamDetails.espnDisplayName;
                return prediction === team.espnDisplayName;
            });

        setPickedAsWinner(tempPAW);

        const tempUnderdog = tempPAW.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const market = bookmaker?.markets.find((m) => m.key === 'h2h');
            const outcome = market?.outcomes.find((o) => o.name === team.espnDisplayName);
            return outcome?.price > 0;
        });

        setGamesUnderdog(tempUnderdog);

        const tempFavorite = tempPAW.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const market = bookmaker?.markets.find((m) => m.key === 'h2h');
            const outcome = market?.outcomes.find((o) => o.name === team.espnDisplayName);
            return outcome?.price < 0;
        });

        setGamesFavorite(tempFavorite);
    }, [pastGames, sportsbook, team]);

    const totalGamesPlayed = pastGames.filter(
        (game) =>
            (game.homeTeamDetails.espnDisplayName === team.espnDisplayName ||
                game.awayTeamDetails.espnDisplayName === team.espnDisplayName) &&
            new Date(game.commence_time) > startOfSeason
    ).length;

    const renderPercentage = (count, total) =>
        total ? `${count} (${((count / total) * 100).toFixed(2)}%)` : '0 (0.00%)';

    return (
        <div className="bg-zinc-700 border border-zinc-500 text-white rounded-md p-4 w-full shadow-sm">
            {/* Header */}
            <div className="border-b border-white pb-2 mb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src={team.lightLogo} alt="logo" className="w-6 h-6 object-contain" />
                        <span className="text-sm font-medium">{team.espnDisplayName}</span>
                    </div>
                    <span className="text-sm font-semibold">
                        {sortedTeams && `#${sortedTeams.findIndex((t) => t.id === team.id) + 1}`}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 text-xs">
                {/* Picked as Winner */}
                <div>
                    <div className="flex justify-evenly font-semibold">
                        <span>Picked as Winner</span>
                        <span># Wins</span>
                    </div>
                    <div className="flex justify-evenly">
                        <span>{renderPercentage(pickedAsWinner?.length, totalGamesPlayed)}</span>
                        <span>{pickedAsWinner?.filter((g) => g.predictionCorrect).length}</span>
                    </div>
                </div>

                {/* Profit - Underdog */}
                <div className="flex justify-between">
                    <div className='w-1/2'>
                        <div className="flex justify-evenly font-semibold">
                            <span>Underdog</span>
                            <span># Wins</span>
                        </div>
                        <div className="flex justify-evenly">
                            <span>
                                {renderPercentage(
                                    gamesUnderdog?.length,
                                    pickedAsWinner?.filter((g) => g.sport_key === team.league).length
                                )}
                            </span>
                            <span>{gamesUnderdog?.filter((g) => g.predictionCorrect).length}</span>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <div className="flex justify-evenly font-semibold">
                            <span># Favorite</span>
                            <span># Wins</span>
                        </div>
                        <div className="flex justify-evenly">
                            <span>
                                {renderPercentage(
                                    gamesFavorite?.length,
                                    pickedAsWinner?.filter((g) => g.sport_key === team.league).length
                                )}
                            </span>
                            <span>{gamesFavorite?.filter((g) => g.predictionCorrect).length}</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LeadingTeamsCard;
