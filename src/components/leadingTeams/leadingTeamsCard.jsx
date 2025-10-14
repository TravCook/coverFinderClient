import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LeadingTeamsCard = ({ team, sortedTeams }) => {
    const { pastGames } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const [pickedAsWinner, setPickedAsWinner] = useState([]);
    const [gamesUnderdog, setGamesUnderdog] = useState([]);
    const [gamesFavorite, setGamesFavorite] = useState([]);
    const [teamsSortedCategories, setTeamsSortedCategories] = useState([]);
    const [statCategories, setStatCategories] = useState([]);
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

        let tempStatCategories = Object.keys(team.statCategoryIndexes)
        setStatCategories(tempStatCategories);
        let tempTeamsSortedCategories = tempStatCategories.map((category) => {
            return {
                category,
                teams: [...sortedTeams].sort((a, b) => b.statCategoryIndexes[category] - a.statCategoryIndexes[category])
            };
        });
        setTeamsSortedCategories(tempTeamsSortedCategories);
    }, [pastGames, sportsbook, team, sortedTeams]);

    const totalGamesPlayed = pastGames.filter(
        (game) =>
            (game.homeTeamDetails.espnDisplayName === team.espnDisplayName ||
                game.awayTeamDetails.espnDisplayName === team.espnDisplayName) &&
            new Date(game.commence_time) > startOfSeason
    ).length;
    const renderPercentage = (count, total) =>
        total ? `${count} (${((count / total) * 100).toFixed(1)}%)` : '0 (0.00%)';
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
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row flex-wrap" style={{ width: '100%' }}>
                        {
                            statCategories.map((category) => (
                                <div key={category} className='flex flex-col items-center border my-1' style={{ width: `${statCategories.length <= 5 ? 100 / statCategories.length : 100 / (statCategories.length / 2)}%` }}>
                                    <div className='border-b w-full' style={{ textAlign: 'center' }}>
                                        <span>{category === 'general' ? 'Wins' : `${category.charAt(0).toUpperCase() + category.slice(1)}`}</span>
                                    </div>
                                    <div>
                                        <span>
                                            {`#${teamsSortedCategories.find((t) => t.category === category)?.teams.findIndex((t) => t.id === team.id) + 1}`}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='flex flex-row w-full justify-between'>
                        <div className='flex flex-col'>
                            <div style={{ textAlign: 'center' }}>
                                Picks
                            </div>
                            <div>
                                {renderPercentage(pickedAsWinner?.length, totalGamesPlayed)}
                            </div>
                        </div>
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                Wins
                            </div>
                            <div>
                                {renderPercentage(pickedAsWinner?.filter((g) => g.predictionCorrect).length, pickedAsWinner?.length)}
                            </div>
                        </div>
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                Wins as Dog
                            </div>
                            <div>
                                {renderPercentage(gamesUnderdog?.filter((g) => g.predictionCorrect).length, pickedAsWinner?.filter((g) => g.predictionCorrect)?.length)}
                            </div>
                        </div>
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                Wins as Fav
                            </div>
                            <div>
                                {renderPercentage(gamesFavorite?.filter((g) => g.predictionCorrect).length, pickedAsWinner?.filter((g) => g.predictionCorrect)?.length)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadingTeamsCard;
