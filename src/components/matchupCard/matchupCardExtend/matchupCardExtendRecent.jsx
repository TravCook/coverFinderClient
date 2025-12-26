import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const getLastNGames = (pastGames, teamName, n = 5) => {
    const filtered = pastGames.filter(
        g =>
            g.homeTeamDetails?.espnDisplayName === teamName ||
            g.awayTeamDetails?.espnDisplayName === teamName
    );
    filtered.sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time));
    return filtered.slice(0, n);
};

const MatchupCardExtendRecent = ({ gameData }) => {
    const [activeTeam, setActiveTeam] = useState(gameData.homeTeamDetails.espnDisplayName);
    const { pastGames } = useSelector((state) => state.games);

    const homeTeamLast5 = useMemo(
        () => getLastNGames(pastGames, gameData.homeTeamDetails.espnDisplayName, 5),
        [pastGames, gameData.homeTeamDetails.espnDisplayName]
    );
    const awayTeamLast5 = useMemo(
        () => getLastNGames(pastGames, gameData.awayTeamDetails.espnDisplayName, 5),
        [pastGames, gameData.awayTeamDetails.espnDisplayName]
    );

    return (
        <div className=" rounded-lg shadow-md p-6 w-full">
            {/* buttons to switch teams */}
            <div className="flex justify-center mb-4 space-x-4">
                <button
                    className={`px-4 py-2 rounded ${activeTeam === gameData.homeTeamDetails.espnDisplayName ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setActiveTeam(gameData.homeTeamDetails.espnDisplayName)}
                >
                    {gameData.homeTeamDetails.espnDisplayName}
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTeam === gameData.awayTeamDetails.espnDisplayName ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setActiveTeam(gameData.awayTeamDetails.espnDisplayName)}
                >
                    {gameData.awayTeamDetails.espnDisplayName}
                </button>
            </div>
            <div className="flex w-full">
                <div className="flex flex-col w-full gap-1">
                    {(activeTeam === gameData.homeTeamDetails.espnDisplayName ? homeTeamLast5 : awayTeamLast5).map((g, idx) => (
                        <div
                            key={g.id || idx}
                            className="bg-secondary rounded px-4 py-2 flex items-center justify-evenly"
                        >
                            <div>
                                <span className="font-medium">{new Date(g.commence_time).toLocaleDateString('en-US', {
                                    month: '2-digit', day: 'numeric',
                                    // year: '2-digit'
                                })}</span>
                            </div>
                            <div>
                                {/* away logo  */}
                                <img
                                    src={g.awayTeamDetails?.darkLogo}
                                    alt={g.awayTeamDetails?.espnDisplayName}
                                    className="w-6 h-6 mx-2 inline-block"
                                />
                                {/* <span className="font-semibold">{g.awayTeamDetails?.espnDisplayName}</span> */}
                            </div>
                            <div>
                                {/* score details */}
                                <span className="mx-2">
                                    {g.awayScore} - {g.homeScore}
                                </span>
                            </div>
                            <div>
                                {/* home logo */}
                                <img
                                    src={g.homeTeamDetails?.darkLogo}
                                    alt={g.homeTeamDetails?.espnDisplayName}
                                    className="w-6 h-6 mx-2 inline-block"
                                />
                                {/* <span className="font-semibold">{g.homeTeamDetails?.espnDisplayName}</span> */}
                            </div>
                            <div>
                                {/* win or loss */}
                                <span className={`ml-4 font-semibold ${((g.awayTeamDetails?.espnDisplayName === activeTeam && g.awayScore > g.homeScore) || (g.homeTeamDetails?.espnDisplayName === activeTeam && g.homeScore > g.awayScore)) ? 'text-green-500' : 'text-red-500'}`}>
                                    {((g.awayTeamDetails?.espnDisplayName === activeTeam && g.awayScore > g.homeScore) || (g.homeTeamDetails?.espnDisplayName === activeTeam && g.homeScore > g.awayScore)) ? 'W' : 'L'}
                                </span>
                            </div>
                            <div>
                                {/* prediction correct */}
                                {g.predictedWinner && (
                                    <span className={`ml-2 font-semibold ${((g.predictedWinner === 'away' && g.awayTeamDetails?.espnDisplayName === activeTeam && g.awayScore > g.homeScore) || (g.predictedWinner === 'home' && g.homeTeamDetails?.espnDisplayName === activeTeam && g.homeScore > g.awayScore)) ? 'text-green-500' : 'text-red-500'}`}>
                                        {((g.predictedWinner === 'away' && g.awayTeamDetails?.espnDisplayName === activeTeam && g.awayScore > g.homeScore) || (g.predictedWinner === 'home' && g.homeTeamDetails?.espnDisplayName === activeTeam && g.homeScore > g.awayScore)) ? '✓' : '✗'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchupCardExtendRecent;